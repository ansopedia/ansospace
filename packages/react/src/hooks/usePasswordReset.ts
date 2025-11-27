import { useCallback, useState } from "react";

import type { OtpEvent, OtpVerifyEvent, ResetPassword, SendOtpResponse } from "@ansospace/types";
import { IApiResponse } from "@ansospace/types";

import { useAuthContext } from "../providers/AuthProvider";

export const usePasswordReset = () => {
  const { sendOtp: sendOtpFn, verifyOtp: verifyOtpFn, sdk } = useAuthContext();

  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [sendError, setSendError] = useState<Error | null>(null);
  const [verifyError, setVerifyError] = useState<Error | null>(null);
  const [resetError, setResetError] = useState<Error | null>(null);

  const [sendData, setSendData] = useState<IApiResponse<SendOtpResponse> | null>(null);
  const [verifyData, setVerifyData] = useState<IApiResponse<{ actionToken: string }> | null>(null);
  const [resetData, setResetData] = useState<IApiResponse<void> | null>(null);

  const sendPasswordResetOtp = useCallback(
    async (body: OtpEvent): Promise<IApiResponse<SendOtpResponse>> => {
      setSendLoading(true);
      setSendError(null);
      setSendData(null);
      try {
        const response = await sendOtpFn(body);
        setSendData(response);
        return response;
      } catch (err) {
        const e = err instanceof Error ? err : new Error("Send password reset OTP failed");
        setSendError(e);
        throw e;
      } finally {
        setSendLoading(false);
      }
    },
    [sendOtpFn]
  );

  const verifyPasswordResetOtp = useCallback(
    async (body: Omit<OtpVerifyEvent, "token">): Promise<IApiResponse<{ actionToken: string }>> => {
      setVerifyLoading(true);
      setVerifyError(null);
      setVerifyData(null);
      try {
        // verifyOtpFn from context already handles getting the token from storage
        const response = await verifyOtpFn(body);
        setVerifyData(response);
        return response as IApiResponse<{ actionToken: string }>;
      } catch (err) {
        const e = err instanceof Error ? err : new Error("Verify password reset OTP failed");
        setVerifyError(e);
        throw e;
      } finally {
        setVerifyLoading(false);
      }
    },
    [verifyOtpFn]
  );

  const resetPassword = useCallback(
    async (body: ResetPassword): Promise<IApiResponse<void>> => {
      setResetLoading(true);
      setResetError(null);
      setResetData(null);
      try {
        const response = await sdk.auth.resetPassword(body);
        setResetData(response);
        return response;
      } catch (err) {
        const e = err instanceof Error ? err : new Error("Reset password failed");
        setResetError(e);
        throw e;
      } finally {
        setResetLoading(false);
      }
    },
    [sdk]
  );

  return {
    sendPasswordResetOtp,
    verifyPasswordResetOtp,
    resetPassword,
    sendLoading,
    verifyLoading,
    resetLoading,
    sendError,
    verifyError,
    resetError,
    sendData,
    verifyData,
    resetData,
  };
};
