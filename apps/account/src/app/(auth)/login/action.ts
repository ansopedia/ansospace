"use server";

import { redirect } from "next/navigation";

import { RedirectAfterLogin } from "@/lib/constants";
import { env } from "@/lib/env";

export const signInWithGoogle = async () => {
  const googleAuthUrl = `${env.USER_SERVICE_URL}/api/v1/auth/google?redirectUrl=${RedirectAfterLogin}`;

  return redirect(googleAuthUrl);
};
