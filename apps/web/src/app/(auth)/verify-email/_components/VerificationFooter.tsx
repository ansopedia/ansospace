import Link from "next/link";

import { Separator, Typography } from "@ansospace/ui/components";

export function VerificationFooter() {
  return (
    <div className="space-y-4 text-center">
      <Separator className="my-4" />
      <div className="space-y-2">
        <Typography className="text-muted-foreground text-sm">
          Wrong email address?{" "}
          <Link href="/signup" className="link-primary font-semibold transition-colors hover:underline">
            Update in Signup
          </Link>
        </Typography>
        <Typography className="text-muted-foreground text-xs">
          Already verified?{" "}
          <Link href="/login" className="link-primary font-semibold transition-colors hover:underline">
            Login here
          </Link>
        </Typography>
      </div>
    </div>
  );
}
