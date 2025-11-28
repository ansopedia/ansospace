import type { Otp, RegisterRequest } from "@ansospace/types";
import { objectId, passwordSchema, registerRequestSchema, usernameSchema } from "@ansospace/types";
import { Button } from "@ansospace/ui/components";
import { ThemeToggle } from "@ansospace/ui/theme";

import { Users } from "../components/user";
import { APP_CONFIG } from "../lib/constants";
import { env } from "../lib/env";

const page = () => {
  const newUsername = usernameSchema.parse("username");
  const newPassword = passwordSchema.parse("Password123!");

  const mongooseId = objectId.parse("68bda53ea5c0a2f0ac69dd3e");
  const user: RegisterRequest = {
    username: newUsername,
    email: "test@example.com",
    password: newPassword,
    confirmPassword: newPassword,
  };

  const otp: Otp = "sd" as Otp;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <ThemeToggle />

        <p>{otp}</p>
        {mongooseId.toString()}

        <h2>User Components</h2>
        {/* <Suspense fallback={"Loading"}> */}
        <Users />
        {/* </Suspense> */}
        <br />
        <br />
        <br />
        {/* Validation test */}
        <p>Validation test: {JSON.stringify(registerRequestSchema.parse(user))}</p>
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
};

export default page;
