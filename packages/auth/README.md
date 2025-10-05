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

Wrap your app with `AuthProvider` and configure token storage. Use hooks like `useAuth`, `useLogin`, `useLogout` to manage authentication.

### Basic Setup

```tsx
import { AuthProvider, BrowserStorageAdapter, TOKEN_STORAGE_KEYS, TokenManager } from "@ansospace/auth";

// For cookie-based storage (SSR compatible)
const tokenStorage = new TokenManager(
  new BrowserStorageAdapter(),
  TOKEN_STORAGE_KEYS.AUTHORIZATION,
  TOKEN_STORAGE_KEYS.REFRESH_TOKEN,
  TOKEN_STORAGE_KEYS.USER_ID
);

// For localStorage-based storage
// const tokenStorage = new TokenManager(new BrowserStorageAdapter(), "accessToken", "refreshToken", "userId");

// For React Native AsyncStorage
// const tokenStorage = new TokenManager(new AsyncStorageAdapter(), "accessToken", "refreshToken", "userId");

// For in-memory storage (tests)
// const tokenStorage = new TokenManager(new InMemoryStorageAdapter(), "accessToken", "refreshToken", "userId");

function App() {
  return (
    <AuthProvider config={{ baseUrl: "https://api.example.com", tokenStorage }}>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

### Token Storage Options

Use `TokenManager` with any `StorageAdapter` to create custom token storage.

### Storage Adapters

You can also use the storage adapters directly if you want to implement custom token storage:

- `BrowserStorageAdapter`: Uses document.cookie and localStorage fallback for web environments
- `AsyncStorageAdapter`: Wraps React Native AsyncStorage for mobile apps
- `InMemoryStorageAdapter`: Simple Map-based adapter for tests or non-persistent storage

### Using Hooks

```tsx
import { useAuth, useLogin, useLogout, useSignup } from "@ansospace/auth";

function LoginComponent() {
  const { login } = useLogin();
  const { user, isAuthenticated } = useAuth();

  // Your login UI and logic
}
```

## Contributing

Contributions are welcome! Please open issues or pull requests.

## License

MIT
