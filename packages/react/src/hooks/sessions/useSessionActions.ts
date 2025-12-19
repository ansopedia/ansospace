import { ObjectId } from "@ansospace/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AUTH_QUERY_KEYS } from "../../constants/queryKeys";
import { useAuthContext } from "../../providers/AuthProvider";

export const useSessionActions = () => {
  const { sdk } = useAuthContext();
  const queryClient = useQueryClient();

  // Shared Helper: Refresh the list after any change
  const invalidateList = () => {
    queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.sessions });
  };

  // Mutation 1: Revoke One
  const revokeById = useMutation({
    mutationFn: (id: ObjectId) => sdk.auth.revokeSessionById(id),
    onSuccess: invalidateList,
  });

  // Mutation 2: Revoke Others
  const revokeOthers = useMutation({
    mutationFn: () => sdk.auth.revokeOtherSessions(),
    onSuccess: invalidateList,
  });

  // Mutation 3: Revoke All
  const revokeAll = useMutation({
    mutationFn: () => sdk.auth.revokeAllSessions(),
    onSuccess: () => {
      invalidateList();
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.accessProfile });
    },
  });

  return {
    // Methods
    revokeSessionById: revokeById.mutateAsync,
    revokeOtherSessions: revokeOthers.mutateAsync,
    revokeAllSessions: revokeAll.mutateAsync,

    // Combined Loading State (Optional utility)
    isPending: revokeById.isPending || revokeOthers.isPending || revokeAll.isPending,
    error: revokeById.error || revokeOthers.error || revokeAll.error,
  };
};
