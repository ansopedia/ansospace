"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useLogin } from "@ansospace/react";
import type { Login } from "@ansospace/types";
import { loginSchema } from "@ansospace/types";
import { Button, Checkbox, Form, Spinner, toast } from "@ansospace/ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthFields } from "@/components/auth/AuthFields";
import { AUTH_FORM_FIELDS } from "@/src/constants/auth-fields";

export const LoginForm = () => {
  const router = useRouter();
  const { login, loading } = useLogin();
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "sanjaykumar.sah+1@zuru.com",
      password: "Superusername@123",
    },
  });

  const onSubmit = async (body: Login) => {
    const response = await login(body);
    if (response.status === "success") {
      router.replace("/dashboard");
    } else {
      if (response.code === "email_not_verified") {
        setTimeout(() => router.push("/verify-email?from=login"), 1000);
      }
      toast.error(response.message);
    }
  };

  // Reuse only email + password
  const LOGIN_FIELDS = AUTH_FORM_FIELDS.filter((f) => ["email", "password"].includes(f.name));

  return (
    <Form {...form}>
      <form className="mt-10 flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <AuthFields form={form} fields={LOGIN_FIELDS} loading={loading} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              disabled={loading}
            />
            <label
              htmlFor="remember"
              className="text-muted-foreground cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
            >
              Remember me
            </label>
          </div>
          <Link href="/forgot-password" className="link-primary">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Spinner />}
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};
