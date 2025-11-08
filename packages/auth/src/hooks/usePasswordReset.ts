import { OtpEvent, OtpVerifyEvent } from "@ansospace/types";

import { useAuth } from "./useAuth";

export const usePasswordReset = () => {
  const { authService } = useAuth();

  const sendPasswordResetOtp = async (body: OtpEvent) => {
    // Assuming body.otpType is FORGET_PASSWORD_OTP
    try {
      const response = await authService.sendOtp(body);
      if (response.status !== "success") {
        throw new Error(response.message);
      }
      return response;
    } catch (error) {
      console.error("Send password reset OTP failed:", error);
      throw error;
    }
  };

  const verifyPasswordResetOtp = async (body: OtpVerifyEvent) => {
    try {
      const response = await authService.verifyOtp<{ actionToken: string }>(body);
      if (response.status !== "success") {
        throw new Error(response.message);
      }
      return response.data.actionToken;
    } catch (error) {
      console.error("Verify password reset OTP failed:", error);
      throw error;
    }
  };

  const resetPassword = async (actionToken: string, newPassword: string) => {
    try {
      const response = await authService.resetPassword({ actionToken, newPassword });
      if (response.status !== "success") {
        throw new Error(response.message);
      }
      return response;
    } catch (error) {
      console.error("Reset password failed:", error);
      throw error;
    }
  };

  return { sendPasswordResetOtp, verifyPasswordResetOtp, resetPassword };
};
