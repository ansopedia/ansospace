import { LoginRequest } from "@ansospace/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AUTH_QUERY_KEYS } from "../../constants/queryKeys";
import { useAuthContext } from "../../providers/AuthProvider";

export const useLogin = () => {
  const { sdk, storage, updateUser } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: LoginRequest) => sdk.auth.login(body),
    onSuccess: async (response, variables) => {
      if (response.status === "success") {
        const { userId } = response.data;

        await storage.set("userId", userId.toString());
        await storage.set("isUserVerified", true);

        updateUser({
          kind: "AUTHENTICATED",
          id: userId,
          isVerified: true,
        });

        // We tell React Query: "The 'auth session' is dirty, refetch it."
        // This automatically updates the user state in AuthProvider.
        await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.accessProfile });
      } else {
        const emailToSave = variables.email;

        if (emailToSave) {
          await storage.set("userEmail", emailToSave);
        }

        await storage.set("isUserVerified", false);

        updateUser({
          kind: "PARTIAL",
          email: emailToSave,
          isVerified: false,
        });
      }
    },
  });
};
