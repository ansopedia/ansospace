import type { AnsospaceStorage, AuthStorageKey, StorageValueType } from "@ansospace/types";

export class InMemoryStorageAdapter implements AnsospaceStorage {
  private storage = new Map<AuthStorageKey, string | boolean>();

  async get(key: AuthStorageKey): Promise<StorageValueType> {
    return this.storage.get(key);
  }

  async set(key: AuthStorageKey, value: string | boolean): Promise<void> {
    this.storage.set(key, value);
  }

  async remove(key: AuthStorageKey): Promise<void> {
    this.storage.delete(key);
  }
}
