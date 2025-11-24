"use client";

import { usePasswordReset } from "@ansospace/auth/client";
import { NotificationType, emailSchema } from "@ansospace/types";
import { Button, Form, Spinner, toast } from "@ansospace/ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { AuthFields } from "@/components/auth/AuthFields";
import { AUTH_FORM_FIELDS } from "@/src/constants/auth-fields";

const schema = z.object({ email: emailSchema });
type Values = z.infer<typeof schema>;

const FORGOT_PASSWORD_FIELDS = AUTH_FORM_FIELDS.filter((f) => ["email"].includes(f.name));

export function PasswordResetEmailForm({ onSuccess }: { onSuccess: (data: { token: string; email: string }) => void }) {
  const { sendPasswordResetOtp, sendLoading } = usePasswordReset();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(async ({ email }) => {
    const resp = await sendPasswordResetOtp({ otpType: NotificationType.FORGET_PASSWORD_OTP, email });
    if (resp.status === "success" && resp.data?.token) {
      toast.success("OTP sent to your email");
      onSuccess({ token: resp.data.token, email });
    } else {
      toast.error(resp.message);
    }
  });

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <AuthFields form={form} fields={FORGOT_PASSWORD_FIELDS} loading={sendLoading} />
        <Button type="submit" className="w-full rounded-xl" size="lg" disabled={sendLoading}>
          {sendLoading && <Spinner />}
          {sendLoading ? "Sending Code..." : "Send Verification Code"}
        </Button>
      </form>
    </Form>
  );
}
