# @ansospace/auth Usage Guide

This package provides separate entry points for client and server components to avoid hydration mismatches and ensure proper Next.js App Router compatibility.

## Installation

```bash
npm install @ansospace/auth
# or
pnpm add @ansospace/auth
# or
yarn add @ansospace/auth
```

## Usage

### Client Components (with "use client" directive)

For components that use hooks, context, or other client-side features:

```typescript
// components/ClientComponent.tsx
"use client";

import { AuthProvider, useAuth, useLogin } from "@ansospace/auth/client";

export default function ClientComponent() {
  const { isAuthenticated } = useAuth();
  const login = useLogin();

  return (
    <AuthProvider config={{ baseUrl: "https://api.example.com", tokenStorage: /* ... */ }}>
      {/* Your client components */}
    </AuthProvider>
  );
}
```

### Server Components (default behavior)

For server components, API routes, or server-side utilities:

```typescript
// app/page.tsx (server component)
import { getServerSession, AuthManager } from "@ansospace/auth/server";

export default async function ServerComponent() {
  const session = await getServerSession(request);

  return (
    <div>
      {session ? `Welcome ${session.user.name}` : "Please log in"}
    </div>
  );
}
```

### API Routes

```typescript
// app/api/route.ts
import { getServerSession } from "@ansospace/auth/server";

export async function GET(request: Request) {
  const session = await getServerSession(request);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ data: "Protected data" });
}
```

## Available Exports

### `@ansospace/auth/client`

- `AuthProvider` - React context provider
- `AuthContext` - React context
- `useAuth` - Main authentication hook
- `useLogin`, `useLogout`, `useOtp`, `usePasswordReset`, `useSignup` - Specific auth hooks
- `AuthService` - Authentication service
- `ApiClient` - API client for making requests
- Storage adapters: `AsyncStorageAdapter`, `BrowserStorageAdapter`, `InMemoryStorageAdapter`
- Utilities: `TokenManager`, constants, and types

### `@ansospace/auth/server`

- `getServerSession` - Get session from request
- `AuthManager` - Server-side auth manager
- `AuthService` - Authentication service
- `ApiClient` - API client for making requests
- `InMemoryStorageAdapter` - Server-safe storage
- Utilities: `TokenManager`, constants, and types

### `@ansospace/auth` (Main Entry Point)

⚠️ **Warning**: This entry point includes both client and server code. While it works, it may cause issues with server components that try to import client-side code. Use the specific entry points above for better compatibility.

## Migration Guide

If you're currently using the main entry point and encountering issues:

1. **Identify where you're importing from `@ansospace/auth`**
2. **Replace imports based on usage**:
   - Client components → `@ansospace/auth/client`
   - Server components/API routes → `@ansospace/auth/server`

### Before (may cause errors)

```typescript
// app/page.tsx (server component)
import { getServerSession } from "@ansospace/auth";

// ❌ May cause errors
```

### After (correct)

```typescript
// app/page.tsx (server component)
import { getServerSession } from "@ansospace/auth/server";

// ✅ Works correctly
```

## Best Practices

1. **Always use specific entry points** (`/client` or `/server`) for better compatibility
2. **Keep client and server logic separate** when possible
3. **Use the main entry point** (`@ansospace/auth`) only when you're certain it won't cause issues
4. **Test your imports** in both client and server contexts

## Troubleshooting

### "useState is not available in server components"

- **Cause**: Importing client-side code in a server component
- **Solution**: Use `@ansospace/auth/server` instead of `@ansospace/auth`

### "Cannot find module '@ansospace/auth/client'"

- **Cause**: Package not built or installed correctly
- **Solution**: Run `pnpm build` in the auth package directory

### Type errors with new imports

- **Cause**: TypeScript not recognizing new entry points
- **Solution**: Restart your TypeScript server and ensure the package is built
