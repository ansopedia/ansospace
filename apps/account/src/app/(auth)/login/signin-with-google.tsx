import { buttonVariants } from "@ansospace/ui/components/button";

import { RedirectAfterLogin } from "@/lib/constants";
import { env } from "@/lib/env";
import { Google } from "@/src/icons/google";

export const SignInWithGoogle = () => {
  const googleAuthUrl = `${env.USER_SERVICE_URL}/api/v1/auth/google?redirectUrl=${RedirectAfterLogin}`;

  return (
    <a href={googleAuthUrl} className={buttonVariants({ variant: "outline", className: "w-full" })}>
      <Google />
      Sign in with Google
    </a>
  );
};
