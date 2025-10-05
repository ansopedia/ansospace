import { StorageAdapter } from "./adapter";

export class AsyncStorageAdapter implements StorageAdapter {
  private async getAsyncStorage() {
    try {
      const module = await import("@react-native-async-storage/async-storage");
      return module.default;
    } catch {
      return null;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const AsyncStorage = await this.getAsyncStorage();
      if (!AsyncStorage) return null;
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      const AsyncStorage = await this.getAsyncStorage();
      if (!AsyncStorage) return;
      await AsyncStorage.setItem(key, value);
    } catch {
      // ignore
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const AsyncStorage = await this.getAsyncStorage();
      if (!AsyncStorage) return;
      await AsyncStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}
