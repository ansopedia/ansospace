import { ApiClient } from "@ansospace/auth";
import { LoginResponse } from "@ansospace/types";

import { env } from "../../lib/env";
import { config } from "../config/ansospace";

const url = "/api/v1/users";
console.log("env.USER_SERVICE_URL", env.USER_SERVICE_URL);
const con = config(env.USER_SERVICE_URL);
const apiClient = new ApiClient(con.baseUrl, con.tokenStorage);

const User = async () => {
  const user = await apiClient.GET<LoginResponse>(url);
  console.log({ user });

  return <div>{JSON.stringify(user)}</div>;
};

export default User;
