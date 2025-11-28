import type { AnsospaceStorage, IApiResponse } from "@ansospace/types";
import { HttpHeaders, TokenType } from "@ansospace/types";

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
  private processQueue(error: unknown, accessToken?: string): void {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        const headers = new Headers(prom.options.headers);
        headers.set(HttpHeaders.AUTHORIZATION, `Bearer ${accessToken}`);
        this.request(prom.method, prom.url, {
          ...prom.options,
          headers,
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
    return await response.json();
  }

  /**
   * Extract tokens and device ID from response headers and save them
   * Direct mapping: authorization header → TokenType.AUTHORIZATION, refresh-token header → TokenType.REFRESH
   */
  private async extractAndSaveTokens(response: Response, url: string) {
    // Save tokens from auth endpoints
    if (
      url.includes("/auth/login") ||
      url.includes("/auth/refresh") ||
      url.includes("/otp/verify") ||
      url.includes("/auth/auto-login")
    ) {
      const newAccessToken = response.headers.get(HttpHeaders.AUTHORIZATION);
      const newRefreshToken = response.headers.get(HttpHeaders.REFRESH_TOKEN);
      const newDeviceId = response.headers.get(HttpHeaders.X_DEVICE_ID);

      if (newAccessToken) {
        await this.storage.set(TokenType.AUTHORIZATION, newAccessToken);
      }
      if (newRefreshToken) {
        await this.storage.set(TokenType.REFRESH, newRefreshToken);
      }
      if (newDeviceId) {
        // Store device ID using same key as header name for consistency
        await this.storage.set(HttpHeaders.X_DEVICE_ID, newDeviceId);
      }
    }
  }

  /**
   * Refresh access token using refresh token
   * Follows the SDK pattern: uses POST method structure but bypasses token injection
   * to avoid circular dependency (refresh endpoint doesn't require auth)
   */
  private async refreshToken() {
    // Use type-safe storage key constant
    const refreshTokenValue = await this.storage.get(TokenType.REFRESH);

    if (!refreshTokenValue || typeof refreshTokenValue !== "string") {
      throw new Error("Unauthorized User. Please log in again.");
    }

    // Follow SDK pattern: use same structure as POST but without token injection
    const body: { refreshToken: string } = { refreshToken: refreshTokenValue };

    const headers = new Headers({
      ...this.defaultHeaders,
    });

    // Set Content-Type following SDK pattern
    if (!headers.has(HttpHeaders.CONTENT_TYPE)) {
      headers.set(HttpHeaders.CONTENT_TYPE, "application/json");
    }

    // Make request following SDK pattern (POST method)
    const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Refresh token failed");
    }

    // Use existing extractAndSaveTokens method to handle token extraction and storage
    await this.extractAndSaveTokens(response, "/api/v1/auth/refresh");
  }

  /**
   * Main request method with automatic token injection and refresh
   */
  async request<T>(method: HttpMethod, url: string, options: RequestOptions = {}): Promise<IApiResponse<T>> {
    try {
      const { body, _retry, ...fetchOptions } = options;

      // Use type-safe storage key constant
      const accessTokenValue = await this.storage.get(TokenType.AUTHORIZATION);
      const accessToken = accessTokenValue ? String(accessTokenValue) : null;

      // Get device ID from storage
      const deviceIdValue = await this.storage.get(HttpHeaders.X_DEVICE_ID);
      const deviceId = deviceIdValue ? String(deviceIdValue) : null;

      const headers = new Headers({
        ...this.defaultHeaders,
        ...fetchOptions.headers,
      });

      if (!headers.has(HttpHeaders.CONTENT_TYPE) && method !== "GET") {
        headers.set(HttpHeaders.CONTENT_TYPE, "application/json");
      }

      if (accessToken && !headers.has(HttpHeaders.AUTHORIZATION)) {
        headers.set(HttpHeaders.AUTHORIZATION, `Bearer ${accessToken}`);
      }

      // Send device ID in request headers if available
      if (deviceId && !headers.has(HttpHeaders.X_DEVICE_ID)) {
        headers.set(HttpHeaders.X_DEVICE_ID, deviceId);
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
          await this.refreshToken();

          const accessTokenValue = await this.storage.get(TokenType.AUTHORIZATION);

          if (accessTokenValue && typeof accessTokenValue === "string") {
            this.processQueue(null, accessTokenValue);
          } else {
            this.processQueue(new Error("Access token not found"), undefined);
          }
          return this.request<T>(method, url, { ...options, _retry: true });
        } catch (refreshError) {
          this.processQueue(refreshError, undefined);
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

    if (!headers.has(HttpHeaders.CONTENT_TYPE) && method !== "GET") {
      headers.set(HttpHeaders.CONTENT_TYPE, "application/json");
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
    // Use type-safe storage key constant
    const token = await this.storage.get(TokenType.AUTHORIZATION);
    return !!token && typeof token === "string";
  }
}
