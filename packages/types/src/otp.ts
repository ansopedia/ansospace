import z from "zod";

import { emailSchema } from "./auth";
import { objectId } from "./common";
import { otpEvents } from "./events";

// ============================================================================
// BASE OTP SCHEMA
// ============================================================================

export const otpSchema = z.string().length(6).brand<"Otp">();

export type Otp = z.infer<typeof otpSchema>;

// ============================================================================
// OTP REQUEST SCHEMAS
// ============================================================================

// Define separate schemas for each OTP type

export const sendOtpRequestSchema = z.object({
  eventType: otpEvents,
  email: emailSchema,
});

export type SendOtpRequest = z.infer<typeof sendOtpRequestSchema>;

export const verifyOtpRequestSchema = z.object({
  otp: otpSchema,
  eventType: otpEvents,
  actionToken: z.string().min(1, "Action token is required"),
});

export type VerifyOtpRequest = z.infer<typeof verifyOtpRequestSchema>;

// ============================================================================
// OTP RESPONSE SCHEMAS
// ============================================================================

export const sendOtpResponseSchema = z.object({
  actionToken: z.string(),
  userId: objectId,
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
  eventType: otpEvents,
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
  eventType: true,
});

export type GetOtp = z.infer<typeof getOtpSchema>;
