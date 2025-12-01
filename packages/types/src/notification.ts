import z from "zod";

import { emailSchema } from "./auth";
import { NotificationType, UserActionType } from "./notificationTypes";
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
    eventType: z.literal(NotificationType.EMAIL_VERIFICATION_OTP),
    subject: z.string(),
    payload: emailVerificationOtpPayloadSchema,
  }),
  // z.object({
  //   to: emailSchema,
  //   eventType: z.literal(NotificationType.EMAIL_VERIFICATION_MAGIC_LINK),
  //   payload: emailVerificationMagicLinkPayload,
  //   subject: z.string(),
  // }),
  // z.object({
  //   to: emailSchema,
  //   eventType: z.literal(NotificationType.EMAIL_CHANGE_CONFIRMATION),
  //   payload: emailChangeConfirmationPayload,
  //   subject: z.string(),
  // }),
  z.object({
    to: emailSchema,
    eventType: z.literal(NotificationType.FORGET_PASSWORD_OTP),
    payload: passwordResetOtpPayloadSchema,
    subject: z.string(),
  }),
  z.object({
    to: emailSchema,
    eventType: z.literal(NotificationType.PASSWORD_CHANGE_CONFIRMATION),
    subject: z.string(),
    payload: passwordChangeConfirmationPayloadSchema,
  }),
  // ... Add other event types and their corresponding payloads ...
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

/**
 * Mapping between notification types and user action types
 * This helps maintain consistency between the two systems
 */
export const notificationToActionMap: Record<NotificationType, UserActionType> = {
  [NotificationType.EMAIL_VERIFICATION_OTP]: UserActionType.VERIFY_EMAIL,
  // [NotificationType.EMAIL_VERIFICATION_MAGIC_LINK]: UserActionType.VERIFY_EMAIL,
  [NotificationType.FORGET_PASSWORD_OTP]: UserActionType.RESET_PASSWORD,
  [NotificationType.PASSWORD_CHANGE_CONFIRMATION]: UserActionType.RESET_PASSWORD,
  // [NotificationType.EMAIL_CHANGE_CONFIRMATION]: UserActionType.VERIFY_EMAIL,
  // [NotificationType.PHONE_VERIFICATION]: UserActionType.VERIFY_PHONE,
};
