"use client";

// import { useRouter } from "next/navigation";
// import { Button } from "./button";
import { Button } from "@ansospace/ui/components/button";

// import { ENV_CONFIG } from "@/constants";

import { Google } from "./icons";

export const SignInWithGoogle = () => {
  // const router = useRouter();

  // const searchParams = useSearchParams();

  // useEffect(() => {
  //   if (searchParams.get("error")) {
  //     toast.error("Failed to login");
  //   }
  // }, [searchParams]);

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      // onClick={() =>
      //   router.push(
      //     `${ENV_CONFIG.SERVICES.USER_API_URL}/api/v1/auth/google?redirectUrl=${ENV_CONFIG.APP.URL}/dashboard`
      //   )
      // }
    >
      <Google />
      Sign in with Google
    </Button>
  );
};
