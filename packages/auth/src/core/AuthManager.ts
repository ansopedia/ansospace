import { ApiClient } from "../apiClient";
import { TOKEN_STORAGE_KEYS } from "../constants";
import { AuthService } from "../services/authService";
import { InMemoryStorageAdapter } from "../storage/inMemory";
import type { AuthConfig } from "../types";
// import { getItem, removeItem, setItem } from "../utils/storage";
import { TokenManager } from "../utils/tokenManager";

export const defaultConfig: AuthConfig = {
  baseUrl: "https://api.ansospace.dev",
  tokenStorage: new TokenManager(
    new InMemoryStorageAdapter(),
    TOKEN_STORAGE_KEYS.AUTHORIZATION,
    TOKEN_STORAGE_KEYS.REFRESH_TOKEN,
    TOKEN_STORAGE_KEYS.USER_ID
  ),
};

/**
 * AuthManager: Singleton class to manage config + token operations
 */
export class AuthManager {
  private static _instance: AuthManager;
  private _config: AuthConfig;

  public auth: AuthService;

  private constructor(config?: Partial<AuthConfig>) {
    this._config = { ...defaultConfig, ...config };
    const apiClient = new ApiClient(this._config.baseUrl, this._config.tokenStorage);

    this.auth = new AuthService(apiClient);
  }

  /** Initialize the singleton (only once per runtime) */
  public static init(config?: Partial<AuthConfig>) {
    if (!AuthManager._instance) {
      AuthManager._instance = new AuthManager(config);
    } else if (config) {
      AuthManager._instance._config = { ...AuthManager._instance._config, ...config };
    }
    return AuthManager._instance;
  }

  /** Get the active instance (throws if not initialized) */
  public static get instance(): AuthManager {
    if (!AuthManager._instance) {
      throw new Error("AuthManager not initialized. Call AuthManager.init(config) first.");
    }
    return AuthManager._instance;
  }

  /** Access config or update it */
  public get config(): AuthConfig {
    return this._config;
  }

  public setConfig(newConfig: Partial<AuthConfig>) {
    this._config = { ...this._config, ...newConfig };
  }

  /** Helper to get config value by key */
  public get<K extends keyof AuthConfig>(key: K): AuthConfig[K] {
    return this._config[key];
  }

  // ======================
  // Auth token management
  // ======================

  public async getToken(): Promise<string | null> {
    return await this._config.tokenStorage.getAccessToken();
  }

  public async setToken(token: string) {
    await this._config.tokenStorage.saveAccessToken(token);
  }

  public async clearToken() {
    await this._config.tokenStorage.deleteTokens();
  }
}
