import { NotificationType } from "@ansospace/types";

import { AuthFlowCard } from "@/components/auth/AuthFlowCard";
import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";

interface VerificationFormProps {
  userEmail: string;
  isOtpSent: boolean;
  onOtpSent: () => void;
  onSuccess: () => void;
}

export function VerificationForm({ userEmail, isOtpSent, onOtpSent, onSuccess }: VerificationFormProps) {
  return (
    <AuthFlowCard>
      <VerifyOtpForm
        email={userEmail}
        onSuccess={onSuccess}
        otpType={NotificationType.EMAIL_VERIFICATION_OTP}
        isOtpSent={isOtpSent}
        onOtpSent={onOtpSent}
      />
    </AuthFlowCard>
  );
}
