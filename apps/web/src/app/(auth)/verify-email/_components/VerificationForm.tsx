import { NotificationType } from "@ansospace/types";
import { Card } from "@ansospace/ui/components";

import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";

interface VerificationFormProps {
  userEmail: string;
  isOtpSent: boolean;
  onOtpSent: () => void;
  onSuccess: () => void;
}

export function VerificationForm({ userEmail, isOtpSent, onOtpSent, onSuccess }: VerificationFormProps) {
  return (
    <Card className="border-border/50 bg-card/95 hover:shadow-3xl shadow-2xl backdrop-blur-sm transition-all">
      <div className="p-6 sm:p-8">
        <VerifyOtpForm
          email={userEmail}
          onSuccess={onSuccess}
          otpType={NotificationType.EMAIL_VERIFICATION_OTP}
          isOtpSent={isOtpSent}
          onOtpSent={onOtpSent}
        />
      </div>
    </Card>
  );
}
