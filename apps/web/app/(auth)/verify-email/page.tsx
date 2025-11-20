"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useUser } from "@ansospace/auth/client";
import { NotificationType } from "@ansospace/types";
import { Button, Card, Spinner, Typography } from "@ansospace/ui/components";
import { AlertCircle, CheckCircle2, Mail, ShieldCheck } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userEmail, isAuthLoading, isUserVerified } = useUser();
  const [countdown, setCountdown] = useState(3);
  const [isOtpSent, setIsOtpSent] = useState(searchParams.get("sent") === "true");

  // Auto-redirect when email is verified
  useEffect(() => {
    if (isUserVerified) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            router.replace("/dashboard");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [isUserVerified, router]);

  // 1. Handle Loading State
  if (isAuthLoading) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
          <div className="relative">
            <div className="bg-primary/20 absolute inset-0 animate-ping rounded-full" />
            <Spinner className="border-primary relative h-12 w-12" />
          </div>
          <div className="space-y-2">
            <Typography variant="h3" className="text-foreground">
              Loading...
            </Typography>
            <Typography className="text-muted-foreground text-sm">Preparing verification page</Typography>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // 2. Handle Already Verified State with auto-redirect
  if (isUserVerified) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center justify-center space-y-6 py-8 text-center">
          <div className="relative">
            <div className="bg-primary/20 absolute inset-0 animate-pulse rounded-full blur-xl" />
            <div className="bg-primary/10 relative rounded-full p-6">
              <CheckCircle2 className="text-primary h-16 w-16" strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-2">
            <Typography variant="h3" className="text-foreground">
              Email Verified!
            </Typography>
            <Typography className="text-muted-foreground">
              Redirecting to dashboard in {countdown} second{countdown !== 1 ? "s" : ""}...
            </Typography>
          </div>
          <div className="w-full space-y-3 pt-4">
            <Button onClick={() => router.replace("/dashboard")} className="w-full rounded-xl" size="lg">
              Continue to Dashboard
            </Button>
            <Typography className="text-muted-foreground text-xs">Or wait for automatic redirect</Typography>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // 3. Handle No Email State (Session Expired/Invalid)
  if (!userEmail) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center justify-center space-y-6 py-8 text-center">
          <div className="bg-destructive/10 rounded-full p-6">
            <AlertCircle className="text-destructive h-16 w-16" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <Typography variant="h3" className="text-foreground">
              Verification Required
            </Typography>
            <Typography className="text-muted-foreground max-w-sm">
              It looks like the verification process was not initiated or your session expired.
            </Typography>
          </div>
          <div className="w-full space-y-3 pt-4">
            <Link href="/signup" className="block">
              <Button className="w-full rounded-xl" size="lg">
                Go to Sign Up
              </Button>
            </Link>
            <Link href="/login" className="block">
              <Button variant="outline" className="w-full rounded-xl" size="lg">
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // 4. Main Verification State
  return (
    <AuthLayout showCard={false}>
      <div className="flex w-full max-w-4xl items-center justify-center gap-12 lg:gap-16">
        {/* Main Content */}
        <div className="w-full sm:w-2/3 md:w-2/4 lg:w-1/3">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="bg-primary/10 inline-flex items-center justify-center rounded-2xl p-4">
                <ShieldCheck className="text-primary h-10 w-10" strokeWidth={1.5} />
              </div>

              <div className="space-y-2">
                <Typography variant="h2" className="text-foreground">
                  Verify Your
                  <span className="text-primary">&nbsp;Email</span>
                </Typography>
                {isOtpSent ? (
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Typography className="text-sm">We've sent a 6-digit code to</Typography>
                  </div>
                ) : (
                  <Typography className="text-muted-foreground text-sm">
                    Please verify your email address to continue accessing your account.
                  </Typography>
                )}
                <Typography className="text-foreground font-medium">{userEmail}</Typography>
              </div>
            </div>

            {/* OTP Form Card */}
            <Card className="border-border/50 bg-card/95 p-4 shadow-lg backdrop-blur-sm sm:p-6">
              <VerifyOtpForm
                email={userEmail}
                onSuccess={() => router.replace("/login")}
                otpType={NotificationType.EMAIL_VERIFICATION_OTP}
                isOtpSent={isOtpSent}
                onOtpSent={() => setIsOtpSent(true)}
              />
            </Card>

            {/* Footer Links */}
            <div className="space-y-3 text-center">
              <Typography className="text-muted-foreground text-sm">
                Wrong email?{" "}
                <Link href="/signup" className="link-primary font-medium">
                  Back to Signup
                </Link>
              </Typography>
              <Typography className="text-muted-foreground text-xs">
                Already verified?{" "}
                <Link href="/login" className="link-primary font-medium">
                  Login here
                </Link>
              </Typography>
            </div>
          </div>
        </div>

        {/* Illustration - Hidden on mobile */}
        <div className="hidden items-center justify-center lg:flex lg:w-1/3">
          <div className="relative">
            <div className="bg-primary/10 absolute inset-0 animate-pulse rounded-full blur-3xl" />
            <Image
              src="/images/verification-illustration.svg"
              alt="Email verification illustration"
              width={500}
              height={500}
              priority
              className="relative drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
