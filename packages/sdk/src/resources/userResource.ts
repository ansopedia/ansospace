import type { GetUser, IApiResponse, UpdateUser } from "@ansospace/types";

import { HttpClient } from "../httpClient";

/**
 * UserResource - handles all user-related API calls
 */
export class UserResource {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<IApiResponse<GetUser>> {
    const url = "/api/v1/users/profile";
    return this.httpClient.GET<GetUser>(url);
  }

  /**
   * Update user profile
   */
  async updateProfile(body: UpdateUser): Promise<IApiResponse<GetUser>> {
    const url = "/api/v1/users/profile";
    return this.httpClient.PUT<GetUser>(url, { body });
  }

  /**
   * Check username availability
   */
  async checkUsernameAvailability(username: string): Promise<IApiResponse<{ isAvailable: boolean }>> {
    const url = `/api/v1/users/check-username/${username}`;
    return this.httpClient.GET<{ isAvailable: boolean }>(url);
  }
}
