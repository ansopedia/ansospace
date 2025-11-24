import { AuthFlowFooter } from "@/components/auth/AuthFlowFooter";

export function VerificationFooter() {
  return (
    <AuthFlowFooter
      links={[
        {
          text: "Wrong email address?",
          linkText: "Update in Signup",
          href: "/signup",
        },
        {
          text: "Already verified?",
          linkText: "Login here",
          href: "/login",
        },
      ]}
    />
  );
}
