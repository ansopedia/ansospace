import Link from "next/link";

import { AnsospaceAuth, TokenManager } from "@ansospace/auth";
import "@ansospace/ui/globals.css";

import { env } from "../lib/env";
import { ServerStorageAdapter } from "../lib/storage/ServerStorageAdapter";
import { Providers } from "./providers";

export interface RootLayoutProps {
  children: React.ReactNode;
}

AnsospaceAuth.init({
  baseUrl: env.USER_SERVICE_URL,
  storage: new TokenManager(new ServerStorageAdapter()),
});
export default async function RootLayout({ children }: Readonly<RootLayoutProps>): Promise<React.ReactElement> {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={"font-sans antialiased"}>
        <Providers baseUrl={env.USER_SERVICE_URL}>
          <nav>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/login">login</Link>
              </li>
              <li>
                <Link href="/dashboard">dashboard</Link>
              </li>
            </ul>
          </nav>
          {children}
        </Providers>
      </body>
    </html>
  );
}
