import { TokenType } from "./token";

/**
 * Storage keys for authentication data
 * - TokenType values: "authorization", "refresh-token", "action-token"
 * - User data: "user-id", "user-email", "is-user-verified"
 * - Device tracking: "x-device-id" (matches HttpHeaders.X_DEVICE_ID)
 */
export type AuthStorageKey = TokenType | "user-id" | "user-email" | "is-user-verified" | "x-device-id" | (string & {});

export type StorageValueType = string | boolean | undefined;

/**
 * Platform-agnostic storage interface for AnsoSpace
 * Can be implemented using localStorage, SecureStore, cookies, etc.
 */
export interface AnsospaceStorage {
  get: <T = StorageValueType>(key: AuthStorageKey) => Promise<T>;
  set: <T = StorageValueType>(key: AuthStorageKey, value: T) => Promise<void>;
  remove(key: AuthStorageKey): Promise<void>;
}
