import { AuthFlowIllustration } from "@/components/auth/AuthFlowIllustration";
import { AuthFlowLayout } from "@/components/auth/AuthFlowLayout";

import { PasswordResetFlow } from "./PasswordResetFlow";
import { PasswordResetFooter } from "./PasswordResetFooter";

export default function ForgotPasswordPage() {
  return (
    <AuthFlowLayout
      illustration={
        <AuthFlowIllustration src="/images/forgot-password-illustrator.svg" alt="Forgot password illustration" />
      }
    >
      <PasswordResetFlow />
      <PasswordResetFooter />
    </AuthFlowLayout>
  );
}
