import { RegisterRequest, TokenType } from "@ansospace/types";
import { useMutation } from "@tanstack/react-query";

import { useAuthContext } from "../../providers/AuthProvider";

export const useRegister = () => {
  const { sdk, storage, setGuestUser } = useAuthContext();

  return useMutation({
    mutationFn: (body: RegisterRequest) => sdk.auth.register(body),
    onSuccess: async (response, variables) => {
      if (response.status === "success") {
        const { actionToken, userId } = response.data;

        await storage.set("user-id", userId.toString());
        await storage.set(TokenType.ACTION, actionToken);

        setGuestUser({
          id: userId,
          email: variables.email,
        });
      }
    },
  });
};
