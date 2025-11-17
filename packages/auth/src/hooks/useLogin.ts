import { useCallback, useState } from "react";

import { IApiResponse, IApiResponseFailed, Login, LoginResponse } from "@ansospace/types";

import { useAuthProviderContext } from "../providers/AuthProvider";

interface UseLoginResult {
  login: (body: Login) => Promise<IApiResponse<LoginResponse>>;
  loading: boolean;
  error: IApiResponseFailed | Error | null;
  data: IApiResponse<LoginResponse> | null;
}

export const useLogin = (): UseLoginResult => {
  const { login: loginUser } = useAuthProviderContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<IApiResponseFailed | Error | null>(null);
  const [data, setData] = useState<IApiResponse<LoginResponse> | null>(null);

  const login = useCallback(
    async (body: Login): Promise<IApiResponse<LoginResponse>> => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const response = await loginUser(body);
        if (response.status === "failed") {
          setError(response);
        } else {
          setData(response);
        }
        return response;
      } catch (err) {
        const e = err instanceof Error ? err : new Error("Login failed");
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [loginUser]
  );

  return { login, loading, error, data };
};
