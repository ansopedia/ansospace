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

  constructor(request: NextRequest, response: NextResponse) {
    this.request = request;
    this.response = response;
  }

  async get(key: AuthStorageKey) {
    const cookie = this.request.cookies.get(key);
    return cookie?.value;
  }

  async set(key: AuthStorageKey, value: string | boolean | number) {
    // Set cookie on the response object
    this.response.cookies.set(key, String(value), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
  }

  async remove(key: AuthStorageKey) {
    this.response.cookies.delete(key);
  }

  /**
   * Get the response object (needed to return modified cookies)
   */
  getResponse(): NextResponse {
    return this.response;
  }
}
