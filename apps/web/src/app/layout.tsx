import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "@ansospace/ui/globals.css";

import { env } from "../lib/env";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AnsoSpace",
  description: "AnsoSpace - Your learning platform for comprehensive education and skill development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers baseUrl={env.USER_SERVICE_URL}>{children}</Providers>
      </body>
    </html>
  );
}
