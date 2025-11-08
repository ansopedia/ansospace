import { Login } from "@ansospace/types";

import { useAuth } from "./useAuth";

export const useLogin = () => {
  const { login, authService } = useAuth();

  const loginUser = async (body: Login) => {
    const response = await authService.loginUser(body);

    if (response.status === "success") {
      await login(response.data.userId, []);
    }
    return response;
  };

  return { loginUser };
};
