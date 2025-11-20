import { AnsospaceStorage, AuthStorageKey, StorageValueType } from "../types";

export class AsyncStorageAdapter implements AnsospaceStorage {
  private async getAsyncStorage() {
    try {
      const module = await import("@react-native-async-storage/async-storage");
      return module.default;
    } catch {
      return undefined;
    }
  }

  async get(key: AuthStorageKey): Promise<StorageValueType> {
    try {
      const AsyncStorage = await this.getAsyncStorage();
      if (!AsyncStorage) return undefined;
      return (await AsyncStorage.getItem(key)) ?? undefined;
    } catch {
      return undefined;
    }
  }

  async set(key: AuthStorageKey, value: string | boolean): Promise<void> {
    try {
      const AsyncStorage = await this.getAsyncStorage();
      if (!AsyncStorage) return;
      await AsyncStorage.setItem(key, String(value));
    } catch {
      // ignore
    }
  }

  async remove(key: AuthStorageKey): Promise<void> {
    try {
      const AsyncStorage = await this.getAsyncStorage();
      if (!AsyncStorage) return;
      await AsyncStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}
