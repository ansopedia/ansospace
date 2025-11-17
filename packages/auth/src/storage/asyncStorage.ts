import { AnsospaceStorage, StorageKey } from "../types";

export class AsyncStorageAdapter implements AnsospaceStorage {
  private async getAsyncStorage() {
    try {
      const module = await import("@react-native-async-storage/async-storage");
      return module.default;
    } catch {
      return undefined;
    }
  }

  async get(key: StorageKey): Promise<string | undefined> {
    try {
      const AsyncStorage = await this.getAsyncStorage();
      if (!AsyncStorage) return undefined;
      return (await AsyncStorage.getItem(key)) ?? undefined;
    } catch {
      return undefined;
    }
  }

  async set(key: StorageKey, value: string): Promise<void> {
    try {
      const AsyncStorage = await this.getAsyncStorage();
      if (!AsyncStorage) return;
      await AsyncStorage.setItem(key, value);
    } catch {
      // ignore
    }
  }

  async remove(key: StorageKey): Promise<void> {
    try {
      const AsyncStorage = await this.getAsyncStorage();
      if (!AsyncStorage) return;
      await AsyncStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}
