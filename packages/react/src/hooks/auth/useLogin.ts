import { LoginRequest } from "@ansospace/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AUTH_QUERY_KEYS } from "../../constants/queryKeys";
import { useAuthContext } from "../../providers/AuthProvider";

export const useLogin = () => {
  const { sdk, storage, setGuestUser } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: LoginRequest) => sdk.auth.login(body),
    onSuccess: async (response) => {
      if (response.status === "success") {
        const { userId } = response.data;

        await storage.set("user-id", userId.toString());

        setGuestUser(null);
        // We tell React Query: "The 'auth session' is dirty, refetch it."
        // This automatically updates the user state in AuthProvider.
        await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.accessProfile });
      }
    },
  });
};
