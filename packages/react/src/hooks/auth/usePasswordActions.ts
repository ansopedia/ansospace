import type { IApiResponse, ResetPasswordRequest } from "@ansospace/types";
import { TokenType } from "@ansospace/types";
import { useMutation } from "@tanstack/react-query";

import { useAuthContext } from "../../providers/AuthProvider";

export const usePasswordActions = () => {
  const { sdk, storage } = useAuthContext();

  return useMutation({
    mutationFn: async (body: Omit<ResetPasswordRequest, "actionToken">): Promise<IApiResponse<void>> => {
      const actionToken = await storage.get(TokenType.ACTION);

      if (!actionToken || typeof actionToken !== "string") {
        return {
          status: "failed",
          code: "session_expired",
          message: "Your reset session has expired. Please request a new code.",
        };
      }

      return await sdk.auth.resetPassword({
        ...body,
        actionToken,
      });
    },
    onSuccess: async (response) => {
      if (response.status === "success") {
        await storage.remove(TokenType.ACTION);
      }
    },
  });
};
