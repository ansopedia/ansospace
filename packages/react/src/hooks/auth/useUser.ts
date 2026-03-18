import { UserAccessControlProfile } from "@ansospace/types";

import { useAuthContext } from "../../providers/AuthProvider";

type UseUserReturn =
  | { isLoaded: false; isSignedIn: false; user: null }
  | { isLoaded: true; isSignedIn: false; user: null }
  | {
      isLoaded: true;
      isSignedIn: true;
      user: UserAccessControlProfile;
      can: (permission: string) => boolean;
      is: (role: string) => boolean;
    };

export const useUser = (): UseUserReturn => {
  const { user, isLoading } = useAuthContext();

  if (!isLoading && !user) {
    return {
      isLoaded: true,
      isSignedIn: false,
      user: null,
    };
  }

  if (!user) {
    return {
      isLoaded: false,
      isSignedIn: false,
      user: null,
    };
  }

  /**
   * Helper: Check if user has a specific permission
   */
  const can = (permission: string) => {
    if (!user) return false;
    // Admin Override: super-admin can do anything
    if (user.roles.includes("super-admin")) return true;
    return user.permissions.includes(permission);
  };

  /**
   * Helper: Check if user has a specific role
   */
  const is = (role: string) => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  return {
    isLoaded: true,
    isSignedIn: true,
    user,
    can,
    is,
  };
};
