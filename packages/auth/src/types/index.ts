import { TokenType } from "@ansospace/types";

export type AuthStorageKey = TokenType | "userId" | "userEmail" | "isUserVerified";

export type StorageValueType = string | boolean | undefined;

export interface AnsospaceStorage {
  get: (key: AuthStorageKey) => Promise<StorageValueType>;
  set: (key: AuthStorageKey, value: string | boolean) => Promise<void>;
  remove(key: AuthStorageKey): Promise<void>;
}

export interface AuthConfig {
  baseUrl: string;
  storage: AnsospaceStorage;
}
