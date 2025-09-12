import type { User } from "@monorepo/types/user";
import { Button } from "@monorepo/ui/components";
import { ThemeToggle } from "@monorepo/ui/theme";

import { APP_CONFIG } from "../lib/constants";
import { env } from "../lib/env";

export default function Page() {
  const user: User = {
    id: "123",
    email: "john@school.com",
    name: "John",
    role: "student",
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <ThemeToggle />

        <p>User is only available in the server component in next.js</p>
        <p className="text-sm text-gray-500">{user.name}</p>
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
