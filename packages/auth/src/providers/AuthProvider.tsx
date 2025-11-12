"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";

import { GetPermission, IApiResponse, Login, LoginResponse, ObjectId } from "@ansospace/types";

import { AnsospaceAuth } from "../core/AnsospaceAuth";
import { TokenStorage } from "../types";

export interface AuthConfig {
  baseUrl: string;
  tokenStorage: TokenStorage;
}

export interface AuthConfig {
  baseUrl: string;
  tokenStorage: TokenStorage;
}

export interface AuthState {
  userId: ObjectId | null;
  isAuthenticated: boolean;
  permissions: GetPermission[];
}

export interface AuthContextValue extends AuthState {
  login: (body: Login) => Promise<IApiResponse<LoginResponse>>;
  logout: () => Promise<void>;
  setPermissions: (permissions: GetPermission[]) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children, config }: { children: ReactNode; config?: Partial<AuthConfig> }) => {
  const [instance] = useState(() => AnsospaceAuth.init(config));
  const [userId, setUserId] = useState<ObjectId | null>(null);
  const [permissions, setPermissions] = useState<GetPermission[]>([]);

  // On mount, try to load userId from tokenStorage
  useEffect(() => {
    const loadUserId = async () => {
      const storedUserId = await instance.tokenStorage.getUserId();
      if (storedUserId) {
        setUserId(storedUserId as unknown as ObjectId);
      }
    };
    loadUserId();
  }, [instance.tokenStorage]);

  const login = async (body: Login) => {
    instance.auth.loginUser(body);
    const response = await instance.auth.loginUser(body);
    if (response.status === "success") {
      setUserId(response.data.userId);
      await instance.tokenStorage.saveUserId(response.data.userId.toString());
    }
    return response;
  };

  const logout = async () => {
    setUserId(null);
    setPermissions([]);
    await instance.tokenStorage.deleteUserId();
    await instance.auth.logout();
  };

  const value: AuthContextValue = {
    userId,
    isAuthenticated: !!userId,
    permissions,
    login,
    logout,
    setPermissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthProviderContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
