import { AnsospaceStorage, AuthStorageKey, StorageValueType } from "../types";

export class BrowserStorageAdapter implements AnsospaceStorage {
  async get(key: AuthStorageKey): Promise<StorageValueType> {
    const cookie = document.cookie.split("; ").find((row) => row.startsWith(`${key}=`));
    const cookieValue = cookie ? cookie.split("=")[1] || undefined : undefined;
    if (cookieValue) return cookieValue;
  }

  async set(key: AuthStorageKey, value: string | boolean): Promise<void> {
    document.cookie = `${key}=${value}; path=/; secure; samesite=strict`;
  }

  async remove(key: AuthStorageKey): Promise<void> {
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}
