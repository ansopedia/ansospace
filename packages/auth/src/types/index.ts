import { TokenStorage } from "../utils/tokenManager";

export interface AuthConfig {
  baseUrl: string;
  tokenStorage: TokenStorage;
}
