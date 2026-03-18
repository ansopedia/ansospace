"use client";

import { useRouter } from "next/navigation";

import { useLogout, useUser } from "@ansospace/react";
import { UserMenu } from "@ansospace/ui/blocks";
import { Separator } from "@ansospace/ui/components";
import { SidebarTrigger } from "@ansospace/ui/components/sidebar";
import { ThemeToggle } from "@ansospace/ui/theme";

export const DashboardNavbar = () => {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  const handleManageAccount = () => {
    router.push("/profile");
  };

  if (!isSignedIn) return null;

  const initials = user.displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="bg-background/80 sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b-2 px-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <SidebarTrigger variant="ghost" />
        <Separator orientation="vertical" />
        <h1 className="text-lg font-bold tracking-tight">Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu
          name={user.displayName}
          avatarUrl={user.avatar}
          email={user.email}
          fallback={initials}
          onLogout={handleLogout}
          onManageAccount={handleManageAccount}
        />
      </div>
    </header>
  );
};
