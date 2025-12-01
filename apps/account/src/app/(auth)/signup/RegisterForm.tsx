"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";

import { useRegister } from "@ansospace/react";
import { RegisterRequest, registerRequestSchema } from "@ansospace/types";
import { Button, Form, Spinner, toast } from "@ansospace/ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthFields } from "@/components/auth/AuthFields";
import { AUTH_FORM_FIELDS } from "@/src/constants/auth-fields";

export const RegisterForm: FC = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registerRequestSchema),
    mode: "onTouched",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { loading, register: handleRegister } = useRegister();

  const onSubmit = async (body: RegisterRequest) => {
    const response = await handleRegister(body);
    if (response.status === "success") {
      toast.success(response.message);
      setTimeout(() => router.push("/verify-email?from=signup"), 1000);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-6">
        <AuthFields form={form} fields={AUTH_FORM_FIELDS} loading={loading} />
        <Button type="submit" className="rounded-2xl" disabled={loading}>
          {loading && <Spinner />}
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
};
