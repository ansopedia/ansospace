"use client";

import { ReactNode } from "react";

import type { AnsospaceStorage } from "@ansospace/types";

import { AuthProvider } from "./AuthProvider";
import { ReactQueryProvider } from "./ReactQueryProvider";

export interface AnsospaceProviderConfig {
  baseUrl: string;
  storage: AnsospaceStorage;
}

export const AnsospaceProvider = ({ children, config }: { children: ReactNode; config: AnsospaceProviderConfig }) => {
  return (
    <ReactQueryProvider>
      <AuthProvider config={config}>{children}</AuthProvider>
    </ReactQueryProvider>
  );
};
