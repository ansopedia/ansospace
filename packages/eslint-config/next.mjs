import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import { globalIgnores } from "eslint/config";

import { baseConfig } from "./base.mjs";

/**
 * ESLint configuration for Next.js projects.
 * Extends base configuration with Next.js specific rules.
 * Note: This does NOT depend on `next` being installed.
 */
export const nextConfig = [
  ...baseConfig, // base rules (TypeScript, SonarJS, Prettier)
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      ...eslintPluginJsxA11y.flatConfigs.recommended.rules,
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];
