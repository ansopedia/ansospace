import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthContext } from "../providers/AuthProvider";

export const useSessions = () => {
  const { sdk } = useAuthContext();
  const queryClient = useQueryClient();

  // 🔹 Query Keys (Centralized for consistency)
  const SESSION_KEYS = {
    all: ["auth", "sessions"] as const,
  };

  // 1. Fetch Active Sessions List
  // GET /api/v1/sessions
  const {
    data: sessions,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: SESSION_KEYS.all,
    queryFn: async () => {
      const res = await sdk.auth.getActiveSessions();
      return res.status === "success" ? res.data : [];
    },
    staleTime: 1000 * 60 * 1, // 1 minute freshness
  });

  // 2. Revoke Specific Session (Remove "iPhone 12")
  // DELETE /api/v1/sessions/:id
  const revokeByIdMutation = useMutation({
    mutationFn: (sessionId: string) => sdk.auth.revokeSessionById(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.all });
    },
  });

  // 3. Revoke Others (Sign out everywhere else)
  // DELETE /api/v1/sessions/others
  const revokeOthersMutation = useMutation({
    mutationFn: () => sdk.auth.revokeOtherSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.all });
    },
  });

  // 4. Revoke ALL (Nuclear option)
  // DELETE /api/v1/sessions
  const revokeAllMutation = useMutation({
    mutationFn: () => sdk.auth.revokeAllSessions(),
    onSuccess: () => {
      // Since this kills the current session too, we might want to
      // invalidate the user profile or redirect to login.
      queryClient.invalidateQueries({ queryKey: ["auth", "session"] }); // Profile
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.all }); // List
    },
  });

  return {
    // Data
    sessions: sessions || [],
    isLoading,
    isError,
    error,

    // Actions
    revokeSessionById: revokeByIdMutation.mutateAsync,
    revokeOtherSessions: revokeOthersMutation.mutateAsync,
    revokeAllSessions: revokeAllMutation.mutateAsync,

    // Loading States for Buttons
    isRevoking: revokeByIdMutation.isPending || revokeOthersMutation.isPending || revokeAllMutation.isPending,
  };
};
