import { useCallback, useState } from "react";

import { IApiResponse, RegisterRequest, RegisterResponse } from "@ansospace/types";

import { useAuthContext } from "../providers/AuthProvider";

interface UseRegisterResult {
  register: (body: RegisterRequest) => Promise<IApiResponse<RegisterResponse>>;
  loading: boolean;
  error: Error | null;
  data: IApiResponse<RegisterResponse> | null;
}

export const useRegister = (): UseRegisterResult => {
  const { register: registerUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<IApiResponse<RegisterResponse> | null>(null);

  const register = useCallback(
    async (body: RegisterRequest): Promise<IApiResponse<RegisterResponse>> => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const response = await registerUser(body);
        setData(response);
        return response;
      } catch (err) {
        const e = err instanceof Error ? err : new Error("Registration failed");
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [registerUser]
  );

  return { register, loading, error, data };
};
