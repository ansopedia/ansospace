import { NotificationType } from "@ansospace/types";

import { AuthFlowCard } from "@/components/auth/AuthFlowCard";
import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";

interface VerificationFormProps {
  isOtpSent: boolean;
  onOtpSent: () => void;
  onSuccess: () => void;
}

export function VerificationForm({ isOtpSent, onOtpSent, onSuccess }: VerificationFormProps) {
  return (
    <AuthFlowCard>
      <VerifyOtpForm
        onSuccess={onSuccess}
        otpType={NotificationType.EMAIL_VERIFICATION_OTP}
        isOtpSent={isOtpSent}
        onOtpSent={onOtpSent}
      />
    </AuthFlowCard>
  );
}
