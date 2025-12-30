"use client";

import { QueryClientProvider } from "@tanstack/react-query";

import { getQueryClient } from "./get-query-client";

type ReactQueryProviderProps = {
  children: React.ReactNode;
};

export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  const client = getQueryClient();

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
