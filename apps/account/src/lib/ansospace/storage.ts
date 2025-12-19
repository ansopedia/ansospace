import { cookies } from "next/headers";

import { AnsospaceStorage, AuthStorageKey } from "@ansospace/types";

export class NextServerStorage implements AnsospaceStorage {
  async get(key: AuthStorageKey) {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(key);
    return cookie?.value;
  }

  async set(key: AuthStorageKey, value: string | boolean | number) {
    const cookieStore = await cookies();
    // Convert all values to strings for cookies
    cookieStore.set(key, String(value), {
      httpOnly: true, // Secure: JS cannot read this on client
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
  }

  async remove(key: AuthStorageKey) {
    const cookieStore = await cookies();
    cookieStore.delete(key);
  }
}
