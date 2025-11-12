"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useLogin } from "@ansospace/auth/client";
import type { Login } from "@ansospace/types";
import { loginSchema } from "@ansospace/types";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Spinner,
  toast,
} from "@ansospace/ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";

export const LoginForm = () => {
  const router = useRouter();
  const { login, loading } = useLogin();

  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (body: Login) => {
    const response = await login(body);
    if (response.status === "success") {
      router.replace("/dashboard");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <Form {...form}>
      <form className="mt-10 flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input type="email" placeholder="Enter your email" className="pl-10" {...field} disabled={loading} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    {...field}
                    disabled={loading}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
              className="text-muted-foreground cursor-pointer select-none text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
            >
              Remember me
            </label>
          </div>
          <Link
            href="#"
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <ButtonGroup>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Spinner />}
            {loading ? "Logging in..." : "Login"}
          </Button>
        </ButtonGroup>
      </form>
    </Form>
  );
};
