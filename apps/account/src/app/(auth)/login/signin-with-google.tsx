import { Button } from "@ansospace/ui/components";

import { Google } from "@/src/icons";

import { signInWithGoogle } from "./action";

export const SignInWithGoogle = () => {
  return (
    <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
      <Google />
      Sign in with Google
    </Button>
  );
};
