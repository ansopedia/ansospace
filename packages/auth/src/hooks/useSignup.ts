import { RegisterSchema } from "@ansospace/types";

import { useAuth } from "./useAuth";

export const useSignup = () => {
  const { authService, login } = useAuth();

  const signup = async (body: RegisterSchema) => {
    try {
      const response = await authService.signup(body);
      if (response.status === "success") {
        // Assuming signup returns userId, login the user
        login(response.data.userId, []);
      }
      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Signup failed:", error);
      throw error;
    }
  };

  return { signup };
};
