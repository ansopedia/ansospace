"use client";

import { createContext, useContext, useState } from "react";

import { AnsospaceSDK } from "@ansospace/sdk";
import { type AnsospaceStorage, UserAccessControlProfile } from "@ansospace/types";
import { useQuery } from "@tanstack/react-query";

import { AUTH_QUERY_KEYS } from "../constants/queryKeys";
import { AnsospaceProviderProps, GuestUser } from "../types";

export interface AuthContextValue {
  user?: UserAccessControlProfile | null;
  isLoading: boolean;
  sdk: AnsospaceSDK;
  storage: AnsospaceStorage;
  guestUser?: GuestUser | null;
  setGuestUser: (guestUser: GuestUser | null) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AnsospaceProvider = ({ children, config, initialUser }: AnsospaceProviderProps) => {
  const [sdk] = useState(() => new AnsospaceSDK(config));

  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: AUTH_QUERY_KEYS.accessProfile,
    queryFn: async () => {
      const res = await sdk.auth.getMyAccessProfile();
      if (res.status === "success") {
        return res.data;
      } else {
        throw new Error(res.message);
      }
    },
    // 🔥 Only run if we need to fetch (not already authenticated from server)
    initialData: initialUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  const value: AuthContextValue = {
    user: data || null,
    isLoading: isLoading,
    sdk,
    storage: config.storage,
    guestUser: guestUser || null,
    setGuestUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AnsospaceProvider");
  return context;
};
