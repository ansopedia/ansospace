import type { AnsospaceStorage, AuthStorageKey, StorageValueType } from "@ansospace/types";

/**
 * BrowserStorageAdapter - Web storage adapter using cookies
 * Suitable for web applications (Next.js, React, etc.)
 */
export class BrowserStorageAdapter implements AnsospaceStorage {
  async get<T = StorageValueType>(key: AuthStorageKey): Promise<T> {
    if (typeof document === "undefined") return undefined as T;
    const cookie = document.cookie.split("; ").find((row) => row.startsWith(`${key}=`));
    const cookieValue = cookie ? cookie.split("=")[1] || undefined : undefined;
    if (cookieValue) return cookieValue as T;
    return undefined as T;
  }

  async set<T = StorageValueType>(key: AuthStorageKey, value: T): Promise<void> {
    if (typeof document === "undefined") return;
    document.cookie = `${key}=${value}; path=/; secure; samesite=strict`;
  }

  async remove(key: AuthStorageKey): Promise<void> {
    if (typeof document === "undefined") return;
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}
