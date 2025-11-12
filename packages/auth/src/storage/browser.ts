import { StorageAdapter } from "../types";

export class BrowserStorageAdapter implements StorageAdapter {
  async get(key: string): Promise<string | undefined> {
    const cookie = document.cookie.split("; ").find((row) => row.startsWith(`${key}=`));
    const cookieValue = cookie ? cookie.split("=")[1] || undefined : undefined;
    if (cookieValue) return cookieValue;
  }

  async set(key: string, value: string): Promise<void> {
    document.cookie = `${key}=${value}; path=/; secure; samesite=strict`;
  }

  async remove(key: string): Promise<void> {
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}
