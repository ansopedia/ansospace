import { useAuthContext } from "../providers/AuthProvider";

export const useLogout = () => {
  const { logout } = useAuthContext();

  const logoutUser = async () => {
    try {
      await logout();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return { logout: logoutUser };
};
