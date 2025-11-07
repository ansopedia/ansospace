"use client";

import * as React from "react";

import { AuthManager, AuthProvider } from "@ansospace/auth";
import { ThemeProvider as NextThemesProvider } from "@ansospace/ui/theme";

import { config } from "../app/config/ansospace";

export function Providers({ children, baseUrl }: { baseUrl: string; children: React.ReactNode }) {
  AuthManager.init(config(baseUrl));

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <AuthProvider config={config(baseUrl)}>{children}</AuthProvider>
    </NextThemesProvider>
  );
}
