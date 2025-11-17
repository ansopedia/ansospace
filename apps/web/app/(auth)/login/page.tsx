import Image from "next/image";
import Link from "next/link";

import { Typography } from "@ansospace/ui/components";

import { LoginForm } from "./LoginForm";
import { SignInWithGoogle } from "./signin-with-google";

const LoginPage = () => {
  return (
    <div className="h-vh container m-auto flex min-h-dvh w-svw items-center justify-center gap-10 p-6">
      <div className="lg:1/4 w-full sm:w-2/3 md:w-2/4 lg:w-1/3">
        <Typography variant="h2">
          Welcome Back
          <span className="text-primary">&nbsp;Ansopedian!</span>
        </Typography>
        <Typography className="text-muted-foreground">Enter your credentials to access your account</Typography>
        <LoginForm />
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <Typography variant="mutedText" className="bg-background px-2">
              Or continue with
            </Typography>
          </div>
        </div>
        <SignInWithGoogle />
        <Typography className="text-muted-foreground mt-6 text-center text-sm">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="link-primary">
            Sign up
          </Link>
        </Typography>
      </div>
      <div className="hidden items-center justify-center sm:block sm:w-2/3 md:w-2/3 lg:w-1/3">
        <Image src="/images/login-illustrator.svg" alt="login" width={500} height={500} priority />
      </div>
    </div>
  );
};

export default LoginPage;
