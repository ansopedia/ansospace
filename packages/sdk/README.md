# @ansospace/sdk

Platform-agnostic SDK for AnsoSpace API - handles all data fetching with a modular class-based approach.

## Features

- ✅ Platform-agnostic (works on Node.js, Web, and Mobile)
- ✅ Automatic token injection and refresh
- ✅ Request queuing during token refresh
- ✅ Modular resource-based architecture
- ✅ Zero React dependencies
- ✅ TypeScript-first with full type safety

## Installation

```bash
pnpm add @ansospace/sdk
```

## Usage

### Basic Setup

The SDK requires a storage implementation. For platform-specific adapters, use `@ansospace/react`:

```typescript
import { AnsospaceSDK } from "@ansospace/sdk";
import { BrowserStorageAdapter, TokenManager } from "@ansospace/react";

// Web implementation
const sdk = new AnsospaceSDK({
  baseUrl: "https://api.ansospace.com",
  storage: new TokenManager(new BrowserStorageAdapter()),
});

// React Native implementation
import { AsyncStorageAdapter } from "@ansospace/react";

const sdk = new AnsospaceSDK({
  baseUrl: "https://api.ansospace.com",
  storage: new TokenManager(new AsyncStorageAdapter()),
});

// Custom storage implementation
import type { AnsospaceStorage, AuthStorageKey, StorageValueType } from "@ansospace/sdk";

class CustomStorage implements AnsospaceStorage {
  async get(key: AuthStorageKey): Promise<StorageValueType> {
    // Your implementation
  }
  async set(key: AuthStorageKey, value: string | boolean): Promise<void> {
    // Your implementation
  }
  async remove(key: AuthStorageKey): Promise<void> {
    // Your implementation
  }
}

const sdk = new AnsospaceSDK({
  baseUrl: "https://api.ansospace.com",
  storage: new CustomStorage(),
});
```

### Authentication

```typescript
// Login
const response = await sdk.auth.login({
  email: "user@example.com",
  password: "password123",
});

if (response.status === "success") {
  console.log("User ID:", response.data.userId);
}

// Register
const registerResponse = await sdk.auth.register({
  email: "newuser@example.com",
  username: "newuser",
  password: "password123",
  confirmPassword: "password123",
});

// Logout
await sdk.auth.logout();

// Send OTP
await sdk.auth.sendOtp({ email: "user@example.com" });

// Verify OTP
await sdk.auth.verifyOtp({ email: "user@example.com", otp: "123456" });
```

### User Operations

```typescript
// Get user profile
const profileResponse = await sdk.users.getProfile();
if (profileResponse.status === "success") {
  console.log("User:", profileResponse.data);
}

// Update profile
await sdk.users.updateProfile({
  username: "newusername",
});

// Check username availability
const availability = await sdk.users.checkUsernameAvailability("newusername");
if (availability.status === "success") {
  console.log("Available:", availability.data.isAvailable);
}
```

### Advanced Usage

```typescript
// Access HTTP client directly
const response = await sdk.client.GET("/api/v1/custom-endpoint");

// Update configuration
sdk.updateConfig({
  baseUrl: "https://staging.api.ansospace.com",
  defaultHeaders: {
    "X-Custom-Header": "value",
  },
});

// Check authentication status
const isAuth = await sdk.isAuthenticated();
```

## Storage

The SDK is storage-agnostic. You must provide an `AnsospaceStorage` implementation:

- **For Web**: Use `BrowserStorageAdapter` from `@ansospace/react`
- **For React Native**: Use `AsyncStorageAdapter` from `@ansospace/react`
- **For Testing**: Use `InMemoryStorageAdapter` from `@ansospace/sdk`
- **Custom**: Implement the `AnsospaceStorage` interface

## Architecture

The SDK follows a modular class-based architecture:

- **AnsospaceSDK**: Main orchestrator class
- **HttpClient**: Handles HTTP requests with token management
- **AuthResource**: Authentication-related endpoints
- **UserResource**: User-related endpoints

## License

MIT
