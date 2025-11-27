# React Native Setup

For React Native projects, you need to create your own `AsyncStorageAdapter` since `@react-native-async-storage/async-storage` is not included in the package.

## Installation

First, install the required package:

```bash
pnpm add @react-native-async-storage/async-storage
```

## Create AsyncStorageAdapter

Create a file in your project (e.g., `src/storage/AsyncStorageAdapter.ts`):

```typescript
import type { AnsospaceStorage, AuthStorageKey, StorageValueType } from "@ansospace/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * AsyncStorageAdapter - React Native storage adapter
 *
 * Copy this implementation into your React Native project.
 */
export class AsyncStorageAdapter implements AnsospaceStorage {
  async get(key: AuthStorageKey): Promise<StorageValueType> {
    try {
      return (await AsyncStorage.getItem(key)) ?? undefined;
    } catch (error) {
      console.error("AsyncStorageAdapter.get failed:", error);
      return undefined;
    }
  }

  async set(key: AuthStorageKey, value: string | boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(key, String(value));
    } catch (error) {
      console.error("AsyncStorageAdapter.set failed:", error);
      throw error;
    }
  }

  async remove(key: AuthStorageKey): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("AsyncStorageAdapter.remove failed:", error);
      throw error;
    }
  }
}
```

## Usage

```tsx
import { AnsospaceProvider, TokenManager } from "@ansospace/react";

import { AsyncStorageAdapter } from "./src/storage/AsyncStorageAdapter";

function App() {
  return (
    <AnsospaceProvider
      config={{
        baseUrl: "https://api.ansospace.com",
        storage: new TokenManager(new AsyncStorageAdapter()),
      }}
    >
      {/* Your app */}
    </AnsospaceProvider>
  );
}
```

## Why Not Included?

The `AsyncStorageAdapter` is not included in `@ansospace/react` because:

- It requires a native module (`@react-native-async-storage/async-storage`)
- It would force web projects to install unnecessary dependencies
- It allows you to customize the implementation for your specific needs
