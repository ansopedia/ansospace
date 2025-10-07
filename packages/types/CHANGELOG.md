# @ansospace/types

## 0.3.8

### Patch Changes

- Renamed `mongooseObjectId` to `objectId` and `MongooseObjectId` to `ObjectId` in `common.ts`.
- Updated `objectId` schema to use `ObjectId` from "bson" for validation and transformation.

## 0.3.7

### Minor Changes

- Added `LoginResponse` type

## 0.3.6

### Minor Changes

- Added `IApiResponse<T>` type for standardized API response handling across the platform.

## 0.3.5

### Patch Changes

- Refactored `gender` and `pronouns` enums in `profileSchema` to use exported constants `Genders` and `Pronouns`.

## 0.3.4

### Minor Changes

- Added optional `gender` and `pronouns` fields to `profileSchema`.

## 0.3.3

### Patch Changes

- Added `prepublishOnly` script to run `pnpm build` before publishing, ensuring the package is built.

## 0.3.2

### Patch Changes

- Updated `objectId` schema in `common.ts` to use `mongoose.Types.ObjectId.isValid` for validation and transform strings into `mongoose.Types.ObjectId` instances.
- Fixed type incompatibility issues between client-side string `id` and Mongoose `ObjectId` by aligning validation and transformation logic.

## 0.3.1

### Patch Changes

- **Fixed:** Corrected package publishing configuration to prevent the `src` directory and `tsconfig.json` from being included in the npm package. This resolves "File not found" errors in consumer applications.
- **Fixed:** Updated `package.json` to correctly specify published files, ensuring only the `dist` directory and other necessary files are included.

## 0.3.0

### Minor Changes

- Standardized validation functions: Removed simple validate functions for basic schemas; users should use schema.parse() directly. Kept validate functions only for complex schemas with custom logic (e.g., validateProfileSchema, validateEmailNotification).

## 0.2.0

### Minor Changes

- Restructured types for enhanced readability, code optimization, and best practices: Consistent naming conventions (schemas with 'Schema' suffix, types PascalCase), descriptive names (e.g., 'LoggedInUser' to 'AuthenticatedUser'), grouped related types (moved token payloads to token.ts), refactored repeated structures (used branded schemas consistently).
- Renamed types and schemas across files for consistency: e.g., username -> usernameSchema, Tokens -> TokenType, otpSchema -> otpRecordSchema.
- Updated imports and exports to use branded schemas from auth.ts in all files, removed duplicates.
- Improved type safety with consistent branding and validation.

## 0.1.0

### Minor Changes

- Restructured the monolithic `index.ts` into modular files for better maintainability: `auth.ts`, `user.ts`, `notification.ts`, `otp.ts`, `token.ts`, `socket.ts`, and `common.ts`.
- Removed mongoose dependency by replacing `mongoose.Types.ObjectId` validation with a regex pattern for ObjectId strings.
- Removed socket.io imports while keeping socket event interfaces for type safety without runtime dependencies.
- Added branded types using Zod's `.brand()` method for `Username`, `Password`, `Email`, and `Otp` to create distinct types instead of plain strings.
- Updated exports to re-export from all modules, maintaining backward compatibility.
- Updated README.md with new modular structure, usage examples, and best practices for branded types.

## 0.0.2

### Patch Changes

- 8eddc01: Added comprehensive Zod validation schemas for user management, including registration, updates, password reset, and pagination. Introduced new types and interfaces for user roles and permissions to support advanced user access control.

## 0.0.1

### Patch Changes

- Initial release of @ansospace/types package

  **WHAT:** This is the first release (0.0.0) of the @ansospace/types package, introducing shared TypeScript type definitions for core entities in the AnsoSpace project. The package exports interfaces for `User` (with properties: id, email, name, role) and `Course` (with properties: id, title, description, instructorId, createdAt).

  **WHY:** To provide consistent and reusable type definitions across the AnsoSpace monorepo, ensuring type safety and reducing code duplication for user and course-related data structures.

  **HOW:** Consumers can import the types as follows:

  ```typescript
  import { User } from '@ansospace/types/user'
  import { Course } from '@ansospace/types/course'

  OR,

  import { User, Course } from '@ansospace/types'
  ```

  Since this is the initial release, no existing code needs migration. Future major versions will follow semantic versioning and include detailed migration guides for any breaking changes.
