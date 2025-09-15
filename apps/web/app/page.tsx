import { type User, validateRegister } from "@ansospace/types";
import { Button } from "@ansospace/ui/components";
import { ThemeToggle } from "@ansospace/ui/theme";

import { APP_CONFIG } from "../lib/constants";
import { env } from "../lib/env";

export default function Page() {
  const user: User = {
    id: "507f1f77bcf86cd799439011", // Valid ObjectId format
    username: "tes",
    email: "test@example.com",
    password: "Password123",
    confirmPassword: "Password123",
    isEmailVerified: true,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <ThemeToggle />

        {/* Validation test */}
        <p>Validation test: {JSON.stringify(validateRegister(user))}</p>
        <p>User is only available in the server component in next.js</p>
        <p className="text-sm text-gray-500">{user.username}</p>
        <h1 className="text-2xl font-bold">{APP_CONFIG.DASHBOARD_TITLE}</h1>
        <p className="text-sm text-gray-500">{APP_CONFIG.SITE_NAME}</p>
        <p>Env is only available in the server component in next.js</p>
        <p className="text-sm text-gray-500">{env.NODE_ENV}</p>
        <Button size="sm" variant="default">
          Button
        </Button>
        <Button size="sm" variant="destructive">
          Button
        </Button>
        <Button size="sm" variant="ghost">
          Button
        </Button>
        <Button size="sm" variant="link">
          Button
        </Button>
        <Button size="sm" variant="outline">
          Button
        </Button>
        <Button size="sm" variant="secondary">
          Button
        </Button>
      </div>
    </div>
  );
}
