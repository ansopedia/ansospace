import type { AnsospaceStorage, IApiResponse } from "@ansospace/types";

/**
 * Configuration for AnsospaceSDK
 */
export interface AnsospaceConfig {
  /**
   * Base URL for the API
   */
  baseUrl: string;
  /**
   * Storage implementation for tokens and auth data
   * Can be implemented using localStorage, SecureStore, cookies, etc.
   */
  storage: AnsospaceStorage;
  /**
   * Default headers to include in all requests
   */
  defaultHeaders?: Record<string, string>;
}

/**
 * HTTP Method types
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Request options for HTTP client
 */
export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  _retry?: boolean;
}

/**
 * Queue item for failed requests during token refresh
 */
interface QueueItem<T = unknown> {
  url: string;
  method: HttpMethod;
  options: RequestOptions;
  resolve: (value: IApiResponse<T>) => void;
  reject: (error: unknown) => void;
}

export type { QueueItem };
