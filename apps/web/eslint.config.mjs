import sharedNextConfig from "@ansospace/eslint-config/next-js";
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

/**
 * ESLint config for the Next.js app.
 * Extends shared monorepo config and adds Next's built-ins.
 *
 * @type {import("eslint").Linter.Config[]}
 */
const config = [
  ...sharedNextConfig,
  // Here, add next/core-web-vitals using compat. The next deps live in THIS package.
  ...compat.extends("next", "next/core-web-vitals", "next/typescript"),
];

export default config;
