import { ApiClient } from "../apiClient";
import { AuthService } from "../services/authService";
import { InMemoryStorageAdapter } from "../storage/inMemory";
import { type AuthConfig } from "../types";
import { TokenManager } from "../utils/tokenManager";

/**
 * Default configuration for AnsospaceAuth.
 * Can be overridden by passing a partial config to `AnsospaceAuth.init(config)`.
 */
export const defaultConfig: AuthConfig = {
  baseUrl: "https://api.ansospace.dev",
  storage: new TokenManager(new InMemoryStorageAdapter()),
};

/**
 *  AnsospaceAuth — A singleton class that manages:
 * - Configuration overrides 
 * - Token lifecycle management 
 * - API service instantiation 
 * Example: 
 * 
ts
 * AnsospaceAuth.init({ baseUrl: "https://staging.api.ansospace.dev" });
 * const auth = AnsospaceAuth.instance.auth;
 * await auth.login("user", "pass");
 *
*/
export class AnsospaceAuth {
  private static instanceRef?: AnsospaceAuth;

  private _config: AuthConfig;
  private _apiClient: ApiClient;
  private _authService: AuthService;

  private constructor(config?: Partial<AuthConfig>) {
    this._config = { ...defaultConfig, ...config };
    this._apiClient = new ApiClient(this._config.baseUrl, this._config.storage);
    this._authService = new AuthService(this._apiClient);
  }

  /**
   *  Initializes the singleton (only once per runtime).
   *  If already initialized, merges any new config values.
   */
  public static init(config?: Partial<AuthConfig>): AnsospaceAuth {
    if (!this.instanceRef) {
      this.instanceRef = new AnsospaceAuth(config);
    } else if (config) {
      this.instanceRef.updateConfig(config);
    }
    return this.instanceRef;
  }

  /**
   *  Returns the initialized instance.
   *  Throws if init() has not been called yet.
   */
  public static get instance(): AnsospaceAuth {
    if (!this.instanceRef) {
      throw new Error("AnsospaceAuth not initialized. Call AnsospaceAuth.init(config) first.");
    }
    return this.instanceRef;
  }

  // ======================
  // 🔧 Configuration
  // ======================

  /** Accessor for core services */
  get auth(): AuthService {
    return this._authService;
  }

  get apiClient(): ApiClient {
    return this._apiClient;
  }

  get storage() {
    return this._config.storage;
  }

  /** Merge new config and refresh dependent services if necessary */
  private updateConfig(newConfig: Partial<AuthConfig>) {
    const prevConfig = this._config;
    this._config = { ...prevConfig, ...newConfig };

    // Reinitialize services only if relevant config changed
    if (
      (newConfig.baseUrl && newConfig.baseUrl !== prevConfig.baseUrl) ||
      (newConfig.storage && newConfig.storage !== prevConfig.storage)
    ) {
      this._apiClient = new ApiClient(this._config.baseUrl, this._config.storage);
      this._authService = new AuthService(this._apiClient);
    }
  }

  // ======================
  // 🧩 Utility
  // ======================

  /** Destroy the singleton (useful in tests or SSR) */
  static reset() {
    this.instanceRef = undefined;
  }

  public async isAuthenticated(): Promise<boolean> {
    const token = await this.storage.get("access");
    if (!token) return false;

    try {
      // Optional: verify token structure or expiration if it’s a JWT
      const [, payload] = token.split(".");
      if (payload) {
        const { exp } = JSON.parse(atob(payload));
        if (exp && Date.now() >= exp * 1000) {
          await this.storage.remove("access");
          return false;
        }
      }
    } catch {
      // If invalid JWT structure, just return true if token exists
    }

    return true;
  }
}
