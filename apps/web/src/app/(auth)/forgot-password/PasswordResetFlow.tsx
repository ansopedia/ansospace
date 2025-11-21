"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { NotificationType } from "@ansospace/types";

import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";

import { PasswordResetEmailForm } from "./PasswordResetEmailForm";
import { PasswordResetNewPasswordForm } from "./PasswordResetNewPasswordForm";

export const PasswordResetFlow = () => {
  const router = useRouter();

  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [actionToken, setActionToken] = useState<string | null>(null);

  return (
    <div className="mt-10 flex flex-col gap-6">
      {step === "email" && (
        <PasswordResetEmailForm
          onSuccess={({ token, email }) => {
            setToken(token);
            setEmail(email);
            setStep("otp");
          }}
        />
      )}
      {step === "otp" && token && (
        <VerifyOtpForm
          email={email}
          onSuccess={({ actionToken }) => {
            setStep("reset");
            setActionToken(actionToken);
          }}
          otpType={NotificationType.FORGET_PASSWORD_OTP}
          isOtpSent={false}
          onOtpSent={() => {}}
        />
      )}
      {step === "reset" && actionToken && (
        <PasswordResetNewPasswordForm
          actionToken={actionToken}
          onSuccess={() => {
            setEmail("");
            setToken(null);
            setActionToken(null);
            router.replace("/login");
          }}
        />
      )}
    </div>
  );
};
