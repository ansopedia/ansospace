"use client";

import { FC } from "react";

import { useOtp } from "@ansospace/react";
import { NotificationType, otpSchema } from "@ansospace/types";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Spinner,
  Typography,
  toast,
} from "@ansospace/ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const verifyEmailSchema = z.object({
  otp: otpSchema,
});

type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;

interface VerifyEmailFormProps {
  email: string;
  otpType: NotificationType;
  onSuccess: (data: { actionToken: string }) => void;
  isOtpSent: boolean;
  onOtpSent: () => void;
}

const REGEXP_ONLY_DIGITS: RegExp = /^\d+$/;

export const VerifyOtpForm: FC<VerifyEmailFormProps> = ({ email, otpType, onSuccess, isOtpSent, onOtpSent }) => {
  const { verifyOtp, verifyOtpLoading, sendOtp, sendOtpLoading } = useOtp();

  const form = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: VerifyEmailSchema) => {
    const otpBody = {
      otp: data.otp,
      otpType,
    };

    try {
      const response = await verifyOtp(otpBody);
      if (response.status === "success") {
        toast.success(response.message);
        // Auto-login happens inside verifyOtp hook; redirect to dashboard
        onSuccess(response.data);
      } else {
        toast.error(response.message);
        form.reset();
      }
    } catch (error) {
      toast.error("OTP verification failed");
      form.reset();
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not found. Please try signing up again.");
      return;
    }

    try {
      const response = await sendOtp({ otpType: NotificationType.EMAIL_VERIFICATION_OTP, email });
      if (response.status === "success" && response.data?.token) {
        toast.success("OTP sent to your email");
        onOtpSent();
        form.reset();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    }
  };

  if (!isOtpSent) {
    return (
      <div className="flex flex-col gap-4">
        <Typography className="text-muted-foreground text-center text-sm">
          Please click the button below to receive a verification code.
        </Typography>
        <Button onClick={handleResendOtp} className="w-full rounded-xl" size="lg" disabled={sendOtpLoading}>
          {sendOtpLoading && <Spinner className="mr-2" />}
          {sendOtpLoading ? "Sending Code..." : "Send Verification Code"}
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-6">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormControl>
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
              </FormControl>
              <FormMessage className="text-center text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        <Button type="submit" className="rounded-xl" size="lg" disabled={verifyOtpLoading || !form.watch("otp")}>
          {verifyOtpLoading && <Spinner className="mr-2" />}
          <span className="text-sm sm:text-base">{verifyOtpLoading ? "Verifying..." : "Verify Email"}</span>
        </Button>

        <div className="text-center">
          <Typography className="text-muted-foreground text-xs sm:text-sm">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={sendOtpLoading}
              className="link-primary font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sendOtpLoading ? "Sending..." : "Resend OTP"}
            </button>
          </Typography>
        </div>
      </form>
    </Form>
  );
};
