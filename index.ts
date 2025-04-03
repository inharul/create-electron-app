#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import prompts from 'prompts';
import Handlebars from 'handlebars';
import spawn from 'cross-spawn';
import { Command } from 'commander';
import { configQuestions } from './helper/questions';
import { getPkgManager } from './helper/pkgManager';
import { bold, red, blue } from 'picocolors';
import { resolve } from 'path';
import {
  isFolderEmpty,
  resolveProjectPath,
} from './helper/ensureProjectFolder';
import pkgJson from './package.json';

// Handle Cli

let projectName: string;
let appPath: string;
const program = new Command();

program
  .version(pkgJson.version, '-v, --version', 'Output the current version.')
  .name(pkgJson.name)
  .description(
    'Scaffold an Electron project with custom configuration in interactive mode.'
  )
  .argument('[directory]')
  .usage('[directory] [options]')
  .helpOption('-h, --help', 'Display this help message.')
  // Define options (optional, for override via flags)
  .option('--ts, --typescript', 'Initialize as a TypeScript project')
  .option('--js, --javascript', 'Initialize as a JavaScript project')
  .option('--tailwind', 'Initialize with Tailwind CSS config')
  .option('--eslint', 'Initialize with ESLint config')
  .option('--use-npm', 'Use npm as the package manager')
  .option('--use-pnpm', 'Use pnpm as the package manager')
  .option('--use-yarn', 'Use Yarn as the package manager')
  .option('--use-bun', 'Use Bun as the package manager')
  .option('--skip-install', 'Skip installing packages')
  .action(async () => {
    const opts = program.opts();
    const args = program.args;

    if (args.length > 0) {
      projectName = args[0]; // Use the first argument as project name
      console.log(projectName);
    } else {
      const nameResponse = await prompts(
        {
          name: 'projectName',
          message: "What's the name of your project?",
          type: 'text',
          initial: 'my-app',
        },
        {
          // Only projectName question
          onCancel: () => {
            throw new Error('Prompt cancelled by user.');
          },
        }
      );
      if (!nameResponse || typeof nameResponse.projectName !== 'string') {
        throw new Error('Please specify the `projectName` option.');
      }
      projectName = nameResponse.projectName;
    }

    // Step 2: Check if folder exists
    appPath = resolve(projectName);
    if (!isFolderEmpty(appPath)) {
      console.log(
        `Directory ${blue(appPath)} ${bold('already exists')} and is not empty.`
      );
      let pathResponse = await prompts(
        {
          name: 'projectPath',
          message: 'Please provide a different path for your project',
          type: 'text',
          initial: './',
          validate: (value: string) => {
            const resolvedPath = resolveProjectPath(value, projectName);
            return isFolderEmpty(resolvedPath)
              ? true
              : `Directory ${bold(
                  resolvedPath
                )} also already exists and is not empty.`;
          },
        },
        {
          onCancel: () => {
            throw new Error('Prompt cancelled by user.');
          },
        }
      );
      appPath = resolveProjectPath(pathResponse.projectPath, projectName);
      console.log(`Selected Destination: ${blue(appPath)}`);
    }

    // Check if any options or args were provided
    const hasArgsOrOpts =
      args.length > 0 ||
      Object.keys(opts).some((key) => opts[key] !== undefined);

    if (!hasArgsOrOpts) {
      // No arguments or options: trigger prompt directly
      await runPrompts();
    } else {
      // Handle cases where options are provided (optional over
      console.log('implementation pending');
      // await runWithOptions(projectName, opts); // Use provided options
    }
  })
  .allowUnknownOption()
  .parse(process.argv);

// handlebars
const templateSource = readFileSync('./template/test.handlebars', 'utf-8');
const template = Handlebars.compile(templateSource);

async function runPrompts(): Promise<void> {
  const response = await prompts(configQuestions, {
    onCancel: () => {
      console.log(red('[Cancelled] - Exiting.'));
      process.exit(1);
    },
  });

  const html = template(response);
  // console.log(response);
  writeFileSync('./template/index.html', html);
  console.log('\nChecking for your package manager...');
  const pkgManager = getPkgManager();
  console.log(`\nFound ${pkgManager} package manager.`);

  console.log('\nChecking for current libraries...');
  const child = spawn('npm', ['list', '-g', '-depth', '0'], {
    stdio: 'inherit',
  });
  child.on('close', () => console.log('\nDone.'));
}

// console.log(`hello from ${pc.bgBlue(pc.white("Typescript"))}`);
