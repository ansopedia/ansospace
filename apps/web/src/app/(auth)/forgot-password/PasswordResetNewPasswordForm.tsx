"use client";

import { usePasswordReset } from "@ansospace/react";
import { ResetPasswordRequest, resetPasswordRequestSchema } from "@ansospace/types";
import { Button, Form, Spinner, toast } from "@ansospace/ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthFields } from "@/components/auth/AuthFields";
import { AUTH_FORM_FIELDS } from "@/src/constants/auth-fields";

const RESET_PASSWORD_FIELDS = AUTH_FORM_FIELDS.filter((f) => ["password", "confirmPassword"].includes(f.name));

export function PasswordResetNewPasswordForm({
  actionToken,
  onSuccess,
}: {
  actionToken: string;
  onSuccess: () => void;
}) {
  const { resetPassword, resetLoading } = usePasswordReset();

  const form = useForm({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: { password: "", confirmPassword: "", actionToken: "" },
  });

  const onSubmit = async ({ password, confirmPassword }: Omit<ResetPasswordRequest, "actionToken">) => {
    const resp = await resetPassword({ actionToken, password, confirmPassword });
    if (resp.status === "success") {
      toast.success("Password reset successful. Please login");
      onSuccess();
    } else {
      toast.error(resp.message);
    }
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <AuthFields form={form} fields={RESET_PASSWORD_FIELDS} loading={resetLoading} />

        <Button type="submit" className="w-full rounded-xl" size="lg" disabled={resetLoading}>
          {resetLoading && <Spinner />}
          {resetLoading ? "Resetting Password..." : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
}
