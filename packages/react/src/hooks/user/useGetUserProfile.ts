import { useQuery } from "@tanstack/react-query";

import { AUTH_QUERY_KEYS } from "../../constants/queryKeys";
import { useAuthContext } from "../../providers/AuthProvider";

/**
 * Hook to fetch user profile data
 * Returns user profile including googleId to determine auth method
 */
export const useGetUserProfile = () => {
  const { sdk } = useAuthContext();

  return useQuery({
    queryKey: [...AUTH_QUERY_KEYS.accessProfile, "profile"],
    queryFn: async () => {
      const res = await sdk.users.getProfile();
      return res.status === "success" ? res.data : null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
