# @ansospace/types

## 0.0.0

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
