import type { ReactNode } from "react";

import { Separator, Typography } from "@ansospace/ui/components";
import type { LucideIcon } from "lucide-react";

interface AuthFlowHeaderProps {
  icon: LucideIcon;
  title: string;
  highlightedText?: string;
  description?: string;
  additionalContent?: ReactNode;
}

export function AuthFlowHeader({
  icon: Icon,
  title,
  highlightedText,
  description,
  additionalContent,
}: AuthFlowHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center justify-center">
        <div className="from-primary/20 to-primary/10 relative rounded-2xl bg-linear-to-br p-5 shadow-lg">
          <Icon className="text-primary h-12 w-12" strokeWidth={2} />
          <div className="bg-primary/20 absolute inset-0 animate-pulse rounded-2xl blur-xl" />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Typography variant="h1" className="text-foreground mb-2 text-3xl font-bold sm:text-4xl">
            {title}
            {highlightedText && (
              <span className="from-primary to-primary/70 bg-linear-to-r bg-clip-text text-transparent">
                {" "}
                {highlightedText}
              </span>
            )}
          </Typography>
          <Separator className="bg-primary/20 my-4 h-1 w-20 rounded-full" />
        </div>

        {description && <Typography className="text-muted-foreground text-base">{description}</Typography>}

        {additionalContent}
      </div>
    </div>
  );
}
