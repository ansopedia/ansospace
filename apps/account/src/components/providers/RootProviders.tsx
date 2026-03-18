"use client";

import { ReactNode } from "react";

import { Toaster } from "@ansospace/ui/components";
import { ThemeProvider as AnsospaceThemeProvider } from "@ansospace/ui/theme";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ReactQueryProvider } from "./ReactQueryProvider";

export function RootProviders({ children }: { children: ReactNode }) {
  return (
    <AnsospaceThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <ReactQueryProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </ReactQueryProvider>
      <Toaster richColors />
    </AnsospaceThemeProvider>
  );
}
