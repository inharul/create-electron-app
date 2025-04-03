import { existsSync, readdirSync } from "fs";
import { join, resolve } from "path";

export function isFolderEmpty(path: string): boolean {
  // Check if the folder exists, if it does then check if it is empty
  return !existsSync(path) ? true : readdirSync(path).length === 0;
}

export function resolveProjectPath(
  basePath: string,
  projectName: string
): string {
  // If basePath starts with './', use current working directory as base
  const resolvedBase = basePath.startsWith("./")
    ? process.cwd()
    : resolve(basePath);
  // Join with projectName to create full path
  return join(resolvedBase, projectName);
}
