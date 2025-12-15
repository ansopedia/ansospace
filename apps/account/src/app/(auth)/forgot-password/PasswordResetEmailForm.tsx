"use client";

import { useOtp } from "@ansospace/react";
import { Email, NotificationType, emailSchema } from "@ansospace/types";
import { Button, Form, Spinner, toast } from "@ansospace/ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { AuthFields } from "@/components/auth/AuthFields";
import { AUTH_FORM_FIELDS } from "@/src/constants/auth-fields";

const schema = z.object({ email: emailSchema });

const FORGOT_PASSWORD_FIELDS = AUTH_FORM_FIELDS.filter((f) => ["email"].includes(f.name));

interface PasswordResetEmailFormProps {
  onSuccess: (data: { email: Email }) => void;
}

export function PasswordResetEmailForm({ onSuccess }: PasswordResetEmailFormProps) {
  const {
    sendMutation: { mutateAsync, isPending },
  } = useOtp();
  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(async ({ email }) => {
    const resp = await mutateAsync({ otpType: NotificationType.FORGET_PASSWORD_OTP, email });
    if (resp.status === "success" && resp.data?.actionToken) {
      toast.success("OTP sent to your email");
      onSuccess({ email });
    } else {
      toast.error(resp.message);
    }
  });

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <AuthFields form={form} fields={FORGOT_PASSWORD_FIELDS} loading={isPending} />
        <Button type="submit" className="w-full rounded-xl" size="lg" disabled={isPending}>
          {isPending && <Spinner />}
          {isPending ? "Sending Code..." : "Send Verification Code"}
        </Button>
      </form>
    </Form>
  );
}
