import { useCallback } from "react";

import { useAuthContext } from "../providers/AuthProvider";

export const useUser = () => {
  // 1. Get the "Source of Truth" from the Context
  const { user, isAuthLoading } = useAuthContext();

  // 2. Derive Status Flags
  const isAuthenticated = user.kind === "AUTHENTICATED";
  const isGuest = user.kind === "GUEST";

  // 3. Safe Property Accessors (Handle Union Type)
  // These properties only exist on Authenticated users
  const roles = user.kind === "AUTHENTICATED" ? user.roles : [];
  const permissions = user.kind === "AUTHENTICATED" ? user.permissions : [];

  // ID and Email exist on both PARTIAL and AUTHENTICATED users
  const id = "id" in user ? user.id : null;
  const email = "email" in user ? user.email : null;

  /**
   * Helper: Check if user has a specific permission
   */
  const can = useCallback(
    (permission: string) => {
      if (user.kind !== "AUTHENTICATED") return false;
      // Admin Override: super-admin can do anything
      if (user.roles.includes("super-admin")) return true;
      return user.permissions.includes(permission);
    },
    [user]
  );

  /**
   * Helper: Check if user has a specific role
   */
  const is = useCallback(
    (role: string) => {
      if (user.kind !== "AUTHENTICATED") return false;
      return user.roles.includes(role);
    },
    [user]
  );

  return {
    // Data Objects
    user, // The full discriminated union object

    // Flat Data (Safe defaults)
    id,
    email,
    roles,
    permissions,

    // Status Flags
    isAuthenticated,
    isGuest,
    isLoading: isAuthLoading,
    isVerified: "isVerified" in user ? user.isVerified : false,

    // Helpers
    can,
    is,
  };
};
