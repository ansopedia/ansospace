import z from "zod";

import { objectId } from "./common";

// Base Schema
export const PlatformSchema = z.object({
  id: objectId,
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  createdBy: objectId,
  updatedBy: objectId.optional(),
  isDeleted: z.boolean().default(false),
  deletedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Platform = z.infer<typeof PlatformSchema>;

// Client-facing Create Input
export const CreatePlatformInputSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type CreatePlatformInput = z.infer<typeof CreatePlatformInputSchema>;

// Internal Full Create Schema (used by service)
export const CreatePlatformSchema = CreatePlatformInputSchema.extend({
  createdBy: objectId,
});

export type CreatePlatform = z.infer<typeof CreatePlatformSchema>;

// GetPlatform Schema
export const GetPlatformSchema = PlatformSchema.omit({
  createdBy: true,
  updatedBy: true,
  isDeleted: true,
  deletedAt: true,
});

export type GetPlatform = z.infer<typeof GetPlatformSchema>;

// UpdatePlatform Input Schema
export const UpdatePlatformInputSchema = PlatformSchema.pick({
  name: true,
  slug: true,
  description: true,
  logoUrl: true,
  status: true,
}).partial();

export type UpdatePlatformInput = z.infer<typeof UpdatePlatformInputSchema>;

export const UpdatePlatformSchema = UpdatePlatformInputSchema.extend({
  updatedBy: objectId,
});

export type UpdatePlatform = z.infer<typeof UpdatePlatformSchema>;
