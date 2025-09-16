import z from "zod";

import { DeviceId, MongooseObjectId, deviceId, deviceInfoSchema, mongooseObjectId } from "./common";
import { userActionTypeSchema } from "./notification";

export const Tokens = {
  ACCESS: "access",
  REFRESH: "refresh",
  ACTION: "action",
} as const;
export type Tokens = (typeof Tokens)[keyof typeof Tokens];

export type LoggedInUser = {
  userId: MongooseObjectId;
  permissions: string[];
  deviceId: DeviceId;
  tokenVersion: number;
};

export const username = z
  .string()
  .min(3, "username must be at least 3 characters")
  .max(18, "username must be at most 18 characters")
  .regex(/^[a-z]/i, "username must start with a letter")
  .regex(/^[a-z0-9-_]*$/i, "username can only contain alphanumeric characters, hyphens, and underscores")
  .transform((val) => val.toLowerCase().trim());

export type Username = z.infer<typeof username>;

export const password = z
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
  );

export type Password = z.infer<typeof password>;

export const email = z
  .string({ message: "Email is required" })
  .min(1, { message: "Email is required" })
  .email({ message: "Invalid email format" })
  .transform((val) => val.toLowerCase().trim());

export type Email = z.infer<typeof email>;

export const otp = z.string().length(6);

export type Otp = z.infer<typeof otp>;

export const loginSchema = z
  .object({
    email: email.optional(),
    username: username.optional(),
    password: password,
  })
  .superRefine((data, ctx) => {
    if (data.email == null && data.username == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide either an email or a username",
        path: ["email", "username"],
      });
    }
    if (data.password == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is required",
        path: ["password"],
      });
    }
  });

export type Login = z.infer<typeof loginSchema>;

const AuthSchema = z.object({
  userId: mongooseObjectId,
  refreshToken: z.string(),
  otp,
  accessToken: z.string(),
  device: z.string().optional(),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
});

export const authToken = AuthSchema.pick({
  userId: true,
  accessToken: true,
  refreshToken: true,
});

export type AuthToken = z.infer<typeof authToken>;

const SignUpResponse = z.object({
  userId: mongooseObjectId,
  token: z.string(),
});

export type SignUpResponse = z.infer<typeof SignUpResponse>;

const accessTokenPayload = z.object({
  userId: mongooseObjectId,
  deviceId: deviceId,
  tokenVersion: z.number(),
  permissions: z.array(z.string()),
});

export const validateAccessTokenPayload = (data: unknown) => {
  return accessTokenPayload.parse(data);
};

const refreshTokenPayload = z.object({
  sessionId: mongooseObjectId,
});

export const validateRefreshTokenPayload = (data: unknown) => {
  return refreshTokenPayload.parse(data);
};

const actionTokenPayload = z.object({
  userId: mongooseObjectId,
  action: userActionTypeSchema,
});

export const validateActionTokenPayload = (data: unknown) => {
  return actionTokenPayload.parse(data);
};

export type AccessTokenPayload = z.infer<typeof accessTokenPayload>;
export type RefreshTokenPayload = z.infer<typeof refreshTokenPayload>;
export type ActionTokenPayload = z.infer<typeof actionTokenPayload>;

export const session = z.object({
  id: mongooseObjectId,
  userId: mongooseObjectId,
  refreshToken: z.string(),
  tokenVersion: z.number().default(0),
  lastActive: z.date().default(() => new Date()),
  createdAt: z.date(),
  updatedAt: z.date(),
  deviceId: deviceId,
  deviceInfo: deviceInfoSchema,
  isActive: z.boolean().optional().default(true),
});

export type Session = z.infer<typeof session>;

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>;

export const validateRefreshTokenSchema = (data: unknown) => {
  return refreshTokenSchema.parse(data);
};
