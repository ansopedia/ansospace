# @ansospace/react

React integration for AnsoSpace SDK - provides hooks, providers, and context for React applications.

## Features

- ✅ React 19.x Context API based authentication state management
- ✅ Hooks for login, logout, signup, OTP verification, and auth state
- ✅ Built on top of `@ansospace/sdk` for all data fetching
- ✅ TypeScript-first with full type safety

## Installation

```bash
pnpm add @ansospace/react @ansospace/sdk
```

### React Native Setup

For React Native projects, you need to create your own `AsyncStorageAdapter`. See [REACT_NATIVE_SETUP.md](./REACT_NATIVE_SETUP.md) for the complete implementation you can copy into your project.

## Usage

### Setup Provider

Wrap your app with `AnsospaceProvider`:

```tsx
import { AnsospaceProvider, BrowserStorageAdapter, TokenManager } from "@ansospace/react";

function App() {
  return (
    <AnsospaceProvider
      config={{
        baseUrl: "https://api.ansospace.com",
        storage: new TokenManager(new BrowserStorageAdapter()),
      }}
    >
      {/* Your app */}
    </AnsospaceProvider>
  );
}
```

### Using Hooks

```tsx
import { useLogin, useLogout, useUser } from "@ansospace/react";

function LoginComponent() {
  const { login, loading, error } = useLogin();
  const { isAuthenticated, userId } = useUser();
  const { logout } = useLogout();

  const handleLogin = async () => {
    await login({
      email: "user@example.com",
      password: "password123",
    });
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={handleLogin} disabled={loading}>
          Login
        </button>
      )}
    </div>
  );
}
```

### Available Hooks

- `useUser()` - Get current user state (userId, isAuthenticated, permissions, etc.)
- `useLogin()` - Login hook with loading/error states
- `useLogout()` - Logout hook
- `useRegister()` - Registration hook
- `useOtpActions()` - OTP sending and verification
- `usePasswordActions()` - Password reset flow
- `useGetSessions()` - Get active sessions
- `useSessionActions()` - Session actions (revokeById, revokeOthers, revokeAll)

## Storage Adapters

This package provides platform-specific storage adapters:

- **BrowserStorageAdapter** - For web applications (uses cookies)

### React Native

For React Native projects, create your own `AsyncStorageAdapter` by copying the implementation from [REACT_NATIVE_SETUP.md](./REACT_NATIVE_SETUP.md).

## Architecture

This package provides the **State/Context** layer:

- React Context for auth state
- Hooks for common operations
- State management (userId, permissions, etc.)
- Platform-specific storage adapters

The **Logic** layer is handled by `@ansospace/sdk`:

- HTTP client with token management
- API resources (AuthResource, UserResource)

## License

MIT
