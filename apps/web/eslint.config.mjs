import sharedNextConfig from "@ansospace/eslint-config/next-js";

/**
 * ESLint config for the Next.js app.
 * Extends shared monorepo config.
 *
 * @type {import("eslint").Linter.Config[]}
 */
const config = [...sharedNextConfig];

export default config;
