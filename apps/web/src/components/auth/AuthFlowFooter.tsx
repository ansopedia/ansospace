import Link from "next/link";

import { Separator, Typography } from "@ansospace/ui/components";

interface FooterLink {
  text: string;
  linkText: string;
  href: string;
}

interface AuthFlowFooterProps {
  links: FooterLink[];
}

export function AuthFlowFooter({ links }: AuthFlowFooterProps) {
  return (
    <div className="space-y-4 text-center">
      <Separator className="my-4" />
      <div className="space-y-2">
        {links.map((link, index) => (
          <Typography key={index} className="text-muted-foreground text-sm">
            {link.text}{" "}
            <Link href={link.href} className="link-primary font-semibold transition-colors hover:underline">
              {link.linkText}
            </Link>
          </Typography>
        ))}
      </div>
    </div>
  );
}
