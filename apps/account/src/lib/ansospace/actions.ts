"use server";
import { cookies } from "next/headers";

import { AuthUser } from "@ansospace/react";
import { ChangePasswordRequest, TokenType, UserAccessControlProfile } from "@ansospace/types";

import { getServerSdk } from "./server";

async function fetchServerUserInternal(): Promise<UserAccessControlProfile | undefined> {
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

  // If no token, user is not authenticated
  if (!accessToken) return undefined;

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
