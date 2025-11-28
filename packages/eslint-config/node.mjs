import globals from "globals";
import tseslint from "typescript-eslint";

import { baseConfig } from "./base.mjs";

/**
 * ESLint configuration for Node.js and Express.js applications.
 * Extends base configuration with Express.js specific rules and settings.
 */
export const nodeConfig = [
  // Start with base configuration (includes TypeScript, SonarJS, etc.)
  ...baseConfig,
  {
    ignores: [
      "**/.eslintrc.js",
      "**/*.config.js",
      "**/*.config.mjs",
      "**/*.md",
      "**/dist",
      "**/build",
      "eslint.config.mjs",
      "coverage**/*",
      "*.history",
      "node_modules/**",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: {
        ...globals.browser, // Matches your Express.js config
        ...globals.node,
        ...globals.es2021,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      // Override React-specific rules from base (not needed in Node.js/Express)
      "jsx-quotes": "off",
      // Express.js specific rules
      "no-console": "error", // Strict: no console in production code
      "no-underscore-dangle": "off", // Common in Express.js (req._parsedUrl, etc.)
      "func-names": "off", // Allow anonymous functions in Express routes
      "no-process-exit": "warn", // Allow process.exit() in Node.js
      // Code style rules (matching your Express.js config)
      indent: ["error", 2],
      "prefer-template": "error",
      "prefer-arrow-callback": "error",
      "func-style": ["error", "expression"], // Prefer arrow functions and function expressions
      "prefer-destructuring": ["error", { object: true, array: true }],
    },
  },
  // TypeScript files specific configuration
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        // Use tsconfig.eslint.json if available, fallback to tsconfig.json
        project: ["./tsconfig.eslint.json", "./tsconfig.json"],
      },
    },
    rules: {
      // Strict TypeScript rules (matching your Express.js config)
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/no-var-requires": "warn", // Allow require() in .ts files for compatibility
      "@typescript-eslint/explicit-function-return-type": "off", // Flexible return types
      "@typescript-eslint/no-explicit-any": "warn", // Warn on any, but don't error
    },
  },
];
