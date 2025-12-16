import { AuthFlowSuccessState } from "@/components/auth/AuthFlowSuccessState";
import { RedirectAfterLogin } from "@/lib/constants";

interface VerifiedStateProps {
  isVerified: boolean;
}

export function VerifiedState({ isVerified }: VerifiedStateProps) {
  if (!isVerified) return null;

  return (
    <AuthFlowSuccessState
      title="Email Verified!"
      description="Your email has been successfully verified. You're all set to explore your dashboard."
      redirectPath={RedirectAfterLogin}
      redirectLabel="Continue to Dashboard"
      autoRedirect={true}
      countdownSeconds={3}
    />
  );
}
