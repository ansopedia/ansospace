import type { AnsospaceStorage, AuthStorageKey, StorageValueType } from "@ansospace/types";

export class InMemoryStorageAdapter implements AnsospaceStorage {
  private storage = new Map<AuthStorageKey, string | boolean>();

  async get<T = StorageValueType>(key: AuthStorageKey): Promise<T> {
    return this.storage.get(key) as T;
  }

  async set<T = StorageValueType>(key: AuthStorageKey, value: T): Promise<void> {
    this.storage.set(key, value as string | boolean);
  }

  async remove(key: AuthStorageKey): Promise<void> {
    this.storage.delete(key);
  }
}
