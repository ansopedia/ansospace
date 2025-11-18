"use client";

import { usePasswordReset } from "@ansospace/auth/client";
import { ResetPassword, resetPasswordSchema } from "@ansospace/types";
import { Button, Form, Spinner, toast } from "@ansospace/ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthFields } from "@/components/auth/AuthFields";
import { AUTH_FORM_FIELDS } from "@/constants/auth-fields";

const RESET_PASSWORD_FIELDS = AUTH_FORM_FIELDS.filter((f) => ["password", "confirmPassword"].includes(f.name));

export function PasswordResetNewPasswordForm({ actionToken, onSuccess }: { actionToken: string; onSuccess: () => void }) {
  const { resetPassword, resetLoading } = usePasswordReset();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "", token: "" },
  });

  const onSubmit = async ({ password, confirmPassword }: Omit<ResetPassword, "token">) => {
    const resp = await resetPassword({ token: actionToken, password, confirmPassword });
    if (resp.status === "success") {
      toast.success("Password reset successful. Please login");
      onSuccess();
    } else {
      toast.error(resp.message);
    }
  };

  return (
    <Form {...form}>
      <form className="mt-10 flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <AuthFields form={form} fields={RESET_PASSWORD_FIELDS} loading={resetLoading} />

        <Button type="submit" className="rounded-2xl" disabled={resetLoading} onSubmit={console.log}>
          {resetLoading && <Spinner />}
          {resetLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
}
