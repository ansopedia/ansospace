"use client";

import { useRouter } from "next/navigation";

import { useLogout, useUser } from "@ansospace/react";
import { Navbar, UserMenu } from "@ansospace/ui/blocks";
import { Separator } from "@ansospace/ui/components/separator";
import { SidebarTrigger } from "@ansospace/ui/components/sidebar";

export const DashboardNavbar = () => {
  const router = useRouter();
  const { user, email } = useUser();
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

  if (user.kind !== "AUTHENTICATED") {
    return null;
  }

  const initials = user.displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Navbar>
      <Navbar.Left>
        <SidebarTrigger variant="ghost" />
        <Separator orientation="vertical" className="h-4" />
        <Navbar.Brand>
          <h1 className="text-lg font-bold tracking-tight">Dashboard</h1>
        </Navbar.Brand>
      </Navbar.Left>

      <Navbar.Right>
        <UserMenu
          name={user.displayName}
          avatarUrl={user.avatar}
          email={email || ""}
          fallback={initials}
          onLogout={handleLogout}
          onManageAccount={handleManageAccount}
        />
      </Navbar.Right>
    </Navbar>
  );
};
