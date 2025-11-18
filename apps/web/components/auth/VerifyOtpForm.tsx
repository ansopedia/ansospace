"use client";

import { useOtp } from "@ansospace/auth/client";
import { NotificationType, OtpVerifyEvent, otpSchema } from "@ansospace/types";
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
  token: string;
  otpType: NotificationType;
  onTokenUpdate: (actionToken: string) => void;
  onSuccess: (data: { actionToken: string }) => void;
}

const REGEXP_ONLY_DIGITS: RegExp = /^\d+$/;

export const VerifyOtpForm = ({ email, token, onTokenUpdate, otpType, onSuccess }: VerifyEmailFormProps) => {
  const { verifyOtp, verifyOtpLoading, sendOtp, sendOtpLoading } = useOtp();

  const form = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: VerifyEmailSchema) => {
    const otpBody: OtpVerifyEvent = {
      otp: data.otp,
      otpType,
      token: token,
    };

    try {
      const response = await verifyOtp(otpBody);
      if (response.status === "success") {
        toast.success(response.message);
        // Auto-login happens inside verifyOtp hook; redirect to dashboard
        onSuccess(response.data);
        // setTimeout(() => {
        //   router.replace("/dashboard");
        // }, 1000);
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
        onTokenUpdate(response.data.token);
        toast.success("New OTP sent to your email");
        form.reset();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-6">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex justify-center">
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
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="rounded-2xl" disabled={verifyOtpLoading || !form.watch("otp")}>
          {verifyOtpLoading && <Spinner />}
          {verifyOtpLoading ? "Verifying..." : "Verify OTP"}
        </Button>

        <div className="text-center">
          <Typography className="text-muted-foreground text-sm">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={sendOtpLoading}
              className="link-primary disabled:opacity-50"
            >
              {sendOtpLoading ? "Sending..." : "Resend OTP"}
            </button>
          </Typography>
        </div>
      </form>
    </Form>
  );
};
