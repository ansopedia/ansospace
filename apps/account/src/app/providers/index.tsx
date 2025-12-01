"use client";

import * as React from "react";

import { AnsospaceProvider, BrowserStorageAdapter, TokenManager } from "@ansospace/react";
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
        <AnsospaceProvider
          config={{
            baseUrl,
            storage: new TokenManager(new BrowserStorageAdapter()),
          }}
        >
          {children}
        </AnsospaceProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </ReactQueryProvider>

      <Toaster richColors />
    </NextThemesProvider>
  );
}
