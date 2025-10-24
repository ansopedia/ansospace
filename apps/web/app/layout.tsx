import Link from "next/link";

import "@ansospace/ui/globals.css";

import { Providers } from "@/components/providers";

import { env } from "../lib/env";

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>): React.ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
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
