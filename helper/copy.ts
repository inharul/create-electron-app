import { copyFile } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function copy(source: string, destination: string): Promise<void> {
  try {
    if (!existsSync(destination)) {
      const sourcePath = resolve(__dirname, '..', source);
      await copyFile(sourcePath, destination);
    }
  } catch (e) {
    console.error(
      `Error occured while copying file to ${destination}: ${e as Error}`
    );
  }
}
