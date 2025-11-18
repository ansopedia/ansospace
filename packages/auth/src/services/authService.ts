import {
  IApiResponse,
  Login,
  LoginResponse,
  OtpEvent,
  OtpVerifyEvent,
  RegisterResponse,
  RegisterSchema,
  ResetPassword,
  SendOtpResponse,
  VerifyOtpResponse,
} from "@ansospace/types";

import { ApiClient } from "../apiClient";

export class AuthService {
  private _apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this._apiClient = apiClient;
  }

  async login(body: Login): Promise<IApiResponse<LoginResponse>> {
    const url = "/api/v1/auth/login";
    return this._apiClient.POST<LoginResponse>(url, { body });
  }

  async register(body: RegisterSchema): Promise<IApiResponse<RegisterResponse>> {
    const url = "/api/v1/auth/register";
    return this._apiClient.POST(url, { body });
  }

  async checkUsernameAvailability(data: { username: string }): Promise<IApiResponse<{ isAvailable: boolean }>> {
    const url = `/api/v1/users/check-username/${data.username}`;
    return this._apiClient.GET<{ isAvailable: boolean }>(url);
  }

  async logout(): Promise<IApiResponse<void>> {
    const url = "/api/v1/auth/logout";
    return this._apiClient.POST<void>(url);
  }

  async verifyOtp(body: OtpVerifyEvent): Promise<IApiResponse<VerifyOtpResponse>> {
    const url = "/api/v1/otp/verify";
    return this._apiClient.POST(url, { body });
  }

  async sendOtp(body: OtpEvent): Promise<IApiResponse<SendOtpResponse>> {
    const url = "/api/v1/otp";
    return this._apiClient.POST(url, { body });
  }

  async getPermissions(): Promise<IApiResponse<{ permissions: string[] }>> {
    const url = "/api/v1/permissions";
    return this._apiClient.GET(url, {});
  }

  async resetPassword(body: ResetPassword): Promise<IApiResponse<void>> {
    const url = "/api/v1/auth/reset-password";
    return this._apiClient.POST<void>(url, { body });
  }

  async autoLogin(body: { actionToken: string }): Promise<IApiResponse<LoginResponse>> {
    const url = "/api/v1/auth/auto-login";
    return this._apiClient.POST(url, { body });
  }
}
