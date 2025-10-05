import {
  IApiResponse,
  Login,
  LoginResponse,
  OtpEvent,
  OtpVerifyEvent,
  RegisterSchema,
  SignUpResponse,
} from "@ansospace/types";

import { ApiClient } from "../apiClient";

export class AuthService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async loginUser(body: Login): Promise<IApiResponse<LoginResponse>> {
    const url = "/api/v1/auth/login";
    return this.apiClient.POST<LoginResponse>(url, { body });
  }

  async signup(body: RegisterSchema): Promise<IApiResponse<SignUpResponse>> {
    const url = "/api/v1/auth/register";
    return this.apiClient.POST(url, { body });
  }

  async checkUsernameAvailability(data: { username: string }): Promise<IApiResponse<{ isAvailable: boolean }>> {
    const url = `/api/v1/users/check-username/${data.username}`;
    return this.apiClient.GET<{ isAvailable: boolean }>(url);
  }

  async logout(): Promise<IApiResponse<void>> {
    const url = "/api/v1/auth/logout";
    return this.apiClient.POST<void>(url);
  }

  async verifyOtp<T>(body: OtpVerifyEvent): Promise<IApiResponse<{ actionToken: T }>> {
    const url = "/api/v1/otp/verify";
    return this.apiClient.POST(url, { body });
  }

  async sendOtp(body: OtpEvent): Promise<IApiResponse<{ token?: string }>> {
    const url = "/api/v1/otp";
    return this.apiClient.POST(url, { body });
  }

  async getPermissions(body: OtpEvent): Promise<IApiResponse<{ token?: string }>> {
    const url = "/api/v1/otp";
    return this.apiClient.POST(url, { body });
  }
}
