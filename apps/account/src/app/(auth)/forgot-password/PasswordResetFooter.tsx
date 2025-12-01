import { AuthFlowFooter } from "@/components/auth/AuthFlowFooter";

export function PasswordResetFooter() {
  return (
    <AuthFlowFooter
      links={[
        {
          text: "Remembered your password?",
          linkText: "Login",
          href: "/login",
        },
      ]}
    />
  );
}
