import { mkdir } from 'fs-extra'; // Replace fs import
import { dirname, join } from 'node:path';
import { green } from 'picocolors';
import type { Framework } from './index';
import type { PackageManager } from './helper/pkgManager';
import { isWriteable } from './helper/writable';
import { copy } from './helper/copy';

export async function createApp({
  projectName,
  appPath,
  packageManager,
  typescript,
  bundler,
  framework,
  tailwind,
  eslint,
  git,
}: {
  projectName: string;
  appPath: string;
  packageManager: PackageManager;
  typescript: boolean;
  bundler: 'webpack' | 'vite';
  framework: Framework;
  tailwind: boolean;
  eslint: boolean;
  git: boolean;
}): Promise<void> {
  // console.log(appPath);
  if (!(await isWriteable(dirname(appPath)))) {
    console.error(
      'The application path is not writable, please check folder permissions and try again.'
    );
    console.error(
      'It is likely you do not have write permissions for this folder.'
    );
    process.exit(1);
  }
  try {
    await mkdir(appPath, { recursive: true });
  } catch (error) {
    console.error(
      `Failed to create project directory at ${appPath}: ${
        (error as Error).message
      }`
    );
    process.exit(1);
  }
  console.log(
    `\nCreating a new Electron project directory at ${green(appPath)}...\n`
  );

  //   const packageJsonPath = join(appPath, 'package.json');
  // Copy .gitignore if it git is initialized
  if (git)
    await copy('dist/templates/base/_gitignore', join(appPath, '.gitignore'));
}
