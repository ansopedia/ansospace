"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";

import {
  GetPermission,
  IApiResponse,
  Login,
  LoginResponse,
  ObjectId,
  RegisterResponse,
  RegisterSchema,
  UserActionType,
} from "@ansospace/types";

import { AnsospaceAuth } from "../core/AnsospaceAuth";
import { useSessionStorage } from "../hooks/useSessionStorage";
import { TokenStorage } from "../types";

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
  register: (body: RegisterSchema) => Promise<IApiResponse<RegisterResponse>>;
  logout: () => Promise<void>;
  setPermissions: (permissions: GetPermission[]) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children, config }: { children: ReactNode; config?: Partial<AuthConfig> }) => {
  const [instance] = useState(() => AnsospaceAuth.init(config));
  const [userId, setUserId] = useState<ObjectId | null>(null);
  const [permissions, setPermissions] = useState<GetPermission[]>([]);

  const [, setSessionData] = useSessionStorage<UserActionType, string | null>(UserActionType.VERIFY_EMAIL, null);

  // Load existing user from tokenStorage on mount
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = await instance.tokenStorage.getUserId();
        if (storedUserId) {
          setUserId(storedUserId as unknown as ObjectId);
        }
      } catch (error) {
        console.error("Failed to load user ID from tokenStorage:", error);
      }
    };
    loadUserId();
  }, [instance.tokenStorage]);

  // ✅ Login Handler
  const login = async (body: Login) => {
    const response = await instance.auth.loginUser(body);
    if (response.status === "success" && response.data?.userId) {
      const uid = response.data.userId as ObjectId;
      setUserId(uid);
      await instance.tokenStorage.saveUserId(uid.toString());
    }
    return response;
  };

  // ✅ Register Handler
  const register = async (body: RegisterSchema) => {
    const response = await instance.auth.register(body);
    if (response.status === "success" && response.data?.userId) {
      const uid = response.data.userId as ObjectId;
      setUserId(uid);
      await instance.tokenStorage.saveUserId(uid.toString());

      // Store token in session for verification step
      if (response.data.token) {
        setSessionData(response.data.token);
      }
    }
    return response;
  };

  // ✅ Logout Handler
  const logout = async () => {
    try {
      setUserId(null);
      setPermissions([]);
      await instance.tokenStorage.deleteUserId();
      await instance.auth.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value: AuthContextValue = {
    userId,
    isAuthenticated: !!userId,
    permissions,
    login,
    register,
    logout,
    setPermissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ✅ Hook to consume AuthContext safely
export const useAuthProviderContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthProviderContext must be used within an AuthProvider");
  }
  return context;
};
