import type {
  AutoLoginRequest,
  ChangePasswordRequest,
  IApiResponse,
  LoginRequest,
  LoginResponse,
  ObjectId,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  SendOtpRequest,
  SendOtpResponse,
  Session,
  SessionQueryOptions,
  UserAccessControlProfile,
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
   * Change password
   */
  async changePassword(body: ChangePasswordRequest): Promise<IApiResponse<void>> {
    const url = "/api/v1/auth/change-password";
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
   * Fetches the master list of ALL available permissions in the system.
   * Usage: Admin "Create Role" screens to render checkboxes.
   */
  async getAllSystemPermissions(): Promise<IApiResponse<{ permissions: string[] }>> {
    const url = "/api/v1/permissions";
    return this.httpClient.GET<{ permissions: string[] }>(url);
  }

  /**
   * Fetches the current user's complete authorization context (Identity + Roles + Permissions).
   * Usage: App initialization to hide/show UI elements.
   */
  async getMyAccessProfile(): Promise<IApiResponse<UserAccessControlProfile>> {
    const url = "/api/v1/profile/access-control";
    return this.httpClient.GET<UserAccessControlProfile>(url);
  }

  /**
   * Fetches the access control profile for a specific user.
   * Usage: Admin Debugging/Support (View what a user sees).
   * @param userId - The ID of the user to inspect
   */
  async getUserAccessProfile(userId: string): Promise<IApiResponse<UserAccessControlProfile>> {
    const url = `/api/v1/users/${userId}/access-control`;
    return this.httpClient.GET<UserAccessControlProfile>(url);
  }

  /**
   * Fetches a list of all active sessions (devices) for the current user.
   * Usage: Display "Active Devices" list in Settings/Profile page.
   * Route: GET /api/v1/sessions
   */
  async getActiveSessions(options?: Partial<SessionQueryOptions>): Promise<IApiResponse<Session[]>> {
    const params = new URLSearchParams();

    if (options) {
      if (options.limit) params.append("limit", options.limit.toString());
      if (options.skip) params.append("skip", options.skip.toString());
      if (options.sortBy) params.append("sortBy", options.sortBy);
      if (options.order) params.append("order", options.order);
    }

    // Construct URL
    const queryString = params.toString();
    const url = queryString ? `/api/v1/sessions?${queryString}` : "/api/v1/sessions";

    return this.httpClient.GET<Session[]>(url);
  }

  /**
   * Logs out the current device only.
   * Usage: Standard "Logout" button in the Navbar/Sidebar.
   * Route: DELETE /api/v1/sessions/current
   */
  async logout(): Promise<IApiResponse<void>> {
    const url = "/api/v1/sessions/current";
    return this.httpClient.DELETE<void>(url);
  }

  /**
   * Revokes all active sessions for the user (Nuclear Option).
   * Usage: "Log out of all devices" security button (e.g., after password change).
   * Route: DELETE /api/v1/sessions
   */
  async revokeAllSessions(): Promise<IApiResponse<void>> {
    const url = "/api/v1/sessions";
    return this.httpClient.DELETE<void>(url);
  }

  /**
   * Revokes all sessions EXCEPT the current one.
   * Usage: "Sign out of other devices" button.
   * Route: DELETE /api/v1/sessions/others
   */
  async revokeOtherSessions(): Promise<IApiResponse<void>> {
    const url = "/api/v1/sessions/others";
    return this.httpClient.DELETE<void>(url);
  }

  /**
   * Revokes a specific session by its ID.
   * Usage: Clicking "Remove" next to a specific "iPhone 12" in the device list.
   * Route: DELETE /api/v1/sessions/:sessionId
   */
  async revokeSessionById(sessionId: ObjectId): Promise<IApiResponse<void>> {
    // const url = `/api/v1/sessions/${sessionId}`;
    // return this.httpClient.DELETE<void>(url);
    throw new Error("Method not implemented.");
  }
}
