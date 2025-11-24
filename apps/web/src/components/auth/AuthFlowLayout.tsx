import type { ReactNode } from "react";

import { AuthLayout } from "./AuthLayout";

interface AuthFlowLayoutProps {
  children: ReactNode;
  illustration?: ReactNode;
  showCard?: boolean;
}

export function AuthFlowLayout({ children, illustration, showCard = false }: AuthFlowLayoutProps) {
  return (
    <AuthLayout showCard={showCard}>
      <div className="flex w-full max-w-5xl items-center justify-center gap-16 lg:gap-20">
        {/* Main Content */}
        <div className="w-full sm:w-2/3 md:w-2/4 lg:w-2/5">
          <div className="space-y-10">{children}</div>
        </div>

        {/* Illustration */}
        {illustration && (
          <div className="hidden items-center justify-center lg:flex lg:w-2/5">
            <div className="relative">
              <div className="bg-primary/10 absolute inset-0 animate-pulse rounded-full blur-3xl" />
              <div className="relative">{illustration}</div>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
