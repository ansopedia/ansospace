import z from "zod";

import { DeviceId, ObjectId, deviceId, deviceInfoSchema, objectId } from "./common";

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
  .regex(/[0-9]/, "Password must contain at least one numeric digit")
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
  .transform((val) => val.toLowerCase().trim());

export type Email = z.infer<typeof emailSchema>;

export const otpSchema = z.string().length(6).brand<"Otp">();

export type Otp = z.infer<typeof otpSchema>;

export const loginSchema = z
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

export type Login = z.infer<typeof loginSchema>;

export const authTokenSchema = z.object({
  userId: objectId,
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type AuthToken = z.infer<typeof authTokenSchema>;

export const loginResponseSchema = z.object({
  userId: objectId,
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const registerResponseSchema = z.object({
  userId: objectId,
  actionToken: z.string(),
});

export type RegisterResponse = z.infer<typeof registerResponseSchema>;

export type AuthenticatedUser = {
  userId: ObjectId;
  permissions: string[];
  deviceId: DeviceId;
  tokenVersion: number;
};

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

export const refreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;
