"use client";

import { StorageAdapter } from "./adapter";
import { AsyncStorageAdapter } from "./asyncStorage";
import { BrowserStorageAdapter } from "./browser";
import { CookieStorageAdapter } from "./cookie";
import { InMemoryStorageAdapter } from "./inMemory";

// Environment detection
const isBrowser = typeof window !== "undefined";
const isReactNative = typeof navigator !== "undefined" && navigator.product === "ReactNative";

/**
 * Dynamically creates a storage adapter based on the execution environment.
 *
 * - **React Native**: Uses `AsyncStorageAdapter` for persistent storage.
 * - **Browser**: Uses `BrowserStorageAdapter` (localStorage) for persistent storage.
 * - **Server**: Falls back to `InMemoryStorageAdapter` for non-persistent, in-memory storage.
 *
 * @returns {StorageAdapter} An instance of a suitable storage adapter.
 */
export const createStorageAdapter = (): StorageAdapter => {
  if (isReactNative) {
    return new AsyncStorageAdapter();
  }
  if (isBrowser) {
    return new BrowserStorageAdapter();
  }
  // Default to in-memory storage for server-side or unknown environments
  return new InMemoryStorageAdapter();
};

/**
 * Creates a cookie-based storage adapter for shared client-server token storage.
 * This ensures tokens are synchronized between client and server.
 *
 * @returns {StorageAdapter} An instance of CookieStorageAdapter.
 */
export const createCookieStorageAdapter = (): StorageAdapter => {
  return new CookieStorageAdapter();
};
