"use client";
import { AnsospaceProvider, BrowserStorageAdapter } from "@ansospace/react";
import { TokenManager } from "@ansospace/sdk";
import { UserAccessControlProfile } from "@ansospace/types";

export type AuthProvidersProps = {
  baseUrl: string;
  children: React.ReactNode;
  initialUser?: UserAccessControlProfile;
};

export function AuthProvider({ children, baseUrl, initialUser }: AuthProvidersProps) {
  return (
    <AnsospaceProvider
      config={{
        baseUrl: baseUrl,
        storage: new TokenManager(new BrowserStorageAdapter()),
      }}
      initialUser={initialUser}
    >
      {children}
    </AnsospaceProvider>
  );
}
