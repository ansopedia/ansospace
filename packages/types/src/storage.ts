import { TokenType } from "./token";

/**
 * Storage keys for authentication data
 * - TokenType values: "authorization", "refresh-token", "action-token"
 * - User data: "userId", "userEmail", "isUserVerified"
 * - Device tracking: "x-device-id" (matches HttpHeaders.X_DEVICE_ID)
 */
export type AuthStorageKey = TokenType | "userId" | "userEmail" | "isUserVerified" | "x-device-id";

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
