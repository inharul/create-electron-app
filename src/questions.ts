// Questions to prompt to the user.
import { PromptObject } from "prompts";
import { blue, yellow, dim } from "picocolors";

export const configQuestions: PromptObject[] = [
  {
    type: "toggle",
    name: "typescript",
    message: "Select your language",
    active: blue("TypeScript"),
    inactive: yellow("JavaScript"),
  }, // ts, js
  {
    type: "select",
    name: "bundler",
    message: "How would you like to bundle your app?",
    instructions: false,
    choices: [
      {
        title: "Webpack",
        description:
          "A battle-tested setup with full Electron support and extensive plugin compatibility.",
        value: "webpack",
      },
      {
        title: `Vite ${dim("(experimental)")}`,
        description:
          "A faster build process using Vite, but still in development",
        value: "vite",
      },
    ],
  }, // wp, vite
  {
    type: "toggle",
    name: "needsFramework",
    message: "Do you want to use any framework?",
    active: "Yes",
    inactive: "No",
  },
  {
    type: (prev: any) => prev && "select",
    name: "framework",
    message: "Select a framework",
    choices: [
      {
        title: "React",
        value: "react",
      },
      { title: "Vue 3", value: "vue" },
    ],
  }, // react, vue
  {
    type: "select",
    name: "tool",
    message: "Do you need any other tools?",
    choices: [
      { title: "No", value: false },
      {
        title: "Yes",
        description: "(tailwindcss, eslint etc.)",
        value: true,
      },
    ],
  },
  {
    type: (prev: any) => prev && "multiselect",
    name: "tools",
    message: "Select your tools",
    hint: `- Space for toggling selections then Return to submit.`,
    instructions: false,
    choices: [
      { title: "TailwindCSS", value: "tailwind" },
      { title: "ESLint", value: "eslint" },
    ],
  }, // tailwind, eslint
  {
    type: "toggle",
    name: "git",
    message: "Intialize a git repository?",
    active: "Yes",
    inactive: "No",
  },
];
