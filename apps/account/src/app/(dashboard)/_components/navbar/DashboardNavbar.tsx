"use client";

import { useRouter } from "next/navigation";

import { useLogout, useUser } from "@ansospace/react";
import { Navbar } from "@ansospace/ui/blocks";

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

  const name = user.username || email || "User";
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Navbar
      title="Dashboard"
      userMenu={{
        name,
        email: email || "",
        fallback: initials,
        onLogout: handleLogout,
        onManageAccount: handleManageAccount,
      }}
    />
  );
};
