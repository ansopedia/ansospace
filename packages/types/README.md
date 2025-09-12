# @ansospace/types

This package provides shared TypeScript type definitions for the AnsoSpace platform. It is intended for internal use across the monorepo to ensure consistent and reusable type safety for core entities.

## Overview

- Defines interfaces for key domain models such as `User` and `Course`.
- Enables type-safe imports of these interfaces throughout the codebase.
- Compiled to JavaScript and declaration files for consumption by other packages.

## Installation

Since this package is private and used internally, it is typically installed as part of the monorepo workspace.

## Usage

Import the types as needed:

```ts
import { Course } from "@ansospace/types/course";
import { User } from "@ansospace/types/user";
```

## Development

- Source files are located in the `src/` directory.
- Build the package using:

```bash
pnpm run build
```

- The compiled output is in the `dist/` directory.

## Best Practices

- Keep this package focused on type definitions only.
- Avoid adding runtime code to maintain lightweight builds.
- Update the version and changesets carefully to reflect breaking changes.
- Use semantic versioning to communicate changes to consumers.

## Contributing

Contributions should follow the monorepo guidelines and ensure type safety and consistency.

## License

This package is private and intended for internal use only.
