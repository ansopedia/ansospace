import { TokenType as ImportedTokenType } from "@ansospace/types";

export type StorageKey = ImportedTokenType | "user-id";

export type OptionalString = string | undefined;

export interface AnsospaceStorage {
  get: (key: StorageKey) => Promise<OptionalString>;
  set: (key: StorageKey, value: string) => Promise<void>;
  remove(key: StorageKey): Promise<void>;
}

export interface AuthConfig {
  baseUrl: string;
  storage: AnsospaceStorage;
}
