import { ReactNode } from "react";

import { AnsospaceStorage, Email, ObjectId, UserAccessControlProfile } from "@ansospace/types";

// 1. GUEST: No data known
export type GuestUser = {
  kind: "GUEST";
};

// 2. PARTIAL: Known from Storage/Invite (Not fully validated by backend yet)
export type PartialUser = {
  kind: "PARTIAL";
  id?: ObjectId; // We might know ID (from previous login)
  email?: Email; // We might know Email (from invite/OTP)
  isVerified: boolean;
};

// 3. AUTHENTICATED: Full profile from backend
export type AuthenticatedUser = UserAccessControlProfile & {
  kind: "AUTHENTICATED";
  isVerified: true; // Always true for this state
};

// The Unified User Type
export type AuthUser = GuestUser | PartialUser | AuthenticatedUser;

export type AnsospaceProviderConfig = {
  baseUrl: string;
  storage: AnsospaceStorage;
};

export type AnsospaceProviderProps = {
  children: ReactNode;
  config: { baseUrl: string; storage: AnsospaceStorage };
  initialUser?: AuthUser;
};
