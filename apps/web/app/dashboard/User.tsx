import { LoginResponse } from "@ansospace/types";

import { env } from "../../lib/env";
import { createServerApiClient } from "../../lib/serverApiClient";

const url = "/api/v1/users";

export const User = async () => {
  const apiClient = await createServerApiClient(env.USER_SERVICE_URL);
  const user = await apiClient.GET<LoginResponse>(url);
  console.log({ user });

  return <div>{JSON.stringify(user)}</div>;
};
