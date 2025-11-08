import { TOKEN_STORAGE_KEYS } from "./constants";
import { createStorageAdapter } from "./storage/factory";
import { AuthConfig } from "./types";
import { TokenManager } from "./utils/tokenManager";

/**
 * Creates a default authentication configuration.
 *
 * This function simplifies the setup process by automatically selecting the best
 * storage adapter for the current environment (browser, React Native, or server).
 * It also allows for customization by accepting an optional configuration object.
 *
 * @param {string} baseUrl - The base URL for the API.
 * @param {Partial<AuthConfig>} [customConfig] - Optional custom configuration to override defaults.
 * @returns {AuthConfig} The complete authentication configuration.
 */
export const createAuthConfig = (baseUrl: string, customConfig?: Partial<AuthConfig>): AuthConfig => {
  const defaultConfig: AuthConfig = {
    baseUrl,
    tokenStorage: new TokenManager(
      createStorageAdapter(), // Dynamically create storage adapter
      TOKEN_STORAGE_KEYS.AUTHORIZATION,
      TOKEN_STORAGE_KEYS.REFRESH_TOKEN,
      TOKEN_STORAGE_KEYS.USER_ID
    ),
  };

  return { ...defaultConfig, ...customConfig };
};
