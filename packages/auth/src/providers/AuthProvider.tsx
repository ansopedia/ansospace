"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";

import type { OtpEvent, OtpVerifyEvent } from "@ansospace/types";
import { GetPermission, Login, ObjectId, RegisterSchema } from "@ansospace/types";

import { AnsospaceAuth } from "../core/AnsospaceAuth";
import { AuthService } from "../services/authService";
import { AuthConfig } from "../types";

export interface AuthState {
  userId: ObjectId | null;
  isAuthenticated: boolean;
  permissions: GetPermission[];
}

// Use mapped types to reference AuthService methods, avoiding duplication
type AuthServiceMethods = Pick<AuthService, "login" | "register" | "sendOtp" | "verifyOtp" | "autoLogin">;

export interface AuthContextValue extends AuthState, AuthServiceMethods {
  logout: () => Promise<void>;
  setPermissions: (permissions: GetPermission[]) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children, config }: { children: ReactNode; config?: Partial<AuthConfig> }) => {
  const [instance] = useState(() => AnsospaceAuth.init(config));
  const [userId, setUserId] = useState<ObjectId | null>(null);
  const [permissions, setPermissions] = useState<GetPermission[]>([]);

  // Load existing user from tokenStorage on mount
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = await instance.storage.get("user-id");
        if (storedUserId) {
          setUserId(storedUserId as unknown as ObjectId);
        }
      } catch (error) {
        console.error("Failed to load user ID from tokenStorage:", error);
      }
    };
    loadUserId();
  }, [instance.storage]);

  // ✅ Login Handler
  const login = async (body: Login) => {
    const response = await instance.auth.login(body);
    if (response.status === "success") {
      const { userId } = response.data;
      setUserId(userId);
      await instance.storage.set("user-id", userId.toString());
    }
    return response;
  };

  // ✅ Register Handler
  const register = async (body: RegisterSchema) => {
    const response = await instance.auth.register(body);
    if (response.status === "success") {
      const { actionToken, userId } = response.data;
      setUserId(userId);
      await instance.storage.set("user-id", userId.toString());
      await instance.storage.set("action", actionToken);
    }
    return response;
  };

  const sendOtp = async (body: OtpEvent) => {
    return await instance.auth.sendOtp(body);
  };

  const verifyOtp = async (body: OtpVerifyEvent) => {
    return await instance.auth.verifyOtp(body);
  };

  const autoLogin = async (body: { actionToken: string }) => {
    const response = await instance.auth.autoLogin(body);
    if (response.status === "success") {
      const { userId } = response.data;
      setUserId(userId);
      await instance.storage.set("user-id", userId.toString());
    }
    return response;
  };

  // ✅ Logout Handler
  const logout = async () => {
    try {
      setUserId(null);
      setPermissions([]);
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
    sendOtp,
    verifyOtp,
    autoLogin,
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
