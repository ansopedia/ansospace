import { useAuthProviderContext } from "../providers/AuthProvider";

/**
 * Custom hook to access all current user data, status, and permissions synchronously.
 */
export const useUser = () => {
  const context = useAuthProviderContext();

  // All these properties are now direct synchronous state variables from the context
  return {
    userId: context.userId,
    isAuthenticated: context.isAuthenticated,
    isAuthLoading: context.isAuthLoading, // Use this to check if data is ready
    isUserVerified: context.isVerified, // This is now SYNCHRONOUS!
    permissions: context.permissions,
    userEmail: context.userEmail,
    // Add roles, profile, etc., here once available in AuthContext

    // Exposed methods
    logout: context.logout,
    // ...
  };
};
