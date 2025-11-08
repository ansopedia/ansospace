"use client";

import { useAuth, useLogin } from "@ansospace/auth";
import { type Login, loginSchema } from "@ansospace/types";
import {
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Label,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ansospace/ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon } from "lucide-react";
import { useForm } from "react-hook-form";

const Page = () => {
  const { userId, permissions, isAuthenticated } = useAuth();
  const { loginUser } = useLogin();
  console.log({ userId, permissions, isAuthenticated });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: Login) => {
    console.log({ data });
    // const isEmail = data.identifier.includes("@");
    // const loginData: Login = isEmail
    //   ? { email: data.identifier, password: data.password }
    //   : { username: data.identifier, password: data.password };
    const loginData: Login = { email: data.email, password: data.password };
    console.log({ loginData });
    try {
      await loginUser(loginData);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <form onSubmit={handleSubmit(onSubmit)} className="grid w-full max-w-sm gap-4">
        <div>
          <Label htmlFor="email">Email or Username</Label>
          <InputGroup>
            <InputGroupInput id="email" placeholder="Enter email or username" {...register("email")} />
            <InputGroupAddon align="inline-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton variant="ghost" aria-label="Info" size="icon-xs">
                    <InfoIcon />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enter your email address or username</p>
                </TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <InputGroup>
            <InputGroupInput id="password" placeholder="Enter password" type="password" {...register("password")} />
            <InputGroupAddon align="inline-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton variant="ghost" aria-label="Info" size="icon-xs">
                    <InfoIcon />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Password must be at least 8 characters, contain uppercase, lowercase, number, and special character
                  </p>
                </TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default Page;
