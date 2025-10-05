"use client";

import { useAuth, useLogin } from "@ansospace/auth";
import { Login, passwordSchema } from "@ansospace/types";
import { Button } from "@ansospace/ui/components";

const Page = () => {
  const { userId, permissions, isAuthenticated } = useAuth();
  const { loginUser } = useLogin();
  console.log({ userId, permissions, isAuthenticated });

  const handleLogin = async () => {
    const loginData: Login = {
      email: "group.ansopedia@gmail.com",
      password: passwordSchema.parse("password@ansopedia"),
    };
    await loginUser(loginData);
  };

  return (
    <div>
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
};

export default Page;
