"use client";

import * as React from "react";

import {
  AuthProvider,
  TOKEN_STORAGE_KEYS,
  TokenManager,
  createAuthConfig,
  createCookieStorageAdapter,
} from "@ansospace/auth/client";
import { Toaster } from "@ansospace/ui/components";
import { ThemeProvider as NextThemesProvider } from "@ansospace/ui/theme";

export function Providers({ children, baseUrl }: { baseUrl: string; children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <AuthProvider
        config={createAuthConfig(baseUrl, {
          tokenStorage: new TokenManager(
            createCookieStorageAdapter(),
            TOKEN_STORAGE_KEYS.AUTHORIZATION,
            TOKEN_STORAGE_KEYS.REFRESH_TOKEN,
            TOKEN_STORAGE_KEYS.USER_ID
          ),
        })}
      >
        {children}
        <Toaster />
      </AuthProvider>
    </NextThemesProvider>
  );
}
