import { Login } from "@ansospace/types";

import { AuthManager } from "../core/AuthManager";
import { useAuth } from "./useAuth";

export const useLogin = () => {
  const { login } = useAuth();
  const auth = AuthManager.instance;

  const loginUser = async (body: Login) => {
    // try {
    // const response = await authService.loginUser(body);
    const response = await auth.auth.loginUser(body);

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
