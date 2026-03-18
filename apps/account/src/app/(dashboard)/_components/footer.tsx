"use client";

import Link from "next/link";

import { Typography } from "@ansospace/ui/components";

const links = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Support", href: "/support" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} AnsoSpace. All rights reserved.`;

  return (
    <footer className={"text-muted-foreground mt-auto py-4"}>
      <div className="mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Typography variant="mutedText">{defaultCopyright}</Typography>
          {links && links.length > 0 && (
            <nav className="flex gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-foreground not-last:border-border text-sm transition-colors not-last:border-r not-last:pr-4"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
};
