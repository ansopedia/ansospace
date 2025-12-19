import { Metadata } from "next";

import "@ansospace/ui/globals.css";

import { RootProviders } from "../components/providers/RootProviders";
import { ANSOSPACE_CONFIG } from "../lib/ansospace/config";

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
        <RootProviders baseUrl={ANSOSPACE_CONFIG.baseUrl}>{children}</RootProviders>
      </body>
    </html>
  );
}
