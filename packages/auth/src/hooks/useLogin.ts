import { Login } from "@ansospace/types";

import { useAuth } from "./useAuth";

export const useLogin = () => {
  const { login, authService } = useAuth();

  const loginUser = async (body: Login) => {
    try {
      const response = await authService.loginUser(body);
      if (response.status === "success") {
        // Assuming response.data has userId and permissions
        await login(response.data.userId, []); // Adjust based on actual response
      }
      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Login failed:", error);
      throw error;
    }
  };

  return { loginUser };
};
