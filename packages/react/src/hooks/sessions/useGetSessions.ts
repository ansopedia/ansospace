import type { SessionQueryOptions } from "@ansospace/types";
import { useQuery } from "@tanstack/react-query";

import { AUTH_QUERY_KEYS } from "../../constants/queryKeys";
import { useAuthContext } from "../../providers/AuthProvider";

/**
 * Data Hook (Read-only)
 * Ensures sessions are fetched and cached.
 *
 * Uses cached data if available (from server-side hydration or previous fetch)
 * Only refetches if data is stale (older than staleTime)
 */
export const useGetSessions = (options?: Partial<SessionQueryOptions>) => {
  const { sdk } = useAuthContext();

  return useQuery({
    queryKey: [...AUTH_QUERY_KEYS.sessions, options],
    queryFn: async () => {
      const res = await sdk.auth.getActiveSessions(options);
      return res.status === "success" ? res.data : [];
    },
    staleTime: 1000 * 60, // 1 minute - data is fresh for 1 minute
  });
};
