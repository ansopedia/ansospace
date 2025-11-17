# @ansospace/auth

Centralized authentication package for the AnsoSpace platform.

## Features

- React 19.x Context API based authentication state management
- Platform-agnostic API client with token refresh and request queuing
- Hooks for login, logout, signup, OTP verification, and auth state
- Abstracted token storage to support React Native and Next.js
- No UI components included — apps provide their own UI

## Installation

```bash
pnpm add @ansospace/auth
```

## Usage

This package provides separate entry points for client and server components to avoid hydration mismatches and ensure proper Next.js App Router compatibility.

### Client Components

For components that use hooks, context, or other client-side features, import from `@ansospace/auth/client`:

```tsx
import { BrowserStorageAdapter, TokenManager } from "@ansospace/auth";
import { AuthProvider } from "@ansospace/auth/client";

// For cookie-based storage (SSR compatible)
const authConfig: AuthConfig = {
  baseUrl,
  storage: new TokenManager(new BrowserStorageAdapter()),
};

// For React Native AsyncStorage
const authConfig: AuthConfig = {
  baseUrl,
  storage: new TokenManager(new AsyncStorageAdapter()),
};

// For in-memory storage (tests)
const authConfig: AuthConfig = {
  baseUrl,
  storage: new TokenManager(new InMemoryStorageAdapter()),
};

function App() {
  return <AuthProvider config={authConfig}>{children}</AuthProvider>;
}
```

### Server Components

For server components, API routes, or server-side utilities, import from `@ansospace/auth/server`:

```tsx
// Server-side usage (limited exports available)
import "@ansospace/auth/server";
```

### Main Entry Point

For general usage or when you need access to core services, import from `@ansospace/auth`:

```tsx
import { AnsospaceAuth, ApiClient, AuthService, TokenManager } from "@ansospace/auth";
```

### Token Storage Options

Use `TokenManager` with any `AnsospaceStorage` to create custom token storage.

### Storage Adapters

You can also use the storage adapters directly if you want to implement custom token storage:

- `BrowserStorageAdapter`: Uses document.cookie and localStorage fallback for web environments
- `AsyncStorageAdapter`: Wraps React Native AsyncStorage for mobile apps
- `InMemoryStorageAdapter`: Simple Map-based adapter for tests or non-persistent storage

### Using Hooks

```tsx
import { useAuthProviderContext, useLogin, useLogout, useRegister } from "@ansospace/auth/client";

function LoginComponent() {
  const { login } = useLogin();
  const { userId, isAuthenticated } = useAuthProviderContext();

  // Your login UI and logic
}
```

## Contributing

Contributions are welcome! Please open issues or pull requests.

## License

MIT
