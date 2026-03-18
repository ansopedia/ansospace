import { NextRequest, NextResponse } from "next/server";

import { AnsospaceStorage, AuthStorageKey } from "@ansospace/types";

/**
 * MiddlewareStorage - Storage adapter for Next.js middleware
 * Works with NextRequest and NextResponse to handle cookies in middleware context
 *
 * Note: This storage modifies the NextResponse object to set cookies,
 * so you must use the returned response from SDK operations.
 */
export class MiddlewareStorage implements AnsospaceStorage {
  private request: NextRequest;
  private response: NextResponse;
  private internalCache: Map<string, string> = new Map();

  constructor(request: NextRequest, response: NextResponse) {
    this.request = request;
    this.response = response;

    // Prefill cache from request cookies
    this.request.cookies.getAll().forEach((c: { name: string; value: string }) => {
      this.internalCache.set(c.name, c.value);
    });
  }

  async get<T>(key: AuthStorageKey): Promise<T> {
    // 1. Check internal cache first
    return this.internalCache.get(key) as T;
  }

  async set<T>(key: AuthStorageKey, value: T) {
    const stringValue = String(value);

    // 1. Update internal cache
    this.internalCache.set(key, stringValue);

    // 2. Set cookie on the response object (for the browser)
    this.response.cookies.set(key, stringValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    // 3. Sync with request headers (for downstream RSCs/Middleware)
    // Update Authorization header if it's the token
    if (key === "authorization") {
      this.request.headers.set("authorization", `Bearer ${stringValue}`);
    }

    // Update the Cookie header string in the request
    const currentCookie = this.request.headers.get("cookie") || "";
    const newCookieItem = `${key}=${stringValue}`;

    if (currentCookie.includes(`${key}=`)) {
      const regex = new RegExp(`${key}=[^;]+`);
      this.request.headers.set("cookie", currentCookie.replace(regex, newCookieItem));
    } else {
      this.request.headers.set("cookie", currentCookie ? `${currentCookie}; ${newCookieItem}` : newCookieItem);
    }
  }

  async remove(key: AuthStorageKey) {
    // 1. Update internal cache
    this.internalCache.delete(key);

    // 2. Remove cookie from response
    this.response.cookies.delete(key);

    // 3. Remove from request headers
    if (key === "authorization") {
      this.request.headers.delete("authorization");
    }

    const currentCookie = this.request.headers.get("cookie") || "";
    if (currentCookie.includes(`${key}=`)) {
      const regex = new RegExp(`${key}=[^;]+;?\\s*`, "g");
      this.request.headers.set("cookie", currentCookie.replace(regex, ""));
    }
  }

  /**
   * Get the response object (needed to return modified cookies)
   */
  getResponse(): NextResponse {
    return this.response;
  }
}
