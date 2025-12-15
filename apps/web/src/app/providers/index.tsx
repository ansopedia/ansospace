"use client";

import * as React from "react";

import { AnsospaceProvider, BrowserStorageAdapter } from "@ansospace/react";
import { TokenManager } from "@ansospace/sdk";
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
      <AnsospaceProvider
        config={{
          baseUrl,
          storage: new TokenManager(new BrowserStorageAdapter()),
        }}
      >
        {children}
      </AnsospaceProvider>
      <Toaster richColors />
    </NextThemesProvider>
  );
}
