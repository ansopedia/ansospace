"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";

import { AnsospaceSDK } from "@ansospace/sdk";
import type {
  AnsospaceStorage,
  Email,
  GetPermission,
  Login,
  ObjectId,
  OtpEvent,
  OtpVerifyEvent,
  RegisterSchema,
} from "@ansospace/types";

export interface AuthState {
  userId: ObjectId | null;
  isAuthenticated: boolean;
  permissions: GetPermission[];
  isAuthLoading: boolean;
  isVerified: boolean;
  userEmail: Email | null;
}

export interface AuthContextValue extends AuthState {
  login: (body: Login) => Promise<import("@ansospace/types").IApiResponse<import("@ansospace/types").LoginResponse>>;
  register: (
    body: RegisterSchema
  ) => Promise<import("@ansospace/types").IApiResponse<import("@ansospace/types").RegisterResponse>>;
  sendOtp: (
    body: OtpEvent
  ) => Promise<import("@ansospace/types").IApiResponse<import("@ansospace/types").SendOtpResponse>>;
  verifyOtp: (
    body: Omit<OtpVerifyEvent, "token">
  ) => Promise<import("@ansospace/types").IApiResponse<import("@ansospace/types").VerifyOtpResponse>>;
  autoLogin: (body: {
    actionToken: string;
  }) => Promise<import("@ansospace/types").IApiResponse<import("@ansospace/types").LoginResponse>>;
  logout: () => Promise<void>;
  setPermissions: (permissions: GetPermission[]) => void;
  sdk: AnsospaceSDK;
}

export interface AnsospaceProviderConfig {
  baseUrl: string;
  storage: AnsospaceStorage;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AnsospaceProvider = ({ children, config }: { children: ReactNode; config: AnsospaceProviderConfig }) => {
  const [sdk] = useState(() => new AnsospaceSDK(config));
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
          config.storage.get("userId"),
          config.storage.get("isUserVerified"),
          config.storage.get("userEmail"),
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
        console.error("Failed to load state from storage:", error);
      } finally {
        setIsAuthLoading(false);
      }
    };
    loadAuthState();
  }, [config.storage]);

  // ✅ Login Handler
  const login = async (body: Login) => {
    const response = await sdk.auth.login(body);

    if (response.status === "success") {
      const { userId } = response.data;
      setUserId(userId);
      setIsVerified(true);
      await config.storage.set("userId", userId.toString());
      await config.storage.set("isUserVerified", true);
    } else {
      setIsVerified(false);
      await config.storage.set("isUserVerified", false);
      if (body.email) {
        setUserEmail(body.email);
        await config.storage.set("userEmail", body.email);
      }
    }
    return response;
  };

  // ✅ Register Handler
  const register = async (body: RegisterSchema) => {
    const response = await sdk.auth.register(body);

    if (response.status === "success") {
      const { actionToken, userId } = response.data;
      setUserId(userId);
      setUserEmail(body.email);
      setIsVerified(false);
      await config.storage.set("userId", userId.toString());
      await config.storage.set("action", actionToken);
      await config.storage.set("userEmail", body.email);
      await config.storage.set("isUserVerified", false);
    }
    return response;
  };

  const sendOtp = async (body: OtpEvent) => {
    const response = await sdk.auth.sendOtp(body);

    if (response.status === "success") {
      const { token } = response.data;
      await config.storage.set("action", token);
      if (body.email) {
        setUserEmail(body.email);
        await config.storage.set("userEmail", body.email);
      }
    }
    return response;
  };

  // IMPORTANT: Update verification status after successful OTP
  const verifyOtp = async (body: Omit<OtpVerifyEvent, "token">) => {
    const token = await config.storage.get("action");
    if (!token) {
      throw new Error("Action token not found");
    }
    const response = await sdk.auth.verifyOtp({ ...body, token: token as string });

    // Update state and storage synchronously after async API call success
    if (response.status === "success") {
      setIsVerified(true);
      setUserEmail(null);
      await config.storage.remove("isUserVerified");
      await config.storage.remove("action");
      await config.storage.remove("userEmail");
    }
    return response;
  };

  const autoLogin = async (body: { actionToken: string }) => {
    const response = await sdk.auth.autoLogin(body);
    if (response.status === "success") {
      const { userId } = response.data;
      setUserId(userId);
      setIsVerified(true);
      await config.storage.set("userId", userId.toString());
      await config.storage.set("isUserVerified", true);
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
      await sdk.auth.logout();
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
    sdk,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ✅ Hook to consume AuthContext safely
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AnsospaceProvider");
  }
  return context;
};
