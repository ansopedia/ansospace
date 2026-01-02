"use client";

import { ReactNode, Suspense } from "react";

import { Toaster } from "@ansospace/ui/components";
import { ThemeProvider as NextThemesProvider } from "@ansospace/ui/theme";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ReactQueryProvider } from "./ReactQueryProvider";

export function RootProviders({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <ReactQueryProvider>
        <Suspense>{children}</Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </ReactQueryProvider>

      <Toaster richColors />
    </NextThemesProvider>
  );
}
