// Server-side exports - safe for server components and API routes
export { getServerSession } from "./server/getServerSession";
export { AuthManager } from "./core/AuthManager";

// Core utilities that work on server
export { ApiClient } from "./apiClient";
export { AuthService } from "./services/authService";

// Storage adapters that work on server
export type { StorageAdapter } from "./storage/adapter";
export { InMemoryStorageAdapter } from "./storage/inMemory";
export { ServerCookieStorageAdapter } from "./storage/serverCookie";

// Utils
export { TokenManager } from "./utils/tokenManager";
export type { TokenStorage } from "./utils/tokenManager";

// Constants
export { SESSION_STORAGE_KEY, TOKEN_STORAGE_KEYS } from "./constants";

// Config
export { createAuthConfig } from "./config";
export { createServerAuthConfig } from "./serverConfig";
