import Image from "next/image";

export function VerificationIllustration() {
  return (
    <div className="hidden items-center justify-center lg:flex lg:w-2/5">
      <div className="relative">
        <div className="bg-primary/10 absolute inset-0 animate-pulse rounded-full blur-3xl" />
        <div className="relative">
          <Image
            src="/images/verification-illustration.svg"
            alt="Email verification illustration"
            width={550}
            height={550}
            priority
            className="relative drop-shadow-2xl transition-transform hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
}
