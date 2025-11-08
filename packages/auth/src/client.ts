// Client-side exports - safe for client components
export * from "./context/AuthContext";
export * from "./providers/AuthProvider";

// Hooks (client-side only)
export { useAuth } from "./hooks/useAuth";
export { useLogin } from "./hooks/useLogin";
export { useLogout } from "./hooks/useLogout";
export { useOtp } from "./hooks/useOtp";
export { usePasswordReset } from "./hooks/usePasswordReset";
export { useSignup } from "./hooks/useSignup";

// Services that can be used on client
export { AuthService } from "./services/authService";

// API Client
export { ApiClient } from "./apiClient";

// Storage Adapters (client-side)
export type { StorageAdapter } from "./storage/adapter";
export { AsyncStorageAdapter } from "./storage/asyncStorage";
export { BrowserStorageAdapter } from "./storage/browser";
export { InMemoryStorageAdapter } from "./storage/inMemory";
export { CookieStorageAdapter } from "./storage/cookie";
export { createCookieStorageAdapter } from "./storage/factory";

// Utils
export { TokenManager } from "./utils/tokenManager";
export type { TokenStorage } from "./utils/tokenManager";

// Constants
export { SESSION_STORAGE_KEY, TOKEN_STORAGE_KEYS } from "./constants";

// Config
export { createAuthConfig } from "./config";
