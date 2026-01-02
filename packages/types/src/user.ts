import z from "zod";

import { emailSchema, passwordSchema, usernameSchema } from "./auth";
import { objectId } from "./common";

// ============================================================================
// USER ENTITY SCHEMAS
// ============================================================================

export const userSchema = z.object({
  id: objectId,
  googleId: z.string().optional(),
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema.optional(),
  confirmPassword: passwordSchema.optional(),
  isEmailVerified: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

// ============================================================================
// USER REQUEST SCHEMAS
// ============================================================================

export const updateUserSchema = userSchema
  .partial() // Make all keys optional
  .refine((data) => {
    // Check if at least one key is present
    const hasValues = Object.values(data).some((value) => value !== undefined);
    if (!hasValues) {
      throw new Error("At least one field is required for user update");
    }
    return true;
  });

export type UpdateUser = z.infer<typeof updateUserSchema>;

// ============================================================================
// USER RESPONSE SCHEMAS
// ============================================================================

export const getUserSchema = userSchema.omit({
  password: true,
  confirmPassword: true,
  isDeleted: true,
});

export type GetUser = z.infer<typeof getUserSchema>;

// ============================================================================
// ROLE ENTITY SCHEMAS
// ============================================================================

const roleSchema = z.object({
  id: objectId,
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(18, "Name must be at most 18 characters")
    .regex(/^[a-z][a-z-]*$/i, "Name must start with a letter")
    .transform((val) => val.toLowerCase().trim()),
  description: z.string().min(25).max(255),
  isDeleted: z.boolean().default(false),
  isSystemRole: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: objectId,
  updatedBy: objectId,
});

export type Role = z.infer<typeof roleSchema>;

// ============================================================================
// ROLE REQUEST SCHEMAS
// ============================================================================

export const createRoleSchema = roleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  updatedBy: true,
});

export type CreateRole = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = roleSchema.partial({
  name: true,
  description: true,
  updatedBy: true,
});

export type UpdateRole = z.infer<typeof updateRoleSchema>;

export const validateRoleNameSchema = roleSchema.pick({ name: true });

// ============================================================================
// ROLE RESPONSE SCHEMAS
// ============================================================================

export const getRoleSchema = roleSchema.omit({
  createdBy: true,
  updatedBy: true,
  isDeleted: true,
  isSystemRole: true,
});

export type GetRole = z.infer<typeof getRoleSchema>;

// ============================================================================
// PERMISSION ENTITY SCHEMAS
// ============================================================================

export const PermissionCategory = {
  USER_MANAGEMENT: "USER_MANAGEMENT",
  CONTENT_MANAGEMENT: "CONTENT_MANAGEMENT",
  ROLE_MANAGEMENT: "ROLE_MANAGEMENT",
  ANALYTICS: "ANALYTICS",
  SYSTEM: "SYSTEM",
  PROFILE: "PROFILE",
  COURSE_MANAGEMENT: "COURSE_MANAGEMENT",
  PERMISSION_MANAGEMENT: "PERMISSION_MANAGEMENT",
} as const;

const permissionSchema = z.object({
  id: objectId,
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long.")
    .max(30, "Name must be at most 30 characters long.")
    .regex(/^[a-z][a-z-]*$/i, "Name must start with a letter and can only contain letters and hyphens.")
    .transform((val) => val.toLowerCase().trim()),
  description: z.string().min(25).max(255),
  category: z.enum(PermissionCategory),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: objectId,
  updatedBy: objectId,
});

export type Permission = z.infer<typeof permissionSchema>;

// ============================================================================
// PERMISSION REQUEST SCHEMAS
// ============================================================================

export const createPermissionSchema = permissionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  updatedBy: true,
});

export type CreatePermission = z.infer<typeof createPermissionSchema>;

export const validatePermissionNameSchema = permissionSchema.pick({ name: true });

// ============================================================================
// PERMISSION RESPONSE SCHEMAS
// ============================================================================

export const getPermissionSchema = permissionSchema.omit({
  createdBy: true,
  updatedBy: true,
  isDeleted: true,
});

export type GetPermission = z.infer<typeof getPermissionSchema>;

// ============================================================================
// ROLE-PERMISSION RELATIONSHIP SCHEMAS
// ============================================================================

export const userRoleSchema = z.object({
  id: objectId,
  userId: objectId,
  roleId: objectId,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserRole = z.infer<typeof userRoleSchema>;

export const rolePermissionSchema = z.object({
  id: objectId,
  roleId: objectId,
  permissionId: objectId,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RolePermission = z.infer<typeof rolePermissionSchema>;

export const createRolePermissionBodySchema = z.object({
  permissionIds: z.array(objectId).min(1, "At least one permission is required"),
});

export type CreateRolePermissionBody = z.infer<typeof createRolePermissionBodySchema>;

export const assignUserRoleBodySchema = z.object({
  roleIds: z.array(objectId).min(1, "At least one Role ID is required"),
});

export type AssignUserRoleBody = z.infer<typeof assignUserRoleBodySchema>;
// ============================================================================
// PROFILE SCHEMAS
// ============================================================================

export const Genders = ["male", "female", "non-binary", "other"] as const;
export const Pronouns = ["he/him", "she/her", "they/them", "other"] as const;

export const profileSchema = z.object({
  userId: objectId,
  name: z.string().optional(),
  givenName: z.string().optional(),
  familyName: z.string().optional(),
  avatar: z.url().optional(),
  bio: z.string().max(500).optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
      zipCode: z.string().optional(),
    })
    .optional(),
  phoneNumber: z.string().optional(),
  socialLinks: z
    .object({
      twitter: z.url().optional(),
      linkedin: z.url().optional(),
      github: z.url().optional(),
    })
    .optional(),
  gender: z.enum(Genders).optional(),
  pronouns: z.enum(Pronouns).optional(),
  isPublic: z.boolean().optional(),
});

export type ProfileData = z.infer<typeof profileSchema>;

export const createProfileBodySchema = profileSchema.omit({ userId: true });
export type CreateProfileData = Omit<ProfileData, "userId">;

export const toggleVisibilitySchema = z.object({
  isPublic: z.boolean(),
});

export const validateProfileSchema = (data: ProfileData) => {
  // Check if at least one key from profileSchema is present in the data, excluding userId
  const hasAnyKey = Object.keys(profileSchema.shape)
    .filter((key) => key !== "userId")
    .some((key) => key in data && data[key as keyof ProfileData] !== undefined);

  if (!hasAnyKey) {
    throw new z.ZodError([
      {
        code: "custom",
        path: Object.keys(profileSchema.shape).filter((key) => key !== "userId"),
        message: "At least one field from the profile schema must be provided",
      },
    ]);
  }

  return profileSchema.parse(data);
};

// ============================================================================
// USER ROLE PERMISSION AGGREGATE TYPE
// ============================================================================

export interface UserRolePermission {
  _id: string;
  username: string;
  email: string;
  roles: {
    roleId: string;
    roleName: string;
    roleDescription: string;
    permissions: {
      _id: string;
      name: string;
      description: string;
    }[];
  }[];
  allPermissions: {
    _id: string;
    name: string;
    description: string;
  }[];
}
