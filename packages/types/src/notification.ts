import z from "zod";

import { emailSchema } from "./auth";
import { OtpEvents, UserActions, emailNotificationEvents, otpEvents, userActions } from "./events";
import { otpSchema } from "./otp";

export const otpValidatorSchema = z.string().length(6, "OTP must be exactly 6 characters");

//  Specific payload schemas
const emailVerificationOtpPayloadSchema = z.object({
  otp: otpSchema,
  recipientName: z.string().min(1, "name is required"),
  otpTTL: z.string().min(1, "otpTTL must be a non-empty string"), // (TTL = Time To Live)
});

const passwordResetOtpPayloadSchema = z.object({
  otp: otpSchema,
  recipientName: z.string().min(1, "Recipient name is required"),
  otpTTL: z.string().min(1, "otpTTL must be a non-empty string"), // (TTL = Time To Live)
});

const passwordChangeConfirmationPayloadSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required"),
});

// Define the email notification schema
const emailNotificationSchema = z.discriminatedUnion("eventType", [
  z.object({
    to: emailSchema,
    eventType: z.literal(emailNotificationEvents.enum.EMAIL_VERIFICATION_OTP),
    subject: z.string(),
    payload: emailVerificationOtpPayloadSchema,
  }),

  z.object({
    to: emailSchema,
    eventType: z.literal(emailNotificationEvents.enum.FORGET_PASSWORD_OTP),
    subject: z.string(),
    payload: passwordResetOtpPayloadSchema,
  }),

  z.object({
    to: emailSchema,
    eventType: z.literal(emailNotificationEvents.enum.PASSWORD_CHANGE_CONFIRMATION),
    subject: z.string(),
    payload: passwordChangeConfirmationPayloadSchema,
  }),
]);

export const validateEmailNotification = (data: EmailNotification) => {
  try {
    return emailNotificationSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Customize error messages
      const customErrors = error.issues.map((issue) => {
        if (issue.code === "invalid_type" && issue.path.includes("payload")) {
          const fieldName = issue.path[issue.path.length - 1];
          return {
            ...issue,
            message: `Missing required field: ${String(fieldName)}`,
          };
        }
        return issue;
      });

      throw new z.ZodError(customErrors);
    }
    throw error;
  }
};

export type EmailNotification = z.infer<typeof emailNotificationSchema>;
export type EmailVerificationOtpPayload = z.infer<typeof emailVerificationOtpPayloadSchema>;
export type ForgetPasswordOtpPayload = z.infer<typeof passwordResetOtpPayloadSchema>;
export type PasswordChangeConfirmationPayload = z.infer<typeof passwordChangeConfirmationPayloadSchema>;

/**
 * Mapping between send OTP events and user action types
 * This helps maintain consistency between the two systems
 */
export const sendOtpToActionMap: Record<Extract<OtpEvents, "EMAIL_VERIFICATION" | "FORGET_PASSWORD">, UserActions> = {
  [otpEvents.enum.EMAIL_VERIFICATION]: userActions.enum.VERIFY_EMAIL,
  [otpEvents.enum.FORGET_PASSWORD]: userActions.enum.RESET_PASSWORD,
};
