import { OptionalString, StorageAdapter, TOKEN_STORAGE_KEYS, TOKEN_STORAGE_VALUE, TokenStorage } from "../types";

export class TokenManager implements TokenStorage {
  private readonly adapter: StorageAdapter;
  private readonly accessKey: TOKEN_STORAGE_VALUE;
  private readonly refreshKey: TOKEN_STORAGE_VALUE;
  private readonly userIdKey: TOKEN_STORAGE_VALUE;

  constructor(
    adapter: StorageAdapter,
    accessKey: TOKEN_STORAGE_VALUE = TOKEN_STORAGE_KEYS.AUTHORIZATION,
    refreshKey: TOKEN_STORAGE_VALUE = TOKEN_STORAGE_KEYS.REFRESH_TOKEN,
    userIdKey: TOKEN_STORAGE_VALUE = TOKEN_STORAGE_KEYS.USER_ID
  ) {
    this.adapter = adapter;
    this.accessKey = accessKey;
    this.refreshKey = refreshKey;
    this.userIdKey = userIdKey;
  }

  async getAccessToken(): Promise<OptionalString> {
    return this.adapter.get(this.accessKey);
  }

  async getRefreshToken(): Promise<OptionalString> {
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

  async getUserId(): Promise<OptionalString> {
    return await this.adapter.get(this.userIdKey);
  }

  async saveUserId(userId: string): Promise<void> {
    await this.adapter.set(this.userIdKey, userId);
  }

  async deleteUserId(): Promise<void> {
    await this.adapter.remove(this.userIdKey);
  }
}
