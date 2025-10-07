"use client";

import { createContext } from "react";

import { GetPermission, ObjectId } from "@ansospace/types";

import { ApiClient } from "../apiClient";
import { AuthService } from "../services/authService";

export interface AuthState {
  userId: ObjectId | null;
  isAuthenticated: boolean;
  permissions: GetPermission[];
}

export interface AuthContextValue extends AuthState {
  login: (userId: ObjectId, permissions?: GetPermission[]) => Promise<void>;
  logout: () => Promise<void>;
  setPermissions: (permissions: GetPermission[]) => void;
  apiClient: ApiClient;
  authService: AuthService;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
