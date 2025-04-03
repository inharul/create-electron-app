import { username } from "username";
import { spawn } from "@malept/cross-spawn-promise";
import prompts from "prompts";

type PackagePerson =
  | undefined
  | string
  | {
      name: string;

      email?: string;

      url?: string;
    };

async function getGitConfig(name: string, cwd: string): Promise<string> {
  const value = await spawn("git", ["config", "--get", name], { cwd });
  return value.trim();
}

const getAuthorFromGitConfig = async (dir: string): Promise<PackagePerson> => {
  try {
    const name = await getGitConfig("user.name", dir);
    const email = await getGitConfig("user.email", dir);
    return { name, email };
  } catch (err) {
    let author = await prompts(
      {
        name: "authorName",
        message: "Could not fetch author name for repo",
        type: "text",
        initial: `${await username()}`,
      },
      {
        onCancel: () => {
          return undefined;
        },
        onSubmit: () => {
          return author.authorName;
        },
      }
    );

    return undefined;
  }
};

export default async (dir: string): Promise<PackagePerson> =>
  (await getAuthorFromGitConfig(dir)) || username();
