import { Metadata } from "next";

import "@ansospace/ui/globals.css";

import { env } from "../lib/env";
import { Providers } from "./providers";

export interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "AnsoSpace Account",
  description: "Manage your AnsoSpace account - login, dashboard, and account settings",
};

export default async function RootLayout({ children }: Readonly<RootLayoutProps>): Promise<React.ReactElement> {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={"font-sans antialiased"}>
        <Providers baseUrl={env.USER_SERVICE_URL}>{children}</Providers>
      </body>
    </html>
  );
}
