"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";

import type { Email, OtpEvent, OtpVerifyEvent } from "@ansospace/types";
import { GetPermission, Login, ObjectId, RegisterSchema } from "@ansospace/types";

import { AnsospaceAuth } from "../core/AnsospaceAuth";
import { AuthService } from "../services/authService";
import { AuthConfig } from "../types";

export interface AuthState {
  userId: ObjectId | null;
  isAuthenticated: boolean;
  permissions: GetPermission[];
  isAuthLoading: boolean;
  isVerified: boolean;
  userEmail: Email | null;
}

// Use mapped types to reference AuthService methods, avoiding duplication
type AuthServiceMethods = Pick<AuthService, "login" | "register" | "sendOtp" | "verifyOtp" | "autoLogin">;

export interface AuthContextValue extends AuthState, AuthServiceMethods {
  verifyOtp: (body: Omit<OtpVerifyEvent, "token">) => ReturnType<AuthService["verifyOtp"]>;
  logout: () => Promise<void>;
  setPermissions: (permissions: GetPermission[]) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children, config }: { children: ReactNode; config?: Partial<AuthConfig> }) => {
  const [instance] = useState(() => AnsospaceAuth.init(config));
  const [userId, setUserId] = useState<ObjectId | null>(null);
  const [userEmail, setUserEmail] = useState<Email | null>(null);
  const [permissions, setPermissions] = useState<GetPermission[]>([]);

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  // Load existing user ID, permissions, and verification status on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const [storedUserId, storedIsVerified, storedUserEmail] = await Promise.all([
          instance.storage.get("userId"), // Note: Using "userId" as per your new convention
          instance.storage.get("isUserVerified"), // Note: Using "isUserVerified"
          instance.storage.get("userEmail"), // Note: Using "isUserVerified"
        ]);

        if (storedUserId) {
          setUserId(storedUserId as unknown as ObjectId);
        }

        if (storedUserEmail) {
          setUserEmail(storedUserEmail as Email);
        }

        // Convert stored value (string/boolean) to boolean state
        if (storedIsVerified === true || storedIsVerified === "true") {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }
      } catch (error) {
        console.error("Failed to load state from tokenStorage:", error);
      } finally {
        setIsAuthLoading(false); // Authentication state is now ready
      }
    };
    loadAuthState();
  }, [instance.storage]);

  // ✅ Login Handler
  const login = async (body: Login) => {
    const response = await instance.auth.login(body);

    if (response.status === "success") {
      const { userId } = response.data;
      setUserId(userId);
      setIsVerified(true);
      await instance.storage.set("userId", userId.toString());
      await instance.storage.set("isUserVerified", true); // Store the status from the server
    } else {
      setIsVerified(false);
      await instance.storage.set("isUserVerified", false); // Store the status from the server
      if (body.email) {
        setUserEmail(body.email);
        await instance.storage.set("userEmail", body.email);
      }
    }
    return response;
  };

  // ✅ Register Handler
  const register = async (body: RegisterSchema) => {
    const response = await instance.auth.register(body);

    if (response.status === "success") {
      const { actionToken, userId } = response.data;
      setUserId(userId);
      setUserEmail(body.email);
      setIsVerified(false);
      await instance.storage.set("userId", userId.toString());
      await instance.storage.set("action", actionToken);
      await instance.storage.set("userEmail", body.email);
      await instance.storage.set("isUserVerified", false);
    }
    return response;
  };

  const sendOtp = async (body: OtpEvent) => {
    const response = await instance.auth.sendOtp(body);

    if (response.status === "success") {
      const { token } = response.data;
      await instance.storage.set("action", token);
      if (body.email) {
        setUserEmail(body.email);
        await instance.storage.set("userEmail", body.email);
      }
    }
    return response;
  };

  //  IMPORTANT: Update verification status after successful OTP
  const verifyOtp = async (body: Omit<OtpVerifyEvent, "token">) => {
    const token = await instance.storage.get("action");
    if (!token) {
      // return { status: "error", message: "Action token not found" } // Return error response to match type
      throw new Error("Action token not found");
    }
    const response = await instance.auth.verifyOtp({ ...body, token: token as string });

    // Update state and storage synchronously after async API call success
    if (response.status === "success") {
      setIsVerified(true);
      setUserEmail(null);
      await instance.storage.remove("isUserVerified");
      await instance.storage.remove("action");
      await instance.storage.remove("userEmail");
    }
    return response;
  };

  const autoLogin = async (body: { actionToken: string }) => {
    const response = await instance.auth.autoLogin(body);
    if (response.status === "success") {
      const { userId } = response.data;
      setUserId(userId);
      setIsVerified(true);
      await instance.storage.set("userId", userId.toString());
      await instance.storage.set("isUserVerified", true);
    }
    return response;
  };

  // ✅ Logout Handler
  const logout = async () => {
    try {
      setUserId(null);
      setUserEmail(null);
      setIsVerified(false);
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
    isAuthLoading,
    isVerified,
    userEmail,
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
