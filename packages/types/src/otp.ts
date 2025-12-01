import z from "zod";

import { emailSchema } from "./auth";
import { objectId } from "./common";
import { NotificationType, notificationTypeSchema } from "./notificationTypes";

// ============================================================================
// BASE OTP SCHEMA
// ============================================================================

export const otpSchema = z.string().length(6).brand<"Otp">();

export type Otp = z.infer<typeof otpSchema>;

// ============================================================================
// OTP REQUEST SCHEMAS
// ============================================================================

// Define separate schemas for each OTP type
const emailVerificationOtpRequestSchema = z.object({
  otpType: z.literal(NotificationType.EMAIL_VERIFICATION_OTP),
  email: emailSchema,
});

const forgetPasswordOtpRequestSchema = z.object({
  otpType: z.literal(NotificationType.FORGET_PASSWORD_OTP),
  email: emailSchema,
});

// Use discriminatedUnion with the separate schemas
export const sendOtpRequestSchema = z.discriminatedUnion("otpType", [
  emailVerificationOtpRequestSchema,
  forgetPasswordOtpRequestSchema,
]);

export type SendOtpRequest = z.infer<typeof sendOtpRequestSchema>;

export const verifyOtpRequestSchema = z.object({
  otp: otpSchema,
  otpType: notificationTypeSchema,
  actionToken: z.string().min(1, "Action token is required"),
});

export type VerifyOtpRequest = z.infer<typeof verifyOtpRequestSchema>;

// ============================================================================
// OTP RESPONSE SCHEMAS
// ============================================================================

export const sendOtpResponseSchema = z.object({
  actionToken: z.string(),
});

export type SendOtpResponse = z.infer<typeof sendOtpResponseSchema>;

export const verifyOtpResponseSchema = z.object({
  actionToken: z.string(),
});

export type VerifyOtpResponse = z.infer<typeof verifyOtpResponseSchema>;

// ============================================================================
// OTP RECORD SCHEMAS (Database entities)
// ============================================================================

export const otpRecordSchema = z.object({
  id: objectId,
  otp: otpSchema,
  userId: objectId,
  expiryTime: z.date(),
  otpType: notificationTypeSchema,
});

export type OtpRecord = z.infer<typeof otpRecordSchema>;

// ============================================================================
// OTP RECORD REQUEST SCHEMAS
// ============================================================================

export const saveOtpSchema = otpRecordSchema.omit({ id: true });

export type SaveOtp = z.infer<typeof saveOtpSchema>;

// ============================================================================
// OTP RECORD RESPONSE SCHEMAS
// ============================================================================

export const getOtpSchema = otpRecordSchema.pick({
  userId: true,
  otpType: true,
});

export type GetOtp = z.infer<typeof getOtpSchema>;
