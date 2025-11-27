import Link from "next/link";

import "@ansospace/ui/globals.css";

import { env } from "../lib/env";
import { Providers } from "./providers";

export interface RootLayoutProps {
  children: React.ReactNode;
}

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
