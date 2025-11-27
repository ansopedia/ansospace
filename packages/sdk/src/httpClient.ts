import type { AnsospaceStorage, IApiResponse } from "@ansospace/types";

import type { HttpMethod, RequestOptions } from "./types";

interface QueueItem<T = unknown> {
  url: string;
  method: HttpMethod;
  options: RequestOptions;
  resolve: (value: IApiResponse<T>) => void;
  reject: (error: unknown) => void;
}

/**
 * HTTP Client - handles all HTTP requests with automatic token injection and refresh
 */
export class HttpClient {
  private baseUrl: string;
  private storage: AnsospaceStorage;
  private defaultHeaders: Record<string, string>;
  private isRefreshing = false;
  private failedQueue: QueueItem<unknown>[] = [];

  constructor(baseUrl: string, storage: AnsospaceStorage, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.storage = storage;
    this.defaultHeaders = defaultHeaders;
  }

  /**
   * Set default headers for all requests
   */
  public setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Get the current default headers
   */
  public getDefaultHeaders(): Record<string, string> {
    return { ...this.defaultHeaders };
  }

  /**
   * Process queued requests after token refresh
   */
  private processQueue(error: unknown, accessToken: string | null = null): void {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        this.request(prom.method, prom.url, {
          ...prom.options,
          headers: {
            ...prom.options.headers,
            Authorization: `Bearer ${accessToken}`,
          },
          _retry: true,
        })
          .then((value) => prom.resolve(value as IApiResponse<unknown>))
          .catch(prom.reject);
      }
    });

    this.failedQueue = [];
  }

  /**
   * Handle HTTP response and parse JSON
   */
  private async handleResponse<T>(response: Response): Promise<IApiResponse<T>> {
    const data = await response.json();
    return data;
  }

  /**
   * Extract tokens from response headers and save them
   */
  private async extractAndSaveTokens(response: Response, url: string): Promise<void> {
    // Save tokens from auth endpoints
    if (
      url.includes("/auth/login") ||
      url.includes("/auth/refresh") ||
      url.includes("/otp/verify") ||
      url.includes("/auth/auto-login")
    ) {
      const newAccessToken = response.headers.get("authorization");
      const newRefreshToken = response.headers.get("refresh-token");

      if (newAccessToken) {
        await this.storage.set("access", newAccessToken);
      }
      if (newRefreshToken) {
        await this.storage.set("refresh", newRefreshToken);
      }
    }
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshToken(): Promise<string> {
    const refreshToken = await this.storage.get("refresh");

    if (!refreshToken || typeof refreshToken !== "string") {
      throw new Error("Unauthorized User. Please log in again.");
    }

    const refreshResponse = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshResponse.ok) {
      throw new Error("Refresh token failed");
    }

    const newAccessToken = refreshResponse.headers.get("authorization");
    const newRefreshToken = refreshResponse.headers.get("refresh-token");

    if (newAccessToken && newRefreshToken) {
      await this.storage.set("access", newAccessToken);
      await this.storage.set("refresh", newRefreshToken);
      return newAccessToken;
    } else {
      throw new Error("Refresh token response missing tokens");
    }
  }

  /**
   * Main request method with automatic token injection and refresh
   */
  async request<T>(method: HttpMethod, url: string, options: RequestOptions = {}): Promise<IApiResponse<T>> {
    try {
      const { body, _retry, ...fetchOptions } = options;

      const accessTokenValue = await this.storage.get("access");
      const accessToken = accessTokenValue ? String(accessTokenValue) : null;

      const headers = new Headers({
        ...this.defaultHeaders,
        ...fetchOptions.headers,
      });

      if (!headers.has("Content-Type") && method !== "GET") {
        headers.set("Content-Type", "application/json");
      }

      if (accessToken && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      const response = await fetch(`${this.baseUrl}${url}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        ...fetchOptions,
      });

      const result = await this.handleResponse<T>(response);

      // Extract and save tokens from response
      await this.extractAndSaveTokens(response, url);

      // 401 Handling and Refresh Token Logic
      if (response.status === 401 && !_retry) {
        if (url.includes("/auth/login")) {
          return result;
        }

        if (this.isRefreshing) {
          return new Promise<IApiResponse<T>>((resolve, reject) => {
            this.failedQueue.push({
              url,
              method,
              options,
              resolve: resolve as (value: IApiResponse<unknown>) => void,
              reject,
            });
          });
        }

        this.isRefreshing = true;

        try {
          const newAccessToken = await this.refreshToken();
          this.processQueue(null, newAccessToken);
          return this.request<T>(method, url, { ...options, _retry: true });
        } catch (refreshError) {
          this.processQueue(refreshError, null);
          throw refreshError;
        } finally {
          this.isRefreshing = false;
        }
      }

      if (result.status === "failed" && result.code === "resource_not_found") {
        throw new Error(result.message);
      }

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.cause && (error.cause as { code?: string }).code === "ECONNREFUSED") {
          return {
            status: "failed",
            message: "Could not connect to the server. Please check your network connection and try again.",
            code: "network_error",
          } as IApiResponse<T>;
        }
        if (error.message === "Failed to fetch") {
          return {
            status: "failed",
            message: "Could not connect to the server. Please check your network connection and try again.",
            code: "network_error",
          } as IApiResponse<T>;
        }
      }
      throw error;
    }
  }

  /**
   * GET request
   */
  async GET<T>(url: string, options: RequestOptions = {}): Promise<IApiResponse<T>> {
    return this.request<T>("GET", url, options);
  }

  /**
   * POST request
   */
  async POST<T>(url: string, options: RequestOptions = {}): Promise<IApiResponse<T>> {
    return this.request<T>("POST", url, options);
  }

  /**
   * PUT request
   */
  async PUT<T>(url: string, options: RequestOptions = {}): Promise<IApiResponse<T>> {
    return this.request<T>("PUT", url, options);
  }

  /**
   * DELETE request
   */
  async DELETE<T>(url: string, options: RequestOptions = {}): Promise<IApiResponse<T>> {
    return this.request<T>("DELETE", url, options);
  }

  /**
   * PATCH request
   */
  async PATCH<T>(url: string, options: RequestOptions = {}): Promise<IApiResponse<T>> {
    return this.request<T>("PATCH", url, options);
  }

  /**
   * Make a request without automatic token handling (useful for public endpoints)
   */
  async publicRequest<T>(method: HttpMethod, url: string, options: RequestOptions = {}): Promise<IApiResponse<T>> {
    const { body, ...fetchOptions } = options;

    const headers = new Headers({
      ...this.defaultHeaders,
      ...fetchOptions.headers,
    });

    if (!headers.has("Content-Type") && method !== "GET") {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...fetchOptions,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Set a new base URL (useful for switching between different API endpoints)
   */
  public setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  /**
   * Get the current base URL
   */
  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Check if user is authenticated (has valid access token)
   */
  public async isAuthenticated(): Promise<boolean> {
    const token = await this.storage.get("access");
    return !!token && typeof token === "string";
  }
}
