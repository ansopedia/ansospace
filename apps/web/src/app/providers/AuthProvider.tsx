"use client";
import { AnsospaceProvider, AuthUser, BrowserStorageAdapter } from "@ansospace/react";
import { TokenManager } from "@ansospace/sdk";

export type AuthProvidersProps = {
  baseUrl: string;
  children: React.ReactNode;
  initialUser?: AuthUser;
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
