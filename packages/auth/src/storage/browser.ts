import { StorageAdapter } from "./adapter";

export class BrowserStorageAdapter implements StorageAdapter {
  async get(key: string): Promise<string | null> {
    if (typeof document !== "undefined") {
      const cookie = document.cookie.split("; ").find((row) => row.startsWith(`${key}=`));
      const cookieValue = cookie ? cookie.split("=")[1] || null : null;
      if (cookieValue) return cookieValue;
    }
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(key);
    }
    return null;
  }

  async set(key: string, value: string): Promise<void> {
    if (typeof document !== "undefined") {
      document.cookie = `${key}=${value}; path=/; secure; samesite=strict`;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
  }

  async remove(key: string): Promise<void> {
    if (typeof document !== "undefined") {
      document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  }
}
