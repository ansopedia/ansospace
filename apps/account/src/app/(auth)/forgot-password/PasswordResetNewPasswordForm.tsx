"use client";

import { usePasswordActions } from "@ansospace/react";
import { ResetPasswordRequest, resetPasswordRequestSchema } from "@ansospace/types";
import { Button, Form, Spinner, toast } from "@ansospace/ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthFields } from "@/components/auth/AuthFields";
import { AUTH_FORM_FIELDS } from "@/src/constants/auth-fields";

const RESET_PASSWORD_FIELDS = AUTH_FORM_FIELDS.filter((f) => ["password", "confirmPassword"].includes(f.name));

interface PasswordResetNewPasswordFormProps {
  onSuccess: () => void;
}
export function PasswordResetNewPasswordForm({ onSuccess }: PasswordResetNewPasswordFormProps) {
  const { mutateAsync, isPending } = usePasswordActions();

  const form = useForm({
    resolver: zodResolver(resetPasswordRequestSchema.pick({ password: true, confirmPassword: true })),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async ({ password, confirmPassword }: Omit<ResetPasswordRequest, "actionToken">) => {
    const resp = await mutateAsync({ password, confirmPassword });

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
        <AuthFields form={form} fields={RESET_PASSWORD_FIELDS} loading={isPending} />

        <Button type="submit" className="w-full rounded-xl" size="lg" disabled={isPending}>
          {isPending && <Spinner />}
          {isPending ? "Resetting Password..." : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
}
