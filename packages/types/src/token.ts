import z from "zod";

import { deviceId, mongooseObjectId } from "./common";
import { userActionTypeSchema } from "./notification";

export const TokenType = {
  ACCESS: "access",
  REFRESH: "refresh",
  ACTION: "action",
} as const;

export type TokenType = (typeof TokenType)[keyof typeof TokenType];

export const accessTokenPayloadSchema = z.object({
  userId: mongooseObjectId,
  deviceId: deviceId,
  tokenVersion: z.number(),
  permissions: z.array(z.string()),
});

export const validateAccessTokenPayload = (data: unknown) => {
  return accessTokenPayloadSchema.parse(data);
};

export const refreshTokenPayloadSchema = z.object({
  sessionId: mongooseObjectId,
});

export const validateRefreshTokenPayload = (data: unknown) => {
  return refreshTokenPayloadSchema.parse(data);
};

export const actionTokenPayloadSchema = z.object({
  userId: mongooseObjectId,
  action: userActionTypeSchema,
});

export const validateActionTokenPayload = (data: unknown) => {
  return actionTokenPayloadSchema.parse(data);
};

export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;
export type RefreshTokenPayload = z.infer<typeof refreshTokenPayloadSchema>;
export type ActionTokenPayload = z.infer<typeof actionTokenPayloadSchema>;

export const tokenSchema = z.object({
  id: mongooseObjectId,
  userId: mongooseObjectId,
  action: userActionTypeSchema,
  token: z.string(),
  isUsed: z.boolean(),
  expiryTime: z.date(),
  requestAttempts: z.number(),
  metadata: z.any().optional(),
});

export const createTokenSchema = tokenSchema.pick({
  userId: true,
  action: true,
  token: true,
  expiryTime: true,
  isUsed: true,
});

export const updateTokenSchema = tokenSchema
  .pick({ isUsed: true, requestAttempts: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for token update",
  });

export type Token = z.infer<typeof tokenSchema>;
export type CreateToken = z.infer<typeof createTokenSchema>;
export type GetToken = z.infer<typeof tokenSchema>;
export type UpdateToken = z.infer<typeof updateTokenSchema>;
export type DeleteToken = z.infer<typeof tokenSchema>;
export type GetTokens = z.infer<typeof tokenSchema>;
