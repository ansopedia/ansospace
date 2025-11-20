import { AnsospaceStorage, AuthStorageKey, StorageValueType } from "../types";

export class TokenManager implements AnsospaceStorage {
  private readonly storage: AnsospaceStorage;

  constructor(storage: AnsospaceStorage) {
    this.storage = storage;
  }

  async get(type: AuthStorageKey): Promise<StorageValueType> {
    return this.storage.get(type);
  }

  async set(key: AuthStorageKey, value: string | boolean): Promise<void> {
    this.storage.set(key, value);
  }

  async remove(key: AuthStorageKey): Promise<void> {
    await this.storage.remove(key);
  }
}
