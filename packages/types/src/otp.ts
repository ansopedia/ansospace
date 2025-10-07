import z from "zod";

import { emailSchema, otpSchema } from "./auth";
import { objectId } from "./common";
import { NotificationType, notificationTypeSchema } from "./notification";

// Define separate schemas for each OTP type
const emailVerificationOtpSchema = z.object({
  otpType: z.literal(NotificationType.EMAIL_VERIFICATION_OTP),
  email: emailSchema,
});

const forgetPasswordOtpSchema = z.object({
  otpType: z.literal(NotificationType.FORGET_PASSWORD_OTP),
  email: emailSchema,
});

// const phoneVerificationOtpSchema = z.object({
//   otpType: z.literal(NotificationType.PHONE_VERIFICATION),
//   phoneNumber: z.string().min(1, "Phone number is required"),
// });

// Use discriminatedUnion with the separate schemas
export const otpEventSchema = z.discriminatedUnion("otpType", [
  emailVerificationOtpSchema,
  forgetPasswordOtpSchema,
  // phoneVerificationOtpSchema,
]);

export const otpVerifyEventSchema = z.object({
  otp: otpSchema,
  otpType: notificationTypeSchema,
  token: z.string().min(1, "Token is required"),
});

export const otpRecordSchema = z.object({
  id: objectId,
  otp: otpSchema,
  userId: objectId,
  expiryTime: z.date(),
  otpType: notificationTypeSchema,
});

export const saveOtpSchema = otpRecordSchema.omit({ id: true });
export const getOtpSchema = otpRecordSchema.pick({
  userId: true,
  otpType: true,
});

// Update types based on the new schemas
export type OtpRecord = z.infer<typeof otpRecordSchema>;
export type OtpEvent = z.infer<typeof otpEventSchema>;
export type GetOtp = z.infer<typeof getOtpSchema>;
export type SaveOtp = z.infer<typeof saveOtpSchema>;
export type OtpVerifyEvent = z.infer<typeof otpVerifyEventSchema>;
