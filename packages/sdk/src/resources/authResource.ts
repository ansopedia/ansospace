import type {
  AutoLoginRequest,
  IApiResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@ansospace/types";

import { HttpClient } from "../httpClient";

/**
 * AuthResource - handles all authentication-related API calls
 */
export class AuthResource {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Login user
   */
  async login(body: LoginRequest): Promise<IApiResponse<LoginResponse>> {
    const url = "/api/v1/auth/login";
    return this.httpClient.POST<LoginResponse>(url, { body });
  }

  /**
   * Register new user
   */
  async register(body: RegisterRequest): Promise<IApiResponse<RegisterResponse>> {
    const url = "/api/v1/auth/register";
    return this.httpClient.POST<RegisterResponse>(url, { body });
  }

  /**
   * Logout user
   */
  async logout(): Promise<IApiResponse<void>> {
    const url = "/api/v1/auth/logout";
    return this.httpClient.POST<void>(url);
  }

  /**
   * Verify OTP
   */
  async verifyOtp(body: VerifyOtpRequest): Promise<IApiResponse<VerifyOtpResponse>> {
    const url = "/api/v1/otp/verify";
    return this.httpClient.POST<VerifyOtpResponse>(url, { body });
  }

  /**
   * Send OTP
   */
  async sendOtp(body: SendOtpRequest): Promise<IApiResponse<SendOtpResponse>> {
    const url = "/api/v1/otp";
    return this.httpClient.POST<SendOtpResponse>(url, { body });
  }

  /**
   * Reset password
   */
  async resetPassword(body: ResetPasswordRequest): Promise<IApiResponse<void>> {
    const url = "/api/v1/auth/reset-password";
    return this.httpClient.POST<void>(url, { body });
  }

  /**
   * Auto login with action token
   */
  async autoLogin(body: AutoLoginRequest): Promise<IApiResponse<LoginResponse>> {
    const url = "/api/v1/auth/auto-login";
    return this.httpClient.POST<LoginResponse>(url, { body });
  }

  /**
   * Refresh access token using refresh token
   * Note: This method uses publicRequest to avoid token injection and handles token extraction manually
   */
  async refreshToken(body: RefreshTokenRequest): Promise<IApiResponse<void>> {
    const url = "/api/v1/auth/refresh";
    return this.httpClient.POST<void>(url, { body });
  }

  /**
   * Get user permissions
   */
  async getPermissions(): Promise<IApiResponse<{ permissions: string[] }>> {
    const url = "/api/v1/permissions";
    return this.httpClient.GET<{ permissions: string[] }>(url);
  }
}
