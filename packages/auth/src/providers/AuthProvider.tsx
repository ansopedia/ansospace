"use client";

import { ReactNode, useEffect, useState } from "react";

import { GetPermission, MongooseObjectId } from "@ansospace/types";

import { ApiClient } from "../apiClient";
import { AuthContext, AuthContextValue } from "../context/AuthContext";
import { AuthService } from "../services/authService";
import { TokenStorage } from "../utils/tokenManager";

export interface AuthConfig {
  baseUrl: string;
  tokenStorage: TokenStorage;
}

export interface AuthConfig {
  baseUrl: string;
  tokenStorage: TokenStorage;
}

export const AuthProvider = ({ children, config }: { children: ReactNode; config: AuthConfig }) => {
  const [userId, setUserId] = useState<MongooseObjectId | null>(null);
  const [permissions, setPermissions] = useState<GetPermission[]>([]);

  const apiClient = new ApiClient(config.baseUrl, config.tokenStorage);
  const authService = new AuthService(apiClient);

  // On mount, try to load userId from tokenStorage
  useEffect(() => {
    const loadUserId = async () => {
      const storedUserId = await config.tokenStorage.getUserId();
      if (storedUserId) {
        setUserId(storedUserId as unknown as MongooseObjectId);
      }
    };
    loadUserId();
  }, [config.tokenStorage]);

  const login = async (id: MongooseObjectId, perms: GetPermission[] = []) => {
    setUserId(id);
    setPermissions(perms);
    await config.tokenStorage.saveUserId(id.toString());
  };

  const logout = async () => {
    setUserId(null);
    setPermissions([]);
    // Remove userId via tokenStorage
    await config.tokenStorage.deleteUserId();
    // Tokens are cleared by authService or apiClient
  };

  const value: AuthContextValue = {
    userId,
    isAuthenticated: !!userId,
    permissions,
    login,
    logout,
    setPermissions,
    apiClient,
    authService,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
