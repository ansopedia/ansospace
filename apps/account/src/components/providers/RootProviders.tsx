"use client";

import { Toaster } from "@ansospace/ui/components";
import { ThemeProvider as NextThemesProvider } from "@ansospace/ui/theme";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AuthProvider, AuthProvidersProps } from "./AuthProvider";
import { ReactQueryProvider } from "./ReactQueryProvider";

export function RootProviders({ children, baseUrl, initialUser }: AuthProvidersProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <ReactQueryProvider>
        <AuthProvider baseUrl={baseUrl} initialUser={initialUser}>
          {children}
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </ReactQueryProvider>

      <Toaster richColors />
    </NextThemesProvider>
  );
}
