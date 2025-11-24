import { buttonVariants } from "@ansospace/ui/components/button";

import { Google } from "../../../icons";
import { env } from "../../../lib/env";

export const SignInWithGoogle = () => {
  const googleAuthUrl = `${env.USER_SERVICE_URL}/api/v1/auth/google?redirectUrl=${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`;

  return (
    <a href={googleAuthUrl} className={buttonVariants({ variant: "outline", className: "w-full" })}>
      <Google />
      Sign in with Google
    </a>
  );
};
