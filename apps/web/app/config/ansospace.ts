import { AuthConfig, BrowserStorageAdapter, TOKEN_STORAGE_KEYS, TokenManager } from "@ansospace/auth";

export const config = (baseUrl: string): AuthConfig => {
  return {
    baseUrl,
    tokenStorage: new TokenManager(
      new BrowserStorageAdapter(),
      TOKEN_STORAGE_KEYS.AUTHORIZATION,
      TOKEN_STORAGE_KEYS.REFRESH_TOKEN,
      TOKEN_STORAGE_KEYS.USER_ID
    ),
  };
};
