"use client";

import { useRouter } from "next/navigation";

import { useRegister } from "@ansospace/auth/client";
import { RegisterSchema, registerSchema } from "@ansospace/types";
import { Button, Form, Spinner, toast } from "@ansospace/ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthFields } from "@/components/auth/AuthFields";
import { SIGNUP_FORM_FIELDS } from "@/constants/auth-fields";

export const RegisterForm = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { loading, register: handleRegister } = useRegister();

  const onSubmit = async (body: RegisterSchema) => {
    const response = await handleRegister(body);
    if (response.status === "success") {
      toast.success("Account created successfully!");
      router.replace("/dashboard");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-6">
        <AuthFields form={form} fields={SIGNUP_FORM_FIELDS} loading={loading} />
        <Button type="submit" className="rounded-2xl" disabled={loading}>
          {loading && <Spinner />}
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
};
