import { RegisterRequest, TokenType } from "@ansospace/types";
import { useMutation } from "@tanstack/react-query";

import { useAuthContext } from "../../providers/AuthProvider";

export const useRegister = () => {
  const { sdk, storage, updateUser } = useAuthContext();

  return useMutation({
    mutationFn: (body: RegisterRequest) => sdk.auth.register(body),
    onSuccess: async (response, variables) => {
      if (response.status === "success") {
        const { actionToken, userId } = response.data;

        await storage.set("user-id", userId.toString());
        await storage.set(TokenType.ACTION, actionToken);
        await storage.set("user-email", variables.email);
        await storage.set("is-user-verified", false);

        // This switches the user from GUEST -> PARTIAL
        updateUser({
          kind: "PARTIAL",
          id: userId,
          email: variables.email,
          isVerified: false,
        });
      }
    },
  });
};
