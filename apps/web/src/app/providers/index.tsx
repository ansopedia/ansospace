"use client";

import * as React from "react";

import { AuthConfig, BrowserStorageAdapter, TokenManager } from "@ansospace/auth";
import { AuthProvider } from "@ansospace/auth/client";
import { Toaster } from "@ansospace/ui/components";
import { ThemeProvider as NextThemesProvider } from "@ansospace/ui/theme";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ReactQueryProvider } from "./ReactQueryProvider";

export function Providers({ children, baseUrl }: { baseUrl: string; children: React.ReactNode }) {
  const authConfig: AuthConfig = {
    baseUrl,
    storage: new TokenManager(new BrowserStorageAdapter()),
  };

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <ReactQueryProvider>
        <AuthProvider config={authConfig}>{children}</AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </ReactQueryProvider>

      <Toaster richColors />
    </NextThemesProvider>
  );
}
