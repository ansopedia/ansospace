import { AuthFlowSuccessState } from "@/components/auth/AuthFlowSuccessState";

interface VerifiedStateProps {
  isVerified: boolean;
}

export function VerifiedState({ isVerified }: VerifiedStateProps) {
  if (!isVerified) return null;

  return (
    <AuthFlowSuccessState
      title="Email Verified!"
      description="Your email has been successfully verified. You're all set to explore your dashboard."
      redirectPath="/dashboard"
      redirectLabel="Continue to Dashboard"
      autoRedirect={true}
      countdownSeconds={3}
    />
  );
}
