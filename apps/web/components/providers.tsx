"use client";

import * as React from "react";

import { AuthProvider } from "@ansospace/auth";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { config } from "../app/config/ansospace";

export function Providers({ children, baseUrl }: { baseUrl: string; children: React.ReactNode }) {
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
