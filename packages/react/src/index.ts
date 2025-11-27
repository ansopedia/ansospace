// Provider
export { AnsospaceProvider, useAuthContext } from "./providers/AuthProvider";
export type { AnsospaceProviderConfig, AuthContextValue, AuthState } from "./providers/AuthProvider";

// Hooks
export { useLogin } from "./hooks/useLogin";
export { useLogout } from "./hooks/useLogout";
export { useOtp } from "./hooks/useOtp";
export { usePasswordReset } from "./hooks/usePasswordReset";
export { useRegister } from "./hooks/useRegister";
export { useUser } from "./hooks/useUser";

// Storage Adapters (Platform-specific - Web only)
export { BrowserStorageAdapter } from "./storage/browser";

// Re-export universal utilities from SDK
export { InMemoryStorageAdapter, TokenManager } from "@ansospace/sdk";
