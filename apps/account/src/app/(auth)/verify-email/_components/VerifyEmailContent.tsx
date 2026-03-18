"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { useUser } from "@ansospace/react";

import { AuthFlowLayout } from "@/components/auth/AuthFlowLayout";
import { RedirectAfterLogin } from "@/lib/constants";

import { LoadingState } from "./LoadingState";
import { SessionExpiredState } from "./SessionExpiredState";
import { VerificationFooter } from "./VerificationFooter";
import { VerificationForm } from "./VerificationForm";
import { VerificationHeader } from "./VerificationHeader";
import { VerificationIllustration } from "./VerificationIllustration";
import { VerifiedState } from "./VerifiedState";

// Constants for search params
const SEARCH_PARAMS = {
  FROM_SIGNUP: "from",
  REDIRECT_TO: "redirect",
} as const;

const PARAM_VALUES = {
  SIGNUP: "signup",
  LOGIN: "login",
} as const;

export function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();

  // Check if OTP is already sent (from signup or login)
  const fromParam = searchParams.get(SEARCH_PARAMS.FROM_SIGNUP);
  const fromSignup = fromParam === PARAM_VALUES.SIGNUP;
  const customRedirect = searchParams.get(SEARCH_PARAMS.REDIRECT_TO);

  const [isOtpSent, setIsOtpSent] = useState(fromSignup);

  // Determine redirect destination based on user journey
  const getRedirectPath = useCallback(() => {
    // Priority 1: Custom redirect path (if provided and valid)
    if (customRedirect && customRedirect.startsWith("/")) {
      return customRedirect;
    }

    // Priority 2: If user has userId (already logged in or auto-logged in), go to dashboard
    if (user?.id) {
      return RedirectAfterLogin;
    }

    // Priority 3: If coming from signup flow, auto-login will happen, so go to dashboard
    if (fromSignup) {
      return RedirectAfterLogin;
    }

    // Default fallback: redirect to login
    return "/login";
  }, [customRedirect, fromSignup, user?.id]);

  // Handle successful OTP verification
  const handleVerificationSuccess = useCallback(() => {
    const redirectPath = getRedirectPath();

    // Small delay to allow auto-login to complete
    setTimeout(() => {
      router.replace(redirectPath);
    }, 500);
  }, [getRedirectPath, router]);

  // Handle different states
  if (!isLoaded) {
    return <LoadingState />;
  }

  if (user?.isEmailVerified) {
    return <VerifiedState isVerified={user?.isEmailVerified} />;
  }

  if (!user?.email) {
    return <SessionExpiredState />;
  }

  // Main Verification State
  return (
    <AuthFlowLayout illustration={<VerificationIllustration />}>
      <VerificationHeader isOtpSent={isOtpSent} userEmail={user?.email} />
      <VerificationForm
        isOtpSent={isOtpSent}
        onOtpSent={() => setIsOtpSent(true)}
        onSuccess={handleVerificationSuccess}
      />
      <VerificationFooter />
    </AuthFlowLayout>
  );
}
