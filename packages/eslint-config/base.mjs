import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import sonarjsPlugin from "eslint-plugin-sonarjs";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";

/**
 * A shared ESLint configuration for the repository.
 * Includes TypeScript, SonarJS, and common rules.
 */
export const baseConfig = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      sonarjs: sonarjsPlugin,
      turbo: turboPlugin,
    },
    rules: {
      // Turbo rules
      "turbo/no-undeclared-env-vars": "warn",
      // Code style rules
      semi: ["error"],
      "no-console": ["warn"],
      "prefer-const": ["error"],
      "jsx-quotes": ["error", "prefer-double"],
      quotes: ["error", "double"],
      // SonarJS rules - Code quality and bug detection
      // Use all recommended rules from SonarJS
      ...sonarjsPlugin.configs.recommended.rules,
      // Override specific rules to be warnings for better developer experience
      // These are important but can be improved incrementally without blocking builds
      "sonarjs/cognitive-complexity": ["warn", 15],
      "sonarjs/no-nested-conditional": "warn",
      "sonarjs/no-duplicate-string": "warn",
      "sonarjs/no-identical-functions": "warn",
      "sonarjs/table-header": "warn", // Accessibility - important but can be warning
      "sonarjs/no-redundant-boolean": "warn",
      "sonarjs/prefer-immediate-return": "warn",
      "sonarjs/pseudo-random": "warn", // Security - warning for UI/non-critical contexts
      "sonarjs/no-commented-code": "warn", // Commented code can be useful for docs
      "sonarjs/no-small-switch": "warn",
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
    ignores: [
      "dist/**",
      "build/**",
      "node_modules/**",
      "**/*.json", // JSON files should be formatted by Prettier only, not linted by ESLint
      "**/*.jsonc", // JSONC files (like tsconfig.json) should be formatted by Prettier only
    ],
  },
];
