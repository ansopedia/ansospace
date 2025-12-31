"use client";

import { useUser } from "@ansospace/react";

export function WelcomeHeader() {
  const { user, email } = useUser();

  const displayName = user.kind === "AUTHENTICATED" ? user.username : email || "User";

  return (
    <div>
      <h2 className="text-2xl font-bold">Welcome back, {displayName}!</h2>
      <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
    </div>
  );
}
