import { Typography } from "@ansospace/ui/components";
import { Mail, ShieldCheck } from "lucide-react";

import { AuthFlowHeader } from "@/components/auth/AuthFlowHeader";

interface VerificationHeaderProps {
  isOtpSent: boolean;
  userEmail: string;
}

export function VerificationHeader({ isOtpSent, userEmail }: VerificationHeaderProps) {
  const additionalContent = isOtpSent ? (
    <div className="space-y-2">
      <div className="text-muted-foreground flex items-center gap-2">
        <div className="bg-primary/10 rounded-full p-2">
          <Mail className="text-primary h-4 w-4" />
        </div>
        <Typography className="text-sm font-medium">We&apos;ve sent a 6-digit code to:</Typography>
      </div>
      <div className="bg-muted/50 rounded-xl p-4">
        <Typography className="text-foreground font-semibold break-all">{userEmail}</Typography>
      </div>
    </div>
  ) : (
    <div className="space-y-2">
      <div className="bg-muted/50 rounded-xl p-4">
        <Typography className="text-foreground font-semibold break-all">{userEmail}</Typography>
      </div>
    </div>
  );

  return (
    <AuthFlowHeader
      icon={ShieldCheck}
      title="Verify Your"
      highlightedText="Email"
      description={!isOtpSent ? "Secure your account by verifying your email address to continue." : undefined}
      additionalContent={additionalContent}
    />
  );
}
