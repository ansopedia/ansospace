"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { NotificationType } from "@ansospace/types";
import { Spinner, Typography, toast } from "@ansospace/ui/components";

import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (!emailParam || !tokenParam) {
      toast.error("Invalid verification link. Redirecting to signup...");
      setTimeout(() => {
        router.replace("/signup");
      }, 2000);
      return;
    }

    setEmail(emailParam);
    setToken(tokenParam);
  }, [searchParams, router]);

  const handleTokenUpdate = (actionToken: string) => {
    setToken(actionToken);
  };

  if (!email || !token) {
    return (
      <div className="h-vh container m-auto flex min-h-dvh w-svw items-center justify-center p-6">
        <div className="text-center">
          <Spinner className="mx-auto mb-4" />
          <Typography className="text-muted-foreground">Loading verification page...</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="h-vh container m-auto flex min-h-dvh w-svw items-center justify-center gap-10 p-6">
      <div className="lg:1/4 w-full sm:w-2/3 md:w-2/4 lg:w-1/3">
        <Typography variant="h2">
          Verify Your
          <span className="text-primary">&nbsp;Email</span>
        </Typography>
        <Typography className="text-muted-foreground">We've sent a 6-digit verification code to {email}</Typography>

        <VerifyOtpForm
          email={email}
          token={token}
          onTokenUpdate={handleTokenUpdate}
          onSuccess={() => router.replace("/dashboard")}
          otpType={NotificationType.EMAIL_VERIFICATION_OTP}
        />

        <Typography className="text-muted-foreground mt-6 text-center text-sm">
          Wrong email?{" "}
          <Link href="/signup" className="link-primary">
            Back to Signup
          </Link>
        </Typography>
      </div>
      <div className="hidden items-center justify-center sm:block sm:w-2/3 md:w-2/3 lg:w-1/3">
        <Image src="/images/verification-illustration.svg" alt="email verification" width={500} height={500} priority />
      </div>
    </div>
  );
}
