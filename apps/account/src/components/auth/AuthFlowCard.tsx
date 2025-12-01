import type { ReactNode } from "react";

import { Card } from "@ansospace/ui/components";

interface AuthFlowCardProps {
  children: ReactNode;
}

export function AuthFlowCard({ children }: AuthFlowCardProps) {
  return (
    <Card className="border-border/50 bg-card/95 hover:shadow-3xl shadow-2xl backdrop-blur-sm transition-all">
      <div className="p-6 sm:p-8">{children}</div>
    </Card>
  );
}
