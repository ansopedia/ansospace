/* eslint-disable @typescript-eslint/no-explicit-any */
import { IApiResponse } from "@ansospace/types";

import { AnsospaceStorage } from "./types";

interface RequestOptions extends RequestInit {
  body?: any;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  _retry?: boolean;
}

interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

type Method = "GET" | "POST" | "PUT" | "DELETE";
type URL = string;

interface QueueItem {
  url: URL;
  method: Method;
  options: RequestOptions;
  resolve: (value: any) => void;
  reject: (error: unknown) => void;
}

export class ApiClient {
  private baseUrl: string;
  private tokenStorage: AnsospaceStorage;
  private isRefreshing = false;
  private failedQueue: QueueItem[] = [];
  private defaultHeaders: Record<string, string> = {};

  constructor(baseUrl: string, tokenStorage: AnsospaceStorage, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.tokenStorage = tokenStorage;
    this.defaultHeaders = defaultHeaders;
  }

  /**
   * Set default headers for all requests
   */
  public setDefaultHeaders(headers: Record<string, string>) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Get the current default headers
   */
  public getDefaultHeaders(): Record<string, string> {
    return { ...this.defaultHeaders };
  }

  private processQueue = (error: unknown, accessToken: string | null = null) => {
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
          .then(prom.resolve)
          .catch(prom.reject);
      }
    });

    this.failedQueue = [];
  };

  private async handleResponse<T>(response: Response): Promise<IApiResponse<T>> {
    const data = await response.json();
    return data;
  }

  async request<T>(method: Method, url: URL, options: RequestOptions = {}): Promise<IApiResponse<T>> {
    try {
      const { body, _retry, ...fetchOptions } = options;

      const accessToken = await this.tokenStorage.get("access");

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

      // Save tokens from auth endpoints
      if (url.includes("/auth/login") || url.includes("/auth/refresh") || url.includes("/otp/verify")) {
        const newAccessToken = response.headers.get("authorization");
        const newRefreshToken = response.headers.get("refresh-token");

        if (newAccessToken) {
          await this.tokenStorage.set("access", newAccessToken);
        }
        if (newRefreshToken) {
          await this.tokenStorage.set("refresh", newRefreshToken);
        }
      }

      // 401 Handling and Refresh Token Logic
      if (response.status === 401 && !_retry) {
        if (url.includes("/auth/login")) {
          return result;
        }

        if (this.isRefreshing) {
          return new Promise<IApiResponse<T>>((resolve, reject) => {
            this.failedQueue.push({ url, method, options, resolve, reject });
          });
        }

        this.isRefreshing = true;

        try {
          const refreshToken = await this.tokenStorage.get("refresh");

          if (!refreshToken) {
            throw new Error("Unauthorized User. Please log in again.");
          }

          const refreshResponse = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const newAccessToken = refreshResponse.headers.get("authorization");
            const newRefreshToken = refreshResponse.headers.get("refresh-token");

            if (newAccessToken && newRefreshToken) {
              await this.tokenStorage.set("access", newAccessToken);
              await this.tokenStorage.set("refresh", newRefreshToken);

              this.processQueue(null, newAccessToken);

              return this.request<T>(method, url, { ...options, _retry: true });
            } else {
              this.processQueue(new Error("Refresh token response missing tokens"), null);
              throw new Error("Refresh token response missing tokens");
            }
          } else {
            this.processQueue(new Error("Refresh token failed"), null);
            throw new Error("Refresh token failed");
          }
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
    } catch (error: any) {
      if (error.cause?.code === "ECONNREFUSED" || error.message === "Failed to fetch") {
        return {
          status: "failed",
          message: "Could not connect to the server. Please check your network connection and try again.",
          code: "network_error",
        };
      }
      throw error;
    }
  }

  async GET<T>(url: string, options: RequestOptions = {}): Promise<IApiResponse<T>> {
    return this.request<T>("GET", url, options);
  }

  async POST<T>(url: string, options: RequestOptions = {}): Promise<IApiResponse<T>> {
    return this.request<T>("POST", url, options);
  }

  async PUT<T>(url: string, options: RequestOptions = {}): Promise<IApiResponse<T>> {
    return this.request<T>("PUT", url, options);
  }

  async DELETE<T>(url: string, options: RequestOptions = {}): Promise<IApiResponse<T>> {
    return this.request<T>("DELETE", url, options);
  }

  /**
   * Make a request without automatic token handling (useful for public endpoints)
   */
  async publicRequest<T>(method: Method, url: URL, options: RequestOptions = {}): Promise<IApiResponse<T>> {
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
  public setBaseUrl(baseUrl: string) {
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
    const token = await this.tokenStorage.get("access");
    return !!token;
  }
}
