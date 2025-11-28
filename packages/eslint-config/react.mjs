import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

import { baseConfig } from "./base.mjs";

/**
 * ESLint configuration for React libraries and components.
 * Extends base configuration with React, React Hooks, and JSX a11y rules.
 */
export const reactConfig = [
  ...baseConfig,
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
      // Include all recommended jsx-a11y rules
      ...eslintPluginJsxA11y.flatConfigs.recommended.rules,
    },
  },
];
