import type { AnsospaceStorage, AuthStorageKey, StorageValueType } from "@ansospace/types";

/**
 * BrowserStorageAdapter - Web storage adapter using cookies
 * Suitable for web applications (Next.js, React, etc.)
 */
export class BrowserStorageAdapter implements AnsospaceStorage {
  async get(key: AuthStorageKey): Promise<StorageValueType> {
    if (typeof document === "undefined") return undefined;
    const cookie = document.cookie.split("; ").find((row) => row.startsWith(`${key}=`));
    const cookieValue = cookie ? cookie.split("=")[1] || undefined : undefined;
    if (cookieValue) return cookieValue;
    return undefined;
  }

  async set(key: AuthStorageKey, value: string | boolean): Promise<void> {
    if (typeof document === "undefined") return;
    document.cookie = `${key}=${value}; path=/; secure; samesite=strict`;
  }

  async remove(key: AuthStorageKey): Promise<void> {
    if (typeof document === "undefined") return;
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}
