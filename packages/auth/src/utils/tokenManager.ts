import { StorageAdapter } from "../storage/adapter";

export interface TokenStorage {
  getAccessToken: () => Promise<string | null>;
  getRefreshToken: () => Promise<string | null>;
  saveAccessToken: (token: string) => Promise<void>;
  saveRefreshToken: (token: string) => Promise<void>;
  deleteTokens: () => Promise<void>;
  getUserId: () => Promise<string | null>;
  saveUserId: (userId: string) => Promise<void>;
  deleteUserId: () => Promise<void>;
}

export class TokenManager implements TokenStorage {
  private adapter: StorageAdapter;
  private accessKey: string;
  private refreshKey: string;
  private userIdKey: string;

  constructor(adapter: StorageAdapter, accessKey: string, refreshKey: string, userIdKey: string) {
    this.adapter = adapter;
    this.accessKey = accessKey;
    this.refreshKey = refreshKey;
    this.userIdKey = userIdKey;
  }

  async getAccessToken(): Promise<string | null> {
    return this.adapter.get(this.accessKey);
  }

  async getRefreshToken(): Promise<string | null> {
    return this.adapter.get(this.refreshKey);
  }

  async saveAccessToken(token: string): Promise<void> {
    await this.adapter.set(this.accessKey, token);
  }

  async saveRefreshToken(token: string): Promise<void> {
    await this.adapter.set(this.refreshKey, token);
  }

  async deleteTokens(): Promise<void> {
    await this.adapter.remove(this.accessKey);
    await this.adapter.remove(this.refreshKey);
  }

  async getUserId(): Promise<string | null> {
    return this.adapter.get(this.userIdKey);
  }

  async saveUserId(userId: string): Promise<void> {
    await this.adapter.set(this.userIdKey, userId);
  }

  async deleteUserId(): Promise<void> {
    await this.adapter.remove(this.userIdKey);
  }
}
