import { Spinner, Typography } from "@ansospace/ui/components";

import { AuthLayout } from "@/components/auth/AuthLayout";

export function LoadingState() {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
        <div className="relative">
          <div className="bg-primary/20 absolute inset-0 animate-ping rounded-full" />
          <div className="bg-primary/10 relative rounded-full p-8">
            <Spinner className="border-primary h-12 w-12 border-4" />
          </div>
        </div>
        <div className="space-y-3">
          <Typography variant="h3" className="text-foreground font-semibold">
            Preparing Verification
          </Typography>
          <Typography className="text-muted-foreground text-sm">
            Please wait while we set things up for you...
          </Typography>
        </div>
      </div>
    </AuthLayout>
  );
}
