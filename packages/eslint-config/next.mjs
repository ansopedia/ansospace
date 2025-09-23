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
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];
