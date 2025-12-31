"use client";

import { AnsospaceProviderProps } from "../types";
import { AuthProvider } from "./AuthProvider";

/**
 * AnsospaceProvider - Provides auth context and SDK
 *
 * NOTE: ReactQueryProvider should be provided at the app root level (e.g., in RootProviders)
 * This allows server-side data hydration to work correctly with a single QueryClient instance
 */
export const AnsospaceProvider = ({ children, config, initialUser }: AnsospaceProviderProps) => {
  return (
    <AuthProvider config={config} initialUser={initialUser}>
      {children}
    </AuthProvider>
  );
};
