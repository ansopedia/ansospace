import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { globalIgnores } from "eslint/config";
import { baseConfig } from "./base.mjs";
import { reactConfig } from "./react-internal.mjs";

/**
 * Shared ESLint config for Next.js projects.
 * This does NOT depend on `next` being installed.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...baseConfig, // base rules (TypeScript, Prettier, Turbo)
  ...reactConfig, // React + React Hooks rules
   ...nextVitals,
  ...nextTs,
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
