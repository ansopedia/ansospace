import { HttpClient } from "./httpClient";
import { AuthResource } from "./resources/authResource";
import { UserResource } from "./resources/userResource";
import type { AnsospaceConfig } from "./types";

/**
 * AnsospaceSDK - Main SDK class that orchestrates all resources
 *
 * @example
 * ```ts
 * import { AnsospaceSDK } from "@ansospace/sdk";
 * import { BrowserStorageAdapter, TokenManager } from "@ansospace/react";
 *
 * const sdk = new AnsospaceSDK({
 *   baseUrl: "https://api.ansospace.com",
 *   storage: new TokenManager(new BrowserStorageAdapter()),
 * });
 *
 * const user = await sdk.users.getProfile();
 * ```
 */
export class AnsospaceSDK {
  private config: AnsospaceConfig;
  private httpClient: HttpClient;
  public auth: AuthResource;
  public users: UserResource;

  constructor(config: AnsospaceConfig) {
    this.config = config;
    this.httpClient = new HttpClient(config.baseUrl, config.storage, config.defaultHeaders);
    this.auth = new AuthResource(this.httpClient);
    this.users = new UserResource(this.httpClient);
  }

  /**
   * Get the HTTP client instance (for advanced usage)
   */
  get client(): HttpClient {
    return this.httpClient;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AnsospaceConfig>): void {
    this.config = { ...this.config, ...config };

    if (config.baseUrl) {
      this.httpClient.setBaseUrl(config.baseUrl);
    }

    if (config.defaultHeaders) {
      this.httpClient.setDefaultHeaders(config.defaultHeaders);
    }

    // If storage changed, we need to recreate the HTTP client
    if (config.storage) {
      this.httpClient = new HttpClient(this.config.baseUrl, config.storage, this.config.defaultHeaders);
      // Recreate resources with new HTTP client
      this.auth = new AuthResource(this.httpClient);
      this.users = new UserResource(this.httpClient);
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): AnsospaceConfig {
    return { ...this.config };
  }
}
