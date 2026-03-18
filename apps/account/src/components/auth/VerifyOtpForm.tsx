"use client";

import { FC } from "react";

import { useOtpActions, useUser } from "@ansospace/react";
import { OtpEvents, otpSchema } from "@ansospace/types";
import {
  Button,
  Field,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Spinner,
  Typography,
  toast,
} from "@ansospace/ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const verifyEmailSchema = z.object({
  otp: otpSchema,
});

type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;

interface VerifyEmailFormProps {
  eventType: OtpEvents;
  onSuccess: () => void;
  isOtpSent: boolean;
  onOtpSent?: () => void;
}

const REGEXP_ONLY_DIGITS: RegExp = /^\d+$/;

export const VerifyOtpForm: FC<VerifyEmailFormProps> = ({ eventType, onSuccess, isOtpSent, onOtpSent }) => {
  const { sendOtp, verifyOtp, isPending } = useOtpActions();
  const { user } = useUser();

  const form = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      otp: "",
    },
  });

  const otpValue = useWatch({
    control: form.control,
    name: "otp",
  });

  const onSubmit = async (data: VerifyEmailSchema) => {
    const otpBody = {
      otp: data.otp,
      eventType,
    };

    try {
      const response = await verifyOtp(otpBody);
      if (response.status === "success") {
        toast.success(response.message);
        // Auto-login happens inside verifyOtp hook; redirect to dashboard
        onSuccess();
      } else {
        toast.error(response.message);
        form.reset();
      }
    } catch (error) {
      toast.error(`OTP verification failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      form.reset();
    }
  };

  const handleResendOtp = async () => {
    if (!user?.email) {
      toast.error("Email not found. Please try signing up again.");
      return;
    }

    try {
      const response = await sendOtp({ eventType, email: user?.email });
      if (response.status === "success" && response.data?.actionToken) {
        toast.success("OTP sent to your email");
        onOtpSent?.();
        form.reset();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(`Failed to send OTP: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  if (!isOtpSent) {
    return (
      <div className="flex flex-col gap-4">
        <Typography className="text-muted-foreground text-center text-sm">
          Please click the button below to receive a verification code.
        </Typography>
        <Button onClick={handleResendOtp} className="w-full rounded-xl" size="lg" disabled={isPending}>
          {isPending && <Spinner className="mr-2" />}
          {isPending ? "Sending Code..." : "Send Verification Code"}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-6">
      <Controller
        control={form.control}
        name="otp"
        render={({ field }) => (
          <Field>
            <div className="flex w-full justify-center py-2 sm:py-4">
              <InputOTP
                maxLength={6}
                {...field}
                onComplete={() => form.handleSubmit(onSubmit)()}
                pattern={REGEXP_ONLY_DIGITS.source}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </Field>
        )}
      />

      <Button type="submit" className="rounded-xl" size="lg" disabled={isPending || !otpValue}>
        {isPending && <Spinner className="mr-2" />}
        <span className="text-sm sm:text-base">{isPending ? "Verifying..." : "Verify Email"}</span>
      </Button>

      <div className="text-center">
        <Typography className="text-muted-foreground text-xs sm:text-sm">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isPending}
            className="link-primary font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Sending..." : "Resend OTP"}
          </button>
        </Typography>
      </div>
    </form>
  );
};
