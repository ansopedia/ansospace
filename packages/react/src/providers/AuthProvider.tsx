// providers/AuthProvider.tsx
"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";

import { AnsospaceSDK } from "@ansospace/sdk";
import { type AnsospaceStorage, Email, ObjectId, UserAccessControlProfile } from "@ansospace/types";
import { useQuery } from "@tanstack/react-query";

// 1. GUEST: No data known
export type GuestUser = {
  kind: "GUEST";
};

// 2. PARTIAL: Known from Storage/Invite (Not fully validated by backend yet)
export type PartialUser = {
  kind: "PARTIAL";
  id?: ObjectId; // We might know ID (from previous login)
  email?: Email; // We might know Email (from invite/OTP)
  isVerified: boolean;
};

// 3. AUTHENTICATED: Full profile from backend
export type AuthenticatedUser = UserAccessControlProfile & {
  kind: "AUTHENTICATED";
  isVerified: true; // Always true for this state
};

// The Unified User Type
export type AuthUser = GuestUser | PartialUser | AuthenticatedUser;
export interface AuthContextValue {
  user: AuthUser;
  isAuthLoading: boolean;
  sdk: AnsospaceSDK;
  storage: AnsospaceStorage;
  updateUser: (updates: Partial<AuthUser>) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({
  children,
  config,
}: {
  children: ReactNode;
  config: { baseUrl: string; storage: AnsospaceStorage };
}) => {
  const [sdk] = useState(() => new AnsospaceSDK(config));

  // 1. STATE: Default to GUEST
  const [user, setUser] = useState<AuthUser>({ kind: "GUEST" });
  const [isStorageChecked, setIsStorageChecked] = useState(false);

  // 2. BOOTSTRAP: Hydrate from Storage
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [id, email, verifiedStr] = await Promise.all([
          config.storage.get("userId"),
          config.storage.get("userEmail"),
          config.storage.get("isUserVerified"),
        ]);

        if (id || email) {
          setUser({
            kind: "PARTIAL",
            id: id as unknown as ObjectId,
            email: email as Email,
            isVerified: verifiedStr === "true" || verifiedStr === true,
          });
        }
      } catch (e) {
        console.error("Storage check failed", e);
      } finally {
        setIsStorageChecked(true);
      }
    };
    bootstrap();
  }, [config.storage]);

  // 3. QUERY: Fetch Full Profile
  // Only runs if we have an ID (meaning we are at least Partial/Authenticated)
  const hasSessionId = user.kind !== "GUEST" && !!user.id;

  const { data: profile, isLoading: isQueryLoading } = useQuery({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      const res = await sdk.auth.getMyAccessProfile();
      return res.status === "success" ? res.data : null;
    },
    // 🔥 Only run if storage is checked AND we found a session marker
    enabled: isStorageChecked && hasSessionId,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // 4. SYNC EFFECT: Upgrade User when Query Data Arrives
  useEffect(() => {
    if (profile) {
      setUser((prev) => ({
        ...prev, // Keep existing partial data if needed
        ...profile, // Overwrite with backend data
        kind: "AUTHENTICATED",
        isVerified: true,
      }));
    }
  }, [profile]);

  // 5. Helper to let hooks update state manually (e.g. after Login success)
  const updateUser = (updates: Partial<AuthUser>) => {
    setUser((prev) => ({ ...prev, ...updates }) as AuthUser);
  };

  // 6. LOADING STATE:
  // We are loading if:
  // a) We haven't finished checking storage yet
  // b) We found a session and are currently fetching it from API
  const isAuthLoading = !isStorageChecked || (hasSessionId && isQueryLoading);

  const value: AuthContextValue = {
    user: user || null,
    isAuthLoading,
    sdk,
    storage: config.storage,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AnsospaceProvider");
  return context;
};
