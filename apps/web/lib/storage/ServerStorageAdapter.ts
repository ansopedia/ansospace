import { cookies } from "next/headers";

import { AnsospaceStorage, StorageKey } from "@ansospace/auth";

export class ServerStorageAdapter implements AnsospaceStorage {
  async get(key: StorageKey) {
    return (await cookies()).get(key)?.value;
  }

  async set(key: StorageKey, value: string) {
    (await cookies()).set({
      name: key,
      value,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
  }

  async remove(key: StorageKey) {
    (await cookies()).delete(key);
  }
}
