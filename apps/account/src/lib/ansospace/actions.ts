"use server";
import { cookies, headers } from "next/headers";

import { AuthUser } from "@ansospace/react";
import type {
  AuditLog,
  AuditLogQuery,
  ChangePasswordRequest,
  IApiResponse,
  UserAccessControlProfile,
} from "@ansospace/types";
import { TokenType } from "@ansospace/types";

import { getServerSdk } from "./server";

async function fetchServerUserInternal(): Promise<UserAccessControlProfile | undefined> {
  const headerStore = await headers();

  // 1. Check if user data was already fetched by middleware
  const userDataHeader = headerStore.get("x-ansospace-user");
  if (userDataHeader) {
    try {
      return JSON.parse(userDataHeader) as UserAccessControlProfile;
    } catch {
      // JSON parsing failed or header is malformed; fallback to auth status
    }
  }

  // 2. Check auth status from middleware - if it says unauthenticated, don't even try the API
  const authStatus = headerStore.get("x-ansospace-auth-status");
  if (authStatus === "unauthenticated") {
    return undefined;
  }

  // 3. Otherwise fetch from API (e.g. if middleware was skipped or in a server action)
  try {
    const sdk = await getServerSdk();
    const res = await sdk.auth.getMyAccessProfile();
    return res.status === "success" ? res.data : undefined;
  } catch {
    return undefined;
  }
}

export async function getServerUser(): Promise<AuthUser | undefined> {
  // Read token from cookies (outside cache scope)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(TokenType.AUTHORIZATION)?.value;
  const refreshToken = cookieStore.get(TokenType.REFRESH)?.value;

  // If no tokens, user is not authenticated
  if (!accessToken && !refreshToken) return undefined;

  const user = await fetchServerUserInternal();

  return user
    ? {
        ...user,
        kind: "AUTHENTICATED",
        isVerified: true,
      }
    : undefined;
}

export async function getSessionsData() {
  const sdk = await getServerSdk();
  const sessionsRes = await sdk.auth.getActiveSessions();
  return sessionsRes.status === "success" ? sessionsRes.data : [];
}

export const changePasswordAction = async (data: ChangePasswordRequest) => {
  const sdk = await getServerSdk();
  return await sdk.auth.changePassword(data);
};

export const getAuditLogsAction = async (options?: Partial<AuditLogQuery>): Promise<IApiResponse<AuditLog>> => {
  const sdk = await getServerSdk();
  return await sdk.auth.getAuditLogs(options);
};
