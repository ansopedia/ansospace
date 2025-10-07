# @ansospace/types

This package provides shared TypeScript type definitions and Zod validation schemas for the AnsoSpace platform. It is intended for internal use across the monorepo to ensure consistent and reusable type safety for core entities, authentication, notifications, and more.

## Overview

- Defines interfaces and types for key domain models including authentication, users, roles, permissions, notifications, OTP, tokens, and socket events.
- Provides Zod schemas for validation with branded types for enhanced type safety.
- Enables type-safe imports throughout the codebase.
- Compiled to JavaScript and declaration files for consumption by other packages.
- Restructured for better readability, consistency, and maintainability with renamed types, grouped related schemas, and optimized code.

## Features

- **Modular Structure**: Organized into logical modules (auth, user, notification, etc.) for better maintainability.
- **Branded Types**: Uses Zod's `.brand()` to create distinct types (e.g., `Username`, `Password`) instead of plain strings.
- **Validation Schemas**: Comprehensive Zod schemas for data validation and parsing, all consistently named with 'Schema' suffix.
- **Consistent Naming**: PascalCase for types, camelCase for schemas, descriptive names.
- **Grouped Related Types**: Token payloads moved to token.ts, auth-related in auth.ts.
- **Refactored Repeated Structures**: Branded schemas used consistently, removed duplicates.
- **No Heavy Dependencies**: Removed mongoose and socket.io dependencies, using regex for ObjectId validation and keeping only interfaces for sockets.

## Installation

Since this package is private and used internally, it is typically installed as part of the monorepo workspace.

## Usage

Import the types and schemas as needed:

```ts
// Import specific types
import type { User, RegisterSchema } from "@ansospace/types";
import { registerSchema, usernameSchema, validateProfileSchema } from "@ansospace/types";

// Use branded types by parsing through schemas
const user: User = { ... };
const validUser = registerSchema.parse(userData); // For simple schemas

// For complex schemas with custom validation, use validate functions
const validProfile = validateProfileSchema(profileData);

// Create branded types
const uname: Username = usernameSchema.parse("validusername");
```

### Available Modules

- `auth`: Authentication-related types and schemas (Username, Password, Email, Login, Session, etc.)
- `user`: User management (User, Role, Permission, Profile, etc.)
- `notification`: Notification types and email validation schemas
- `otp`: OTP-related schemas and events
- `token`: Token schemas, payloads, and types
- `socket`: Socket.io event interfaces (without dependencies)
- `common`: Shared utilities like ObjectId, DeviceInfo, Pagination

## Development

- Source files are located in the `src/` directory, organized by module.
- Build the package using:

```bash
pnpm run build
```

- The compiled output is in the `dist/` directory.

## Best Practices

- Always use schema parsing (`.parse()`) to create branded types instead of direct assignment.
- Keep this package focused on types and validation schemas only.
- Avoid adding runtime code to maintain lightweight builds.
- Update the version and changesets carefully to reflect breaking changes.
- Use semantic versioning to communicate changes to consumers.
- Follow consistent naming: Schemas with 'Schema' suffix, types PascalCase, descriptive names.

## Contributing

Contributions should follow the monorepo guidelines and ensure type safety and consistency.

## License

This package is private and intended for internal use only.
