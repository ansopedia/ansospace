import { useAuth } from "./useAuth";

export const useLogout = () => {
  const { logout, authService } = useAuth();

  const logoutUser = async () => {
    try {
      await authService.logout();
      await logout();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return { logout: logoutUser };
};
