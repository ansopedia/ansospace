# `@ansospace/eslint-config`

Shared ESLint configuration for AnsoSpace projects with TypeScript, SonarJS, React, Next.js, and Node.js support.

> **Note:** This package requires ESLint 9+ and uses the flat config format only. Legacy `.eslintrc.js` format is not supported.

## Installation

```bash
npm install --save-dev @ansospace/eslint-config
# or
pnpm add -D @ansospace/eslint-config
# or
yarn add -D @ansospace/eslint-config
```

## Features

- **TypeScript Support**: Full TypeScript linting with `typescript-eslint`
- **Code Quality**: SonarJS rules for bug detection and code smells
- **React Support**: React and React Hooks rules via `react` config
- **Next.js Support**: Next.js specific rules via `next-js` config
- **Node.js/Express Support**: Node.js and Express.js optimized config via `node` config
- **Prettier Integration**: Prevents conflicts with Prettier formatting
- **Turbo Support**: Turbo-specific rules for monorepo optimization

## Configurations

### Base Configuration

The base configuration includes TypeScript, SonarJS, and common rules.

```javascript
// eslint.config.js (ESLint 9+ flat config)
import { baseConfig } from "@ansospace/eslint-config/base";

export default [...baseConfig];
```

### React Libraries

For React libraries and components:

```javascript
import { reactConfig } from "@ansospace/eslint-config/react";

export default reactConfig;
```

### Next.js Applications

For Next.js applications:

```javascript
import { nextConfig } from "@ansospace/eslint-config/next-js";

export default nextConfig;
```

### Node.js/Express.js Applications

For Node.js and Express.js backend applications:

```javascript
import { nodeConfig } from "@ansospace/eslint-config/node";

export default [...nodeConfig];
```

#### What's Included

The `node` config includes:

- ✅ **Node.js globals**: `process`, `Buffer`, `__dirname`, etc.
- ✅ **SonarJS**: All recommended SonarJS rules for code quality
- ✅ **TypeScript**: Full TypeScript support with `typescript-eslint`
- ✅ **Strict TypeScript rules**: `prefer-nullish-coalescing`, `strict-boolean-expressions`
- ✅ **Code style rules**: `prefer-template`, `prefer-arrow-callback`, `func-style`, `prefer-destructuring`
- ✅ **Express.js friendly defaults**:
  - `no-underscore-dangle: off` (allows `req._parsedUrl`, etc.)
  - `func-names: off` (allows anonymous functions in routes)
  - `no-console: error` (strict by default, can be overridden)
  - `indent: ["error", 2]` (2-space indentation)

#### Express.js Example with Custom Rules

```javascript
// eslint.config.js
import { nodeConfig } from "@ansospace/eslint-config/node";
import checkFile from "eslint-plugin-check-file";

export default [
  ...nodeConfig,
  {
    plugins: {
      "check-file": checkFile,
    },
    rules: {
      // File naming conventions (requires eslint-plugin-check-file)
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{ts,tsx}": "KEBAB_CASE",
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "src/**/!^[.*": "KEBAB_CASE",
        },
      ],
      // Custom rules
      "max-len": ["error", { code: 100 }],
      "prefer-destructuring": [
        "error",
        {
          array: false,
          object: false,
        },
      ],
    },
  },
];
```

#### Migration from Legacy Config

If you're migrating from a legacy `.eslintrc.js` format:

**Before (Legacy `.eslintrc.js`):**

```javascript
/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ["@zurutech/eslint-config", "plugin:sonarjs/recommended-legacy"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["sonarjs"],
  rules: {
    "no-console": "error",
    "func-names": ["error", "never"],
    // ... more rules
  },
};
```

**After (ESLint 9+ Flat Config `eslint.config.js`):**

```javascript
import { nodeConfig } from "@ansospace/eslint-config/node";

export default [
  ...nodeConfig,
  {
    rules: {
      // Your custom rules
      "func-names": ["error", "never"],
      "max-len": ["error", { code: 100 }],
    },
  },
];
```

#### TypeScript Support

For TypeScript files, the config automatically:

- Uses `typescript-eslint` parser
- Enables TypeScript-specific rules
- Uses `tsconfig.eslint.json` if available, falls back to `tsconfig.json`
- Allows `require()` in `.ts` files (with warning)
- Warns on `any` types (doesn't error)

#### Customizing Rules

You can override any rules in your `eslint.config.js`:

```javascript
import { nodeConfig } from "@ansospace/eslint-config/node";

export default [
  ...nodeConfig,
  {
    rules: {
      // Override console.log to be an error
      "no-console": "error",
      // Custom max line length
      "max-len": ["error", { code: 120 }],
      // Disable specific SonarJS rule
      "sonarjs/cognitive-complexity": "off",
    },
  },
];
```

#### Ignored Files

The config automatically ignores:

- `dist/**`, `build/**`, `node_modules/**`
- `**/.eslintrc.js`, `**/*.config.js`, `**/*.config.mjs`
- `**/*.md`, `eslint.config.mjs`
- `coverage**/*`, `*.history`

## Available Configurations

- `base`: Base configuration with TypeScript, SonarJS, and common rules
- `react`: For React libraries and components
- `next-js`: For Next.js applications
- `node`: For Node.js and Express.js backend applications

## SonarJS Rules

All SonarJS recommended rules are enabled. Code quality rules are set to warnings to allow incremental improvement:

- `sonarjs/cognitive-complexity`: Warning (threshold: 15)
- `sonarjs/no-nested-conditional`: Warning
- `sonarjs/no-duplicate-string`: Warning
- `sonarjs/no-identical-functions`: Warning
- `sonarjs/pseudo-random`: Warning (for UI/non-critical contexts)
- `sonarjs/no-commented-code`: Warning
- `sonarjs/no-small-switch`: Warning
- `sonarjs/no-redundant-boolean`: Warning
- `sonarjs/prefer-immediate-return`: Warning

Critical bug detection and security rules remain as errors.

## TypeScript Support

TypeScript is fully supported. The configuration:

- Uses `typescript-eslint` for TypeScript-specific rules
- Handles unused variables and parameters correctly
- Supports type definitions and function signatures
- Works with both `.ts` and `.tsx` files

## License

MIT
