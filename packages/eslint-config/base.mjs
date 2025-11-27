import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const baseConfig = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
      semi: ["error"],
      "no-console": ["warn"],
      "prefer-const": ["error"],
      "jsx-quotes": ["error", "prefer-double"],
      quotes: ["error", "double"],
      // Turn off base rule as it conflicts with TypeScript version
      "no-unused-vars": "off",
      // Use TypeScript-specific rule that handles function parameters better
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // Ignore unused arguments prefixed with an underscore
          varsIgnorePattern: "^_", // Ignore unused variables prefixed with an underscore
          // Don't check function arguments (useful for type definitions and callbacks)
          args: "none",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true, // Ignore unused variables in rest/spread patterns
        },
      ],
    },
  },
  // File-specific override for type definition files
  {
    files: ["**/*.ts"],
    rules: {
      // Allow unused parameters in function type definitions
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          args: "none", // Don't check function arguments
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    ignores: ["dist/**"],
  },
];
