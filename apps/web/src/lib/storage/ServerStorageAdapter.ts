import { cookies } from "next/headers";

import { AnsospaceStorage, AuthStorageKey } from "@ansospace/auth";

export class ServerStorageAdapter implements AnsospaceStorage {
  async get(key: AuthStorageKey) {
    return (await cookies()).get(key)?.value;
  }

  async set(key: AuthStorageKey, value: string | boolean) {
    (await cookies()).set({
      name: key,
      value: String(value),
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
  }

  async remove(key: AuthStorageKey) {
    (await cookies()).delete(key);
  }
}
