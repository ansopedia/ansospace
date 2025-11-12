import { StorageAdapter } from "../types";

export class InMemoryStorageAdapter implements StorageAdapter {
  private storage = new Map<string, string>();

  async get(key: string): Promise<string | undefined> {
    return this.storage.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.storage.delete(key);
  }
}
