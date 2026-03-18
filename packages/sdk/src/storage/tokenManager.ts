import type { AnsospaceStorage, AuthStorageKey, StorageValueType } from "@ansospace/types";

export class TokenManager implements AnsospaceStorage {
  private readonly storage: AnsospaceStorage;

  constructor(storage: AnsospaceStorage) {
    this.storage = storage;
  }

  async get<T = StorageValueType>(type: AuthStorageKey): Promise<T> {
    return this.storage.get(type);
  }

  async set<T = StorageValueType>(key: AuthStorageKey, value: T): Promise<void> {
    await this.storage.set(key, value);
  }

  async remove(key: AuthStorageKey): Promise<void> {
    await this.storage.remove(key);
  }
}
