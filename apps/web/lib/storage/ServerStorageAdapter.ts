import { cookies } from "next/headers";

import { StorageAdapter, TOKEN_STORAGE_VALUE } from "@ansospace/auth";

export class ServerStorageAdapter implements StorageAdapter {
  async get(key: TOKEN_STORAGE_VALUE) {
    return (await cookies()).get(key)?.value;
  }

  async set(key: TOKEN_STORAGE_VALUE, value: string) {
    (await cookies()).set({
      name: key,
      value,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
  }

  async remove(key: TOKEN_STORAGE_VALUE) {
    (await cookies()).delete(key);
  }
}
