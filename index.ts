#!/usr/bin/env node
import prompts from 'prompts';
// import { readFileSync, writeFileSync } from 'fs';
// import Handlebars from 'handlebars';
// import spawn from 'cross-spawn';
import { Command, OptionValues } from 'commander';
import { configQuestions } from './helper/questions';
import type { PackageManager } from './helper/pkgManager';
import { getPkgManager } from './helper/pkgManager';
import { bold, red, blue } from 'picocolors';
import { resolve } from 'path';
import {
  isFolderEmpty,
  resolveProjectPath,
} from './helper/ensureProjectFolder.js';
import pkgJson from './package.json';
import { createApp } from './create';

// Handle Cli

let projectName: string;
let appPath: string;
export type Framework = 'react' | 'vue' | 'svelte' | null;

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
  .option('--webpack', 'Initialize a project with Webpack for module bundling')
  .option('--vite', 'Initialize a project with Vite for fast development')
  .option(
    '--react',
    'Initialize a project with React for building UI components'
  )
  .option(
    '--vue',
    'Initialize a project with Vue.js for progressive web applications'
  )
  .option(
    '--svelte',
    'Initialize a project with Svelte for lightweight and reactive UI'
  )
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

    // opts.OptionValue can be `undefined` if not passed
    // for undefined cases, !!undefined = false
    // for passed cases, !!true = true
    console.log(!!opts.skipInstall);

    const packageManager: PackageManager = !!opts.useNpm
      ? 'npm'
      : !!opts.usePnpm
      ? 'pnpm'
      : !!opts.useYarn
      ? 'yarn'
      : !!opts.useBun
      ? 'bun'
      : getPkgManager();

    console.log(packageManager);

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
            console.error('[Interruption] - Exiting.');
            process.exit(1);
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
    const hasOpts = Object.keys(opts).some((key) => opts[key] !== undefined);

    if (!hasOpts) {
      // No arguments or options: trigger prompt directly
      await runAllPrompts(projectName, appPath, packageManager);
    } else {
      // Handle cases where options are provided (optional over
      console.log('implementation pending');
      await runWithOptions(opts, projectName, appPath, packageManager);
      // await runWithOptions(projectName, opts); // Use provided options
    }
  })
  .allowUnknownOption()
  .parse(process.argv);

// handlebars
// const templateSource = readFileSync('./template/test.handlebars', 'utf-8');
// const template = Handlebars.compile(templateSource);

async function runAllPrompts(
  projectName: string,
  appPath: string,
  packageManager: PackageManager
): Promise<void> {
  const response = await prompts(configQuestions, {
    onCancel: () => {
      console.log(red('[Cancelled] - Exiting.'));
      process.exit(1);
    },
  });
  // console.log(response);

  let tailwind = false;
  let eslint = false;

  let { typescript, bundler, needsFramework, needsTools, git } = response;
  let framework: Framework = needsFramework ? response.framework : null;
  if (needsTools && response.tools !== undefined) {
    tailwind = response.tools.includes('tailwindcss');
    eslint = response.tools.includes('eslint');
  }
  console.log(typescript, bundler, framework, tailwind, eslint, git);

  createApp({
    projectName,
    appPath,
    packageManager,
    typescript,
    bundler,
    framework,
    tailwind,
    eslint,
    git,
  });
}

async function runWithOptions(
  opts: OptionValues,
  projectName: string,
  appPath: string,
  packageManager: PackageManager
): Promise<void> {
  let typescript;
  let bundler;
  let framework: Framework;
  let tailwind = false;
  let eslint = false;

  // <Check the language> passed in opts (!undefined = true)
  // If both are not passed then prompt (true && true)
  if (!opts.typescript && !opts.javascript) {
    typescript = (await prompts(configQuestions[0])).typescript;
  } else {
    // If one of them is true
    typescript = !!opts.typescript ? true : false;
  }

  // <Check the bundler> passed in opts
  if (!opts.webpack && !opts.vite) {
    bundler = (await prompts(configQuestions[1])).bundler;
  } else {
    // If one of them is true
    bundler = !opts.webpack ? 'webpack' : 'vite';
  }

  // <Check framework>
  if (!opts.react && !opts.vue && !opts.svelte) {
    const frameworkResponse = await prompts([
      configQuestions[2],
      configQuestions[3],
    ]);
    frameworkResponse.needsFramework
      ? (framework = frameworkResponse.framework)
      : (framework = null);
  } else {
    // If one of them is true, set the framework based on opts
    framework = opts.react ? 'react' : opts.vue ? 'vue' : 'svelte';
  }

  // <Check if any tools were passed>
  if (!opts.tailwind && !opts.eslint) {
    const toolChoices = await prompts([configQuestions[4], configQuestions[5]]);
    console.log('needstool value', toolChoices.needsTools);

    if (toolChoices.needsTools) {
      tailwind = toolChoices.tools.includes('tailwindcss');
      eslint = toolChoices.tools.includes('eslint');
      console.log('tailwind and es conditions', tailwind, eslint);
    }
  } else {
    // If one of them is true
    tailwind = opts.tailwind === true;
    eslint = opts.eslint === true;
  }

  // Ask for git
  const git: boolean = (await prompts(configQuestions[6])).git;
  console.log(typescript, bundler, framework, tailwind, eslint, git);
  createApp({
    projectName,
    appPath,
    packageManager,
    typescript,
    bundler,
    framework,
    tailwind,
    eslint,
    git,
  });
}

// console.log(`hello from ${pc.bgBlue(pc.white("Typescript"))}`);
