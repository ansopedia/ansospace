import { TokenType } from "@ansospace/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuthContext } from "../../providers/AuthProvider";

export const useLogout = () => {
  const { sdk, storage } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => sdk.auth.logout(),
    onSuccess: async () => {
      // 1. Clear all persistence
      await storage.remove("user-id");
      await storage.remove(TokenType.ACTION);
      await storage.remove(TokenType.AUTHORIZATION);
      await storage.remove(TokenType.REFRESH);

      // 2. Clear all React Query cache (Immediate UI update)
      queryClient.clear();
    },
  });
};
