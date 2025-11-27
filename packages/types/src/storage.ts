import { TokenType } from "./token";

export type AuthStorageKey = TokenType | "userId" | "userEmail" | "isUserVerified";

export type StorageValueType = string | boolean | undefined;

/**
 * Platform-agnostic storage interface for AnsoSpace
 * Can be implemented using localStorage, SecureStore, cookies, etc.
 */
export interface AnsospaceStorage {
  get: (key: AuthStorageKey) => Promise<StorageValueType>;
  set: (key: AuthStorageKey, value: string | boolean) => Promise<void>;
  remove(key: AuthStorageKey): Promise<void>;
}
