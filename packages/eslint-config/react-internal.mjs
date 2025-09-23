import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

import { baseConfig } from "./base.mjs";

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config} */
export const reactConfig = [
  // Start with the base configuration from your project.
  ...baseConfig,

  // Apply ESLint's recommended rules and Prettier configuration.
  js.configs.recommended,
  eslintConfigPrettier,

  // Apply TypeScript's recommended rules.
  ...tseslint.configs.recommended,

  // Apply React's recommended rules and the react-hooks rules.
  {
    ...pluginReact.configs.flat.recommended,
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    plugins: {
      "react-hooks": pluginReactHooks,
      "jsx-a11y": eslintPluginJsxA11y,
    },
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      // Include all recommended jsx-a11y rules here
      ...eslintPluginJsxA11y.flatConfigs.recommended.rules,
    },
  },
];
