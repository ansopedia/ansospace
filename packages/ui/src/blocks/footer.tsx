"use client";

import * as React from "react";

import { cn } from "../lib/utils";

export interface FooterProps extends React.ComponentProps<"footer"> {
  copyright?: string;
  links?: Array<{
    label: string;
    href: string;
  }>;
}

export const Footer = ({ copyright, links, className, children, ...props }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} AnsoSpace. All rights reserved.`;

  return (
    <footer className={cn("bg-background text-muted-foreground mt-auto border-t py-4", className)} {...props}>
      <div className="container mx-auto px-4">
        {children || (
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm">{copyright || defaultCopyright}</p>
            {links && links.length > 0 && (
              <nav className="flex gap-4">
                {links.map((link) => (
                  <a key={link.href} href={link.href} className="hover:text-foreground text-sm transition-colors">
                    {link.label}
                  </a>
                ))}
              </nav>
            )}
          </div>
        )}
      </div>
    </footer>
  );
};
