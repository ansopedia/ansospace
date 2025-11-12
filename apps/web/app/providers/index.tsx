"use client";

import * as React from "react";

import { BrowserStorageAdapter, TOKEN_STORAGE_KEYS, TokenManager } from "@ansospace/auth";
import { AuthProvider } from "@ansospace/auth/client";
import { Toaster } from "@ansospace/ui/components";
import { ThemeProvider as NextThemesProvider } from "@ansospace/ui/theme";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ReactQueryProvider } from "./ReactQueryProvider";

export function Providers({ children, baseUrl }: { baseUrl: string; children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <ReactQueryProvider>
        <AuthProvider
          config={{
            baseUrl,
            tokenStorage: new TokenManager(
              new BrowserStorageAdapter(),
              TOKEN_STORAGE_KEYS.AUTHORIZATION,
              TOKEN_STORAGE_KEYS.REFRESH_TOKEN,
              TOKEN_STORAGE_KEYS.USER_ID
            ),
          }}
        >
          {children}
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </ReactQueryProvider>

      <Toaster richColors />
    </NextThemesProvider>
  );
}
