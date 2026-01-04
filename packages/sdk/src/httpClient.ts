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
  private isServerSide: boolean;

  constructor(baseUrl: string, storage: AnsospaceStorage, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.storage = storage;
    this.defaultHeaders = defaultHeaders;
    // Detect if running on server side
    this.isServerSide = typeof window === "undefined";
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
   * Clear all authentication data from storage
   */
  public async clearAuthSession(): Promise<void> {
    await this.storage.remove(TokenType.AUTHORIZATION);
    await this.storage.remove(TokenType.REFRESH);
    // keep the Device ID for tracking the same device across logins.
  }

  /**
   * Extract tokens and device ID from response headers and save them
   *
   * IMPORTANT: Only works on client-side or in Server Actions/Route Handlers
   * Will skip saving on server-side rendering to avoid Next.js cookie errors
   */
  private async extractAndSaveTokens(response: Response, url: string, body?: unknown) {
    const responseBody = body as
      | {
          data?: { accessToken?: string; refreshToken?: string; deviceId?: string };
          accessToken?: string;
          refreshToken?: string;
          deviceId?: string;
        }
      | undefined;
    // Skip token saving during server-side rendering IF it's likely to cause errors
    // However, in Middleware or Server Actions, this is often fine if the storage adapter handles it.
    // For now, we trust the storage adapter to handle isServerSide logic if needed.

    // Save tokens from auth endpoints
    if (
      url.includes("/auth/login") ||
      url.includes("/auth/refresh") ||
      url.includes("/otp/verify") ||
      url.includes("/auth/auto-login")
    ) {
      const newAccessToken =
        response.headers.get(HttpHeaders.AUTHORIZATION) ||
        (responseBody && responseBody.data?.accessToken) ||
        (responseBody && responseBody.accessToken);
      const newRefreshToken =
        response.headers.get(HttpHeaders.REFRESH_TOKEN) ||
        (responseBody && responseBody.data?.refreshToken) ||
        (responseBody && responseBody.refreshToken);
      const newDeviceId =
        response.headers.get(HttpHeaders.X_DEVICE_ID) ||
        (responseBody && responseBody.data?.deviceId) ||
        (responseBody && responseBody.deviceId);

      if (newAccessToken) await this.storage.set(TokenType.AUTHORIZATION, newAccessToken);
      if (newRefreshToken) await this.storage.set(TokenType.REFRESH, newRefreshToken);
      if (newDeviceId) await this.storage.set(HttpHeaders.X_DEVICE_ID, newDeviceId);
    }
  }

  /**
   * Refresh access token using refresh token
   *
   * IMPORTANT: This should not be called during server-side rendering
   * Use Server Actions for token refresh on the server
   */
  private async refreshToken() {
    // Token refresh is now allowed on server-side (e.g. in Middleware or Server Actions)
    // The storage adapter MUST handle cookie setting correctly.

    const refreshTokenValue = await this.storage.get(TokenType.REFRESH);

    if (!refreshTokenValue || typeof refreshTokenValue !== "string") {
      throw new Error("Unauthorized User. Please log in again.");
    }

    const body: { refreshToken: string } = { refreshToken: refreshTokenValue };

    const headers = new Headers({
      ...this.defaultHeaders,
    });

    if (!headers.has(HttpHeaders.CONTENT_TYPE)) {
      headers.set(HttpHeaders.CONTENT_TYPE, "application/json");
    }

    const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      credentials: "include", // Critical for Cookie Refresh
    });

    if (response.ok) {
      const result = await this.handleResponse(response);
      await this.extractAndSaveTokens(response, "/api/v1/auth/refresh", result);
      return;
    }

    const errorData = await this.handleResponse(response);

    if (errorData.status === "failed" && errorData.code === "session_inactive") {
      await this.clearAuthSession();
    }

    throw new Error(errorData.message || "Session expired. Please login again.");
  }

  /**
   * Prepare headers with tokens and device ID
   */
  private async prepareHeaders(method: HttpMethod, fetchOptions: RequestOptions): Promise<Headers> {
    const accessTokenValue = await this.storage.get(TokenType.AUTHORIZATION);
    const accessToken = accessTokenValue ? String(accessTokenValue) : null;

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

    if (deviceId && !headers.has(HttpHeaders.X_DEVICE_ID)) {
      headers.set(HttpHeaders.X_DEVICE_ID, deviceId);
    }

    return headers;
  }

  /**
   * Handle 401 response with token refresh
   * Only attempts refresh on client-side; throws error on server-side
   */
  private async handle401Error<T>(
    method: HttpMethod,
    url: string,
    options: RequestOptions,
    _retry: boolean
  ): Promise<IApiResponse<T> | null> {
    if (url.includes("/auth/login")) {
      return null;
    }

    // On server-side, we now attempt token refresh if we're not currently refreshing.
    // This allows middleware and server-side components to automatically renew sessions.

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

  /**
   * Handle network errors
   */
  private handleNetworkError<T>(error: unknown): IApiResponse<T> | null {
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
    return null;
  }

  /**
   * Main request method with automatic token injection and refresh
   */
  async request<T>(method: HttpMethod, url: string, options: RequestOptions = {}): Promise<IApiResponse<T>> {
    try {
      const { body, _retry = false, ...fetchOptions } = options;

      const headers = await this.prepareHeaders(method, fetchOptions);

      const response = await fetch(`${this.baseUrl}${url}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include", // Critical for Cookie Refresh
        ...fetchOptions,
      });

      const result = await this.handleResponse<T>(response);

      await this.extractAndSaveTokens(response, url, result);

      if (response.status === 401 && !_retry) {
        const errorResponse = await this.handle401Error<T>(method, url, options, _retry);
        if (errorResponse !== null) {
          return errorResponse as IApiResponse<T>;
        }
      }

      if (result.status === "failed" && result.code === "resource_not_found") {
        throw new Error(result.message);
      }

      return result;
    } catch (error: unknown) {
      const networkError = this.handleNetworkError<T>(error);
      if (networkError !== null) {
        return networkError;
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
      credentials: "include", // Critical for Cookie Refresh
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
}
