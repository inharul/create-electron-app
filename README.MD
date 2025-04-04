# @inharul/create-electron-app

Scaffold an Electron project with custom configuration in interactive mode.

```
templates/
├── base/
│   ├── preload.js              # Common preload script for all configs
│   ├── package.base.json       # Base package.json with common fields
│   └── configs/                # Common configurations
│       ├── tailwind.config.js  # Tailwind configuration
│       ├── postcss.config.js   # PostCSS configuration
│       ├── .eslintrc.js       # ESLint base configuration
│       └── .prettierrc        # Prettier configuration
├── languages/
│   ├── js/
│   │   └── index.js           # Main process file for JavaScript
│   └── ts/
│       ├── index.ts           # Main process file for TypeScript
│       └── tsconfig.json      # TypeScript configuration
├── bundlers/
│   ├── webpack/
│   │   ├── forge.config.js    # Webpack-specific Forge config
│   │   ├── webpack.main.config.js      # Webpack main process config
│   │   └── webpack.renderer.config.js  # Webpack renderer config
│   └── vite/
│       ├── forge.config.js    # Vite-specific Forge config
│       ├── vite.main.config.js        # Vite main process config
│       └── vite.renderer.config.js    # Vite renderer config
├── frameworks/
│   ├── plain/
│   │   ├── renderer.js        # Plain JavaScript renderer
│   │   ├── renderer.ts        # Plain TypeScript renderer
│   │   └── styles.css        # Plain CSS styles
│   ├── react/
│   │   ├── renderer.js        # React JavaScript entry
│   │   ├── renderer.ts        # React TypeScript entry
│   │   ├── App.jsx           # React JavaScript component
│   │   ├── App.tsx           # React TypeScript component
│   │   └── App.css           # React styles
│   ├── vue/
│   │   ├── renderer.js        # Vue JavaScript entry
│   │   ├── renderer.ts        # Vue TypeScript entry
│   │   ├── App.vue           # Vue single file component
│   │   └── style.css         # Vue styles
│   └── svelte/
│       ├── renderer.js        # Svelte JavaScript entry
│       ├── renderer.ts        # Svelte TypeScript entry
│       ├── App.svelte        # Svelte component
│       └── app.css           # Svelte styles
└── dependencies/
    ├── language.js.json       # JS-specific dependencies
    ├── language.ts.json       # TS-specific dependencies
    ├── bundler.webpack.json   # Webpack-specific dependencies
    ├── bundler.vite.json      # Vite-specific dependencies
    ├── framework.plain.json   # Plain framework dependencies
    ├── framework.react.json   # React-specific dependencies
    ├── framework.vue.json     # Vue-specific dependencies
    ├── framework.svelte.json  # Svelte-specific dependencies
    └── styling.json          # Tailwind, PostCSS dependencies
```
