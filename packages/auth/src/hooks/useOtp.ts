import { useCallback, useState } from "react";

import type { OtpEvent, OtpVerifyEvent, SendOtpResponse, VerifyOtpResponse } from "@ansospace/types";
import { IApiResponse, NotificationType } from "@ansospace/types";

import { useAuthProviderContext } from "../providers/AuthProvider";

export const useOtp = () => {
  const { sendOtp: sendOtpFn, verifyOtp: verifyOtpFn, autoLogin: autoLoginFn } = useAuthProviderContext();

  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [sendOtpError, setSendOtpError] = useState<Error | null>(null);
  const [verifyOtpError, setVerifyOtpError] = useState<Error | null>(null);
  const [sendOtpData, setSendOtpData] = useState<IApiResponse<SendOtpResponse> | null>(null);
  const [verifyOtpData, setVerifyOtpData] = useState<IApiResponse<VerifyOtpResponse> | null>(null);

  const sendOtp = useCallback(
    async (body: OtpEvent): Promise<IApiResponse<SendOtpResponse>> => {
      setSendOtpLoading(true);
      setSendOtpError(null);
      setSendOtpData(null);
      try {
        const response = await sendOtpFn(body);
        setSendOtpData(response);
        return response;
      } catch (err) {
        const e = err instanceof Error ? err : new Error("Send OTP failed");
        setSendOtpError(e);
        throw e;
      } finally {
        setSendOtpLoading(false);
      }
    },
    [sendOtpFn]
  );

  const verifyOtp = useCallback(
    async (body: Omit<OtpVerifyEvent, "token">): Promise<IApiResponse<{ actionToken: string }>> => {
      setVerifyOtpLoading(true);
      setVerifyOtpError(null);
      setVerifyOtpData(null);
      try {
        const response = await verifyOtpFn(body);
        setVerifyOtpData(response);
        if (response.status === "success" && body.otpType === NotificationType.EMAIL_VERIFICATION_OTP) {
          await autoLoginFn({ actionToken: response.data.actionToken });
        }
        return response;
      } catch (err) {
        const e = err instanceof Error ? err : new Error("Verify OTP failed");
        setVerifyOtpError(e);
        throw e;
      } finally {
        setVerifyOtpLoading(false);
      }
    },
    [verifyOtpFn, autoLoginFn]
  );

  return {
    sendOtp,
    verifyOtp,
    sendOtpLoading,
    verifyOtpLoading,
    sendOtpError,
    verifyOtpError,
    sendOtpData,
    verifyOtpData,
  };
};
