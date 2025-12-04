import turboPlugin from "eslint-plugin-turbo";

import { baseConfig } from "./base.mjs";

/**
 * ESLint configuration for Turborepo monorepos.
 * Extends base config with Turbo-specific rules.
 * Use this config only if your project uses Turborepo.
 */
export default [
  ...baseConfig,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
];

