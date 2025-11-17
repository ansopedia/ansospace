import { AnsospaceStorage, StorageKey } from "../types";

export class InMemoryStorageAdapter implements AnsospaceStorage {
  private storage = new Map<StorageKey, string>();

  async get(key: StorageKey): Promise<string | undefined> {
    return this.storage.get(key);
  }

  async set(key: StorageKey, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async remove(key: StorageKey): Promise<void> {
    this.storage.delete(key);
  }
}
