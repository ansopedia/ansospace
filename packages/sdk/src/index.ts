// Main SDK class
export { AnsospaceSDK } from "./sdk";

// HTTP Client
export { HttpClient } from "./httpClient";

// Resources
export { AuthResource } from "./resources/authResource";
export { UserResource } from "./resources/userResource";

// Storage Utilities (Universal - for testing and utility purposes)
export { InMemoryStorageAdapter } from "./storage/inMemory";
export { TokenManager } from "./storage/tokenManager";

// Types
export type { AnsospaceConfig, HttpMethod, RequestOptions } from "./types";
// Re-export storage types from @ansospace/types
export type { AnsospaceStorage, AuthStorageKey, StorageValueType } from "@ansospace/types";
