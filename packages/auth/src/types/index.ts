export const TOKEN_STORAGE_KEYS = {
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "refresh-token",
  USER_ID: "user-id",
} as const;

export type TOKEN_STORAGE_KEY = keyof typeof TOKEN_STORAGE_KEYS; // 'AUTHORIZATION' | 'REFRESH_TOKEN' | 'USER_ID'
export type TOKEN_STORAGE_VALUE = (typeof TOKEN_STORAGE_KEYS)[TOKEN_STORAGE_KEY]; // 'authorization' | 'refresh-token' | 'user-id'

// export const SESSION_STORAGE_KEYS = {
//   AUTH_ACTION: "auth-action",
// } as const;

// export type SESSION_STORAGE_KEY = keyof typeof SESSION_STORAGE_KEYS;
// export type SESSION_STORAGE_VALUE = (typeof SESSION_STORAGE_KEYS)[SESSION_STORAGE_KEY];

export type OptionalString = string | undefined;

export interface StorageAdapter {
  get(key: TOKEN_STORAGE_VALUE): Promise<OptionalString>;
  set(key: TOKEN_STORAGE_VALUE, value: string): Promise<void>;
  remove(key: TOKEN_STORAGE_VALUE): Promise<void>;
}

export interface TokenStorage {
  getAccessToken: () => Promise<OptionalString>;
  getRefreshToken: () => Promise<OptionalString>;
  saveAccessToken: (token: string) => Promise<void>;
  saveRefreshToken: (token: string) => Promise<void>;
  deleteTokens: () => Promise<void>;
  getUserId: () => Promise<OptionalString>;
  saveUserId: (userId: string) => Promise<void>;
  deleteUserId: () => Promise<void>;
}

export interface AuthConfig {
  baseUrl: string;
  tokenStorage: TokenStorage;
}
