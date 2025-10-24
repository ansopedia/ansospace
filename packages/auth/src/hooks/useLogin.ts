import { Login } from "@ansospace/types";

import { useAuth } from "./useAuth";

export const useLogin = () => {
  const { login, authService } = useAuth();

  const loginUser = async (body: Login) => {
    // try {
    const response = await authService.loginUser(body);
    if (response.status === "success") {
      await login(response.data.userId, []); // Adjust based on actual response
    }
    // return response.message;
    // } catch (error) {
    //   // eslint-disable-next-line no-console
    //   console.error("Login failed:", error);
    //   throw error;
    // }
  };

  return { loginUser };
};
