import Link from "next/link";

import { Badge, Button, Typography } from "@ansospace/ui/components";
import { AlertCircle, ArrowRight } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";

export function SessionExpiredState() {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center space-y-8 py-12 text-center">
        <div className="bg-destructive/10 rounded-full p-8 shadow-lg">
          <AlertCircle className="text-destructive h-20 w-20" strokeWidth={2} />
        </div>

        <div className="space-y-3">
          <Badge
            variant="outline"
            className="border-destructive/30 bg-destructive/10 text-destructive mb-2 px-4 py-1.5"
          >
            Session Expired
          </Badge>
          <Typography variant="h3" className="text-foreground font-semibold">
            Verification Required
          </Typography>
          <Typography className="text-muted-foreground max-w-md">
            It looks like the verification process was not initiated or your session has expired. Please start again.
          </Typography>
        </div>

        <div className="w-full space-y-3 pt-2">
          <Link href="/signup" className="block">
            <Button className="group w-full rounded-xl shadow-md transition-all hover:shadow-lg" size="lg">
              Go to Sign Up
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/login" className="block">
            <Button variant="outline" className="w-full rounded-xl" size="lg">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
