"use server";
import { ChangePasswordRequest } from "@ansospace/types";

import { getServerSdk } from "@/lib/ansospace/server";

export const changePasswordAction = async (data: ChangePasswordRequest) => {
  const sdk = await getServerSdk();
  return await sdk.auth.changePassword(data);
};
