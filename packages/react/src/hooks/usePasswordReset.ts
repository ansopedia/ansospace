import type { ResetPasswordRequest } from "@ansospace/types";
import { TokenType } from "@ansospace/types";
import { useMutation } from "@tanstack/react-query";

import { useAuthContext } from "../providers/AuthProvider";

export const usePasswordReset = () => {
  const { sdk, storage } = useAuthContext();

  return useMutation({
    mutationFn: async (body: Omit<ResetPasswordRequest, "actionToken">) => {
      const actionToken = await storage.get(TokenType.ACTION);
      if (!actionToken) throw new Error("Action token missing. Please resend OTP.");

      return await sdk.auth.resetPassword({
        ...body,
        actionToken: actionToken as string,
      });
    },
  });
};
