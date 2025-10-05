import { Geist, Geist_Mono } from "next/font/google";

import "@ansospace/ui/globals.css";
import { ThemeProvider } from "@ansospace/ui/theme";

import { Providers } from "@/components/providers";

import { env } from "../lib/env";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>): React.ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers baseUrl={env.USER_SERVICE_URL}>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
