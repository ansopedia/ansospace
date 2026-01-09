/**
 * HTTP Header Names
 * Shared constants for consistent header naming across frontend and backend
 */
import { TokenType } from "./token";

/**
 * Standard HTTP header names used in AnsoSpace API
 * Note: HTTP headers are case-insensitive, but we use lowercase for consistency
 * with backend responses and storage keys (TokenType)
 */
export const HttpHeaders = {
  /**
   * Authorization header
   * Format: "Authorization: Bearer <token>"
   * Value matches TokenType.AUTHORIZATION for direct storage mapping
   */
  AUTHORIZATION: TokenType.AUTHORIZATION,

  /**
   * Refresh token header
   * Backend sends new refresh token in this header
   * Value matches TokenType.REFRESH for direct storage mapping
   */
  REFRESH_TOKEN: TokenType.REFRESH,

  /**
   * Device ID header (used in request and response headers)
   * Backend uses this to track device-specific sessions
   * Also used as storage key for device ID (matches AuthStorageKey)
   */
  X_DEVICE_ID: "x-device-id",

  /**
   * User ID header (used in response headers)
   * Backend sends user ID in this header
   * Value matches AuthStorageKey
   */
  USER_ID: "user-id",

  /**
   * Access-Control-Expose-Headers (used in response headers)
   * Backend sets this to expose custom headers to the client
   * Value: "set-cookie, authorization, refresh-token"
   */
  ACCESS_CONTROL_EXPOSE_HEADERS: "Access-Control-Expose-Headers",
  ACCESS_CONTROL_EXPOSE_HEADERS_VALUE: "set-cookie, authorization, refresh-token",

  /**
   * Content-Type header
   */
  CONTENT_TYPE: "Content-Type",
} as const;

/**
 * Type for HTTP header names
 */
export type HttpHeaderName = (typeof HttpHeaders)[keyof typeof HttpHeaders];
