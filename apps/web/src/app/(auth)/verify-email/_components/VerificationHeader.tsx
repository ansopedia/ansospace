import { Separator, Typography } from "@ansospace/ui/components";
import { Mail, ShieldCheck } from "lucide-react";

interface VerificationHeaderProps {
  isOtpSent: boolean;
  userEmail: string;
}

export function VerificationHeader({ isOtpSent, userEmail }: VerificationHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center justify-center">
        <div className="from-primary/20 to-primary/10 relative rounded-2xl bg-gradient-to-br p-5 shadow-lg">
          <ShieldCheck className="text-primary h-12 w-12" strokeWidth={2} />
          <div className="bg-primary/20 absolute inset-0 animate-pulse rounded-2xl blur-xl" />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Typography variant="h1" className="text-foreground mb-2 text-3xl font-bold sm:text-4xl">
            Verify Your
            <span className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-transparent"> Email</span>
          </Typography>
          <Separator className="bg-primary/20 my-4 h-1 w-20 rounded-full" />
        </div>

        {isOtpSent ? (
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
            <Typography className="text-muted-foreground text-base">
              Secure your account by verifying your email address to continue.
            </Typography>
            <div className="bg-muted/50 rounded-xl p-4">
              <Typography className="text-foreground font-semibold break-all">{userEmail}</Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
