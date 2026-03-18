"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useLogin } from "@ansospace/react";
import type { LoginRequest } from "@ansospace/types";
import { loginRequestSchema } from "@ansospace/types";
import { Button, Checkbox, FieldGroup, Spinner, toast } from "@ansospace/ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthFields } from "@/components/auth/AuthFields";
import { RedirectAfterLogin } from "@/lib/constants";
import { AUTH_FORM_FIELDS } from "@/src/constants/auth-fields";

export const LoginForm = () => {
  const router = useRouter();

  const { mutateAsync: login, isPending: loading } = useLogin();

  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (body: LoginRequest) => {
    const response = await login(body);
    if (response.status === "success") {
      toast.success("Welcome back!");
      router.replace(RedirectAfterLogin);
    } else {
      // Handle logical errors (like unverified email) returned by API
      if (response.code === "email_not_verified") {
        toast.warning("Please verify your email.");
        setTimeout(() => router.push("/verify-email?from=login"), 1000);
      } else {
        toast.error(response.message || "Login failed");
      }
    }
  };

  const LOGIN_FIELDS = AUTH_FORM_FIELDS.filter((f) => ["email", "password"].includes(f.name));

  return (
    // <Form {...form}>
    <form className="mt-10 flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <AuthFields form={form} fields={LOGIN_FIELDS} loading={loading} />
      </FieldGroup>

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
    // </Form>
  );
};
