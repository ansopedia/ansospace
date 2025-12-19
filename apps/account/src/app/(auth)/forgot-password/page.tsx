import { AuthFlowFooter } from "@/components/auth/AuthFlowFooter";
import { AuthFlowIllustration } from "@/components/auth/AuthFlowIllustration";
import { AuthFlowLayout } from "@/components/auth/AuthFlowLayout";

import { PasswordResetFlow } from "./PasswordResetFlow";

export default function ForgotPasswordPage() {
  return (
    <AuthFlowLayout
      illustration={
        <AuthFlowIllustration src="/images/forgot-password-illustrator.svg" alt="Forgot password illustration" />
      }
    >
      <PasswordResetFlow />
      <AuthFlowFooter
        links={[
          {
            text: "Remembered your password?",
            linkText: "Login",
            href: "/login",
          },
        ]}
      />
    </AuthFlowLayout>
  );
}
