import type { SendOtpRequest, VerifyOtpRequest } from "@ansospace/types";
import { TokenType, otpEvents } from "@ansospace/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AUTH_QUERY_KEYS } from "../../constants/queryKeys";
import { useAuthContext } from "../../providers/AuthProvider";

export const useOtpActions = () => {
  const { sdk, storage, updateUser } = useAuthContext();
  const queryClient = useQueryClient();

  const sendMutation = useMutation({
    mutationFn: (body: SendOtpRequest) => sdk.auth.sendOtp(body),
    onSuccess: async (response, variables) => {
      if (response.status === "success") {
        // Save token for the verify step
        await storage.set(TokenType.ACTION, response.data.actionToken);
        if (variables.email) {
          await storage.set("userEmail", variables.email);
          updateUser({
            kind: "PARTIAL",
            email: variables.email,
          });
        }
      }
    },
  });

  // 🔹 Mutation 2: Verify OTP (With Auto-Login Logic)
  const verifyMutation = useMutation({
    mutationFn: async (body: Omit<VerifyOtpRequest, "actionToken">) => {
      const actionToken = await storage.get(TokenType.ACTION);
      if (!actionToken) throw new Error("Action token missing. Please resend OTP.");

      return sdk.auth.verifyOtp({
        ...body,
        actionToken: actionToken as string,
      });
    },
    onSuccess: async (response, variables) => {
      if (response.status === "success") {
        // Cleanup OTP token
        await storage.remove(TokenType.ACTION);

        // 🔥 LOGIC: If Email Verification, Auto-Login the user
        if (variables.eventType === otpEvents.enum.EMAIL_VERIFICATION) {
          const { actionToken: loginToken } = response.data;

          // Perform Auto Login immediately
          const loginRes = await sdk.auth.autoLogin({ actionToken: loginToken });

          if (loginRes.status === "success") {
            const { userId } = loginRes.data;
            // Persist Session
            await storage.set("user-id", userId.toString());
            await storage.set("is-user-verified", true);

            updateUser({
              kind: "AUTHENTICATED",
              id: userId,
              isVerified: true,
            });

            // Update Global State
            await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.accessProfile });
          }
        } else if (variables.eventType === otpEvents.enum.FORGET_PASSWORD) {
          // For Forget Password OTP, just mark user as PARTIAL
          await storage.set(TokenType.ACTION, response.data.actionToken);
        }
      }
    },
  });

  return {
    // 1. Action Functions (Rename for clarity in UI)
    sendOtp: sendMutation.mutateAsync,
    verifyOtp: verifyMutation.mutateAsync,

    isPending: sendMutation.isPending || verifyMutation.isPending,
    error: sendMutation.error || verifyMutation.error,
  };
};
