import { cookies } from "next/headers";

import { AuthUser } from "@ansospace/react";
import { AnsospaceSDK } from "@ansospace/sdk";
import type { UserAccessControlProfile } from "@ansospace/types";
import { TokenType } from "@ansospace/types";

import { ANSOSPACE_CONFIG } from "./config";
import { NextServerStorage } from "./storage";

// Helper to get a ready-to-use SDK on the server
export const getServerSdk = async () => {
  return new AnsospaceSDK({
    baseUrl: ANSOSPACE_CONFIG.baseUrl,
    storage: new NextServerStorage(), // Plug in the cookie adapter
  });
};

/**
 * Internal function to fetch user profile
 * Uses getServerSdk which reads cookies, but this is okay because
 * we're caching the result, not the function that accesses cookies
 */
export async function fetchServerUserInternal(accessToken: string): Promise<UserAccessControlProfile | undefined> {
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

  const user = await fetchServerUserInternal(accessToken);

  return user
    ? {
        ...user,
        kind: "AUTHENTICATED",
        isVerified: true,
      }
    : undefined;
}
