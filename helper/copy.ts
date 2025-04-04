import { copyFile } from 'fs/promises';
import { existsSync } from 'fs';

export async function copy(source: string, destination: string): Promise<void> {
  try {
    if (!existsSync(destination)) {
      await copyFile(source, destination);
    }
  } catch (e) {
    console.error(
      `Error occured while copying file to ${destination}: ${e as Error}`
    );
  }
}
