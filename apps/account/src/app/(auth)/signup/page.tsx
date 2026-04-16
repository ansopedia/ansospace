import Image from "next/image";
import Link from "next/link";

import { Typography } from "@ansospace/ui/components";

import { RegisterForm } from "./RegisterForm";

const RegisterPage = () => {
  return (
    <div className="h-vh container m-auto flex min-h-dvh w-svw items-center justify-center gap-10 p-6">
      <div className="lg:1/4 w-full sm:w-2/3 md:w-2/4 lg:w-1/3">
        <Typography variant="h2">
          Want to be an
          <span className="text-primary font-bold">&nbsp;Ansopedian?</span>
        </Typography>
        <Typography className="text-muted-foreground">Sign up to continue</Typography>
        <RegisterForm />
        <Typography className="text-muted-foreground mt-6 text-center text-sm">
          Already have an account?
          <Link href="/login" className="link-primary">
            &nbsp;Login
          </Link>
        </Typography>
      </div>
      <div className="hidden items-center justify-center sm:block sm:w-2/3 md:w-2/3 lg:w-1/3">
        <Image src="/images/sign-up-illustrator.svg" alt="sign up" width={500} height={500} priority />
      </div>
    </div>
  );
};

export default RegisterPage;
