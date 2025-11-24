import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge, Button, Typography } from "@ansospace/ui/components";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

import { AuthLayout } from "./AuthLayout";

interface AuthFlowSuccessStateProps {
  title: string;
  description: string;
  redirectPath: string;
  redirectLabel: string;
  autoRedirect?: boolean;
  countdownSeconds?: number;
}

export function AuthFlowSuccessState({
  title,
  description,
  redirectPath,
  redirectLabel,
  autoRedirect = true,
  countdownSeconds = 3,
}: AuthFlowSuccessStateProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(countdownSeconds);

  useEffect(() => {
    if (autoRedirect) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            router.replace(redirectPath);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [autoRedirect, redirectPath, router]);

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center space-y-8 py-12 text-center">
        <div className="relative">
          <div className="bg-primary/20 absolute inset-0 animate-pulse rounded-full blur-2xl" />
          <div className="from-primary/20 to-primary/10 relative rounded-full bg-gradient-to-br p-8 shadow-lg">
            <CheckCircle2 className="text-primary h-20 w-20 drop-shadow-lg" strokeWidth={2} />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="text-primary h-8 w-8 animate-pulse" />
          </div>
        </div>

        <div className="space-y-3">
          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary mb-2 px-4 py-1.5">
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
            Success
          </Badge>
          <Typography variant="h2" className="text-foreground font-bold">
            {title}
          </Typography>
          <Typography className="text-muted-foreground max-w-sm text-base">{description}</Typography>
        </div>

        <div className="bg-muted/50 rounded-2xl p-6">
          {autoRedirect && (
            <div className="mb-4 flex items-center justify-center gap-2">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <Typography className="text-primary text-xl font-bold">{countdown}</Typography>
              </div>
              <Typography className="text-muted-foreground text-sm">
                Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
              </Typography>
            </div>
          )}

          <Button
            onClick={() => router.replace(redirectPath)}
            className="group w-full rounded-xl shadow-md transition-all hover:shadow-lg"
            size="lg"
          >
            {redirectLabel}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
