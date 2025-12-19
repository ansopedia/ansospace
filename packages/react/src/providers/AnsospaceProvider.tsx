"use client";

import { AnsospaceProviderProps } from "../types";
import { AuthProvider } from "./AuthProvider";
import { ReactQueryProvider } from "./ReactQueryProvider";

export const AnsospaceProvider = ({ children, config, initialUser }: AnsospaceProviderProps) => {
  return (
    <ReactQueryProvider>
      <AuthProvider config={config} initialUser={initialUser}>
        {children}
      </AuthProvider>
    </ReactQueryProvider>
  );
};
