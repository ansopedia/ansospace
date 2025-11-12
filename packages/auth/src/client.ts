// Client-side exports - safe for client components
export * from "./providers/AuthProvider";

// Hooks (client-side only)
export { useLogin } from "./hooks/useLogin";
export { useLogout } from "./hooks/useLogout";
export { useOtp } from "./hooks/useOtp";
export { usePasswordReset } from "./hooks/usePasswordReset";
export { useRegister } from "./hooks/useRegister";
