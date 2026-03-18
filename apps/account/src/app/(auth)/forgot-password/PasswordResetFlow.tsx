"use client";

import { useEffect, useState } from "react";

import { useStorage, useUser } from "@ansospace/react";
import { otpEvents } from "@ansospace/types";
import { KeyRound, Lock, Mail } from "lucide-react";

import { AuthFlowCard } from "@/components/auth/AuthFlowCard";
import { AuthFlowHeader } from "@/components/auth/AuthFlowHeader";
import { AuthFlowSuccessState } from "@/components/auth/AuthFlowSuccessState";
import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";

import { PasswordResetEmailForm } from "./PasswordResetEmailForm";
import { PasswordResetNewPasswordForm } from "./PasswordResetNewPasswordForm";

export const PasswordResetFlow = () => {
  const storage = useStorage();
  const [step, setStep] = useState<"email" | "otp" | "reset" | "success">("email");
  const { user } = useUser();

  useEffect(() => {
    (async () => {
      const step = await storage.get("passwordResetStep");
      setStep((step as "email" | "otp" | "reset" | "success") || "email");
    })();
  }, [storage]);

  // Email Step
  if (step === "email") {
    return (
      <>
        <AuthFlowHeader
          icon={KeyRound}
          title="Forgot"
          highlightedText="Password"
          description="Enter your email to receive a verification code"
        />
        <AuthFlowCard>
          <PasswordResetEmailForm
            onSuccess={async () => {
              setStep("otp");
              await storage.set("passwordResetStep", "otp");
            }}
          />
        </AuthFlowCard>
      </>
    );
  }

  // OTP Verification Step
  if (step === "otp") {
    return (
      <>
        <AuthFlowHeader
          icon={Mail}
          title="Verify"
          highlightedText="Code"
          description={`We've sent a 6-digit code to ${user?.email}`}
        />
        <AuthFlowCard>
          <VerifyOtpForm
            onSuccess={async () => {
              setStep("reset");
              await storage.set("passwordResetStep", "reset");
            }}
            eventType={otpEvents.enum.FORGET_PASSWORD}
            isOtpSent={true}
          />
        </AuthFlowCard>
      </>
    );
  }

  // New Password Step
  if (step === "reset") {
    return (
      <>
        <AuthFlowHeader icon={Lock} title="Reset" highlightedText="Password" description="Enter your new password" />
        <AuthFlowCard>
          <PasswordResetNewPasswordForm
            onSuccess={async () => {
              await storage.remove("passwordResetStep");
              setStep("success");
            }}
          />
        </AuthFlowCard>
      </>
    );
  }

  // Success Step
  if (step === "success") {
    return (
      <AuthFlowSuccessState
        title="Password Reset!"
        description="Your password has been successfully reset. You can now login with your new password."
        redirectPath="/login"
        redirectLabel="Continue to Login"
        autoRedirect={true}
        countdownSeconds={3}
      />
    );
  }

  return null;
};
