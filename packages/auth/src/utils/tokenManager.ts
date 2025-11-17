import { AnsospaceStorage, OptionalString, StorageKey } from "../types";

export class TokenManager implements AnsospaceStorage {
  private readonly storage: AnsospaceStorage;

  constructor(storage: AnsospaceStorage) {
    this.storage = storage;
  }

  async remove(key: StorageKey): Promise<void> {
    await this.storage.remove(key);
  }

  async get(type: StorageKey): Promise<OptionalString> {
    return this.storage.get(type);
  }

  async set(key: StorageKey, value: string) {
    this.storage.set(key, value);
  }
}
