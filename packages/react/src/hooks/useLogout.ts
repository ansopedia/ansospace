import { TokenType } from "@ansospace/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuthContext } from "../providers/AuthProvider";

export const useLogout = () => {
  const { sdk, storage } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => sdk.auth.logout(),
    onSuccess: async () => {
      // 1. Clear all persistence
      await storage.remove("userId");
      await storage.remove("isUserVerified");
      await storage.remove("userEmail");
      await storage.remove(TokenType.ACTION);

      // 2. Clear all React Query cache (Immediate UI update)
      queryClient.clear();
    },
  });
};
