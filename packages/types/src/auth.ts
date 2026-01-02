import z from "zod";

import { DeviceId, ObjectId, deviceId, deviceInfoSchema, objectId } from "./common";

// ============================================================================
// BASE SCHEMAS - Foundational validation schemas
// ============================================================================

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(18, "Username must be at most 18 characters")
  .regex(/^[a-z]/i, "Username must start with a letter")
  .regex(/^[a-z0-9-_]*$/i, "Username can only contain alphanumeric characters, hyphens, and underscores")
  .transform((val) => val.toLowerCase().trim())
  .brand<"Username">();

export type Username = z.infer<typeof usernameSchema>;

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one numeric digit")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  .refine(
    (password) => {
      const repeatedChars = /(.)\1{2,}/;
      return !repeatedChars.test(password);
    },
    {
      message: "Password should not contain repeated characters",
    }
  )
  .brand<"Password">();

export type Password = z.infer<typeof passwordSchema>;

export const emailSchema = z
  .email({ message: "Invalid email format" })
  .min(1, { message: "Email is required" })
  .transform((val) => val.toLowerCase().trim())
  .brand<"Email">();

export type Email = z.infer<typeof emailSchema>;

// ============================================================================
// AUTHENTICATION REQUEST SCHEMAS
// ============================================================================

export const loginRequestSchema = z
  .object({
    email: emailSchema.optional(),
    username: usernameSchema.optional(),
    password: passwordSchema,
  })
  .superRefine((data, ctx) => {
    if (data.email == null && data.username == null) {
      ctx.addIssue({
        code: "custom",
        message: "Please provide either an email or a username",
        path: ["email", "username"],
      });
    }
    if (data.password == null) {
      ctx.addIssue({
        code: "custom",
        message: "Password is required",
        path: ["password"],
      });
    }
  });

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const autoLoginRequestSchema = z.object({
  actionToken: z.string().min(1, "Action token is required"),
});

export type AutoLoginRequest = z.infer<typeof autoLoginRequestSchema>;

export const refreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;

// Register request schemas (moved from user.ts for better grouping)
const createUserWithEmailAndPasswordSchema = z
  .object({
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password does not match password",
    path: ["confirmPassword"],
  });

const createUserWithGoogleSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  isEmailVerified: z.boolean(),
  googleId: z.string(),
});

export const registerRequestSchema = z.union([createUserWithEmailAndPasswordSchema, createUserWithGoogleSchema]);

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

// Reset password request schema (moved from user.ts for better grouping)
export const resetPasswordRequestSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
    actionToken: z.string().min(1, "Action token is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password does not match password",
    path: ["confirmPassword"],
  });

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;

export const changePasswordRequestSchema = z
  .object({
    currentPassword: passwordSchema.optional(), // Optional because we might be using Google or Apple auth
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password does not match password",
    path: ["confirmPassword"],
  });

export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>;

// ============================================================================
// AUTHENTICATION RESPONSE SCHEMAS
// ============================================================================

export const loginResponseSchema = z.object({
  userId: objectId,
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const registerResponseSchema = z.object({
  userId: objectId,
  actionToken: z.string(),
});

export type RegisterResponse = z.infer<typeof registerResponseSchema>;

// ============================================================================
// AUTHENTICATION ENTITY SCHEMAS
// ============================================================================

export const authTokenSchema = z.object({
  userId: objectId,
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type AuthToken = z.infer<typeof authTokenSchema>;

export const sessionSchema = z.object({
  id: objectId,
  userId: objectId,
  refreshToken: z.string(),
  tokenVersion: z.number().default(0),
  lastActive: z.date().default(() => new Date()),
  createdAt: z.date(),
  updatedAt: z.date(),
  deviceId: deviceId,
  deviceInfo: deviceInfoSchema,
  isActive: z.boolean().optional().default(true),
});

export type Session = z.infer<typeof sessionSchema>;

export const sessionQueryOptionsSchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  skip: z.coerce.number().min(0).optional().default(0),
  sortBy: z.enum(["lastActive", "createdAt"]).optional().default("lastActive"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type SessionQueryOptions = z.infer<typeof sessionQueryOptionsSchema>;

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export type AuthenticatedUser = {
  userId: ObjectId;
  permissions: string[];
  deviceId: DeviceId;
  tokenVersion: number;
};
