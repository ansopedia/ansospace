import { otpEvents } from "@ansospace/types";

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
        eventType={otpEvents.enum.EMAIL_VERIFICATION}
        isOtpSent={isOtpSent}
        onOtpSent={onOtpSent}
      />
    </AuthFlowCard>
  );
}
