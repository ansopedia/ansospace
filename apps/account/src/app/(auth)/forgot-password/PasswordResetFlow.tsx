"use client";

import { useState } from "react";

import { Email, NotificationType } from "@ansospace/types";
import { KeyRound, Lock, Mail } from "lucide-react";

import { AuthFlowCard } from "@/components/auth/AuthFlowCard";
import { AuthFlowHeader } from "@/components/auth/AuthFlowHeader";
import { AuthFlowSuccessState } from "@/components/auth/AuthFlowSuccessState";
import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";

import { PasswordResetEmailForm } from "./PasswordResetEmailForm";
import { PasswordResetNewPasswordForm } from "./PasswordResetNewPasswordForm";

export const PasswordResetFlow = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset" | "success">("email");
  const [email, setEmail] = useState<Email>();
  const [token, setToken] = useState<string | null>(null);
  const [actionToken, setActionToken] = useState<string | null>(null);

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
            onSuccess={({ token, email }) => {
              setToken(token);
              setEmail(email);
              setStep("otp");
            }}
          />
        </AuthFlowCard>
      </>
    );
  }

  // OTP Verification Step
  if (step === "otp" && token && email) {
    return (
      <>
        <AuthFlowHeader
          icon={Mail}
          title="Verify"
          highlightedText="Code"
          description={`We've sent a 6-digit code to ${email}`}
        />
        <AuthFlowCard>
          <VerifyOtpForm
            email={email}
            onSuccess={({ actionToken }) => {
              setStep("reset");
              setActionToken(actionToken);
            }}
            otpType={NotificationType.FORGET_PASSWORD_OTP}
            isOtpSent={true}
            onOtpSent={() => {}}
          />
        </AuthFlowCard>
      </>
    );
  }

  // New Password Step
  if (step === "reset" && actionToken) {
    return (
      <>
        <AuthFlowHeader icon={Lock} title="Reset" highlightedText="Password" description="Enter your new password" />
        <AuthFlowCard>
          <PasswordResetNewPasswordForm
            actionToken={actionToken}
            onSuccess={() => {
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
