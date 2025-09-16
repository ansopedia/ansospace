import z from "zod";

import { password, username } from "./auth";
import { mongooseObjectId } from "./common";

export const userRoleSchema = z.object({
  userId: mongooseObjectId,
  roleId: mongooseObjectId,
});

export type UserRole = z.infer<typeof userRoleSchema>;

const roleSchema = z.object({
  id: mongooseObjectId,
  name: z
    .string()
    .min(3, "name must be at least 3 characters")
    .max(18, "name must be at most 18 characters")
    .regex(/^[a-z][a-z-]*$/i, "name must start with a letter")
    .transform((val) => val.toLowerCase().trim()),
  description: z.string().min(25).max(255),
  isDeleted: z.boolean().default(false),
  isSystemRole: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: mongooseObjectId,
  updatedBy: mongooseObjectId,
});

export const createRoleSchema = roleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  updatedBy: true,
});

export const validateRoleName = roleSchema.pick({ name: true });

export const updateRoleSchema = roleSchema.partial({
  name: true,
  description: true,
  updatedBy: true,
});

export const getRoleSchema = roleSchema.omit({
  createdBy: true,
  updatedBy: true,
  isDeleted: true,
  isSystemRole: true,
});

export type Role = z.infer<typeof roleSchema>;
export type createRole = z.infer<typeof createRoleSchema>;
export type getRole = z.infer<typeof getRoleSchema>;

export const PermissionCategory = {
  USER_MANAGEMENT: "USER_MANAGEMENT",
  CONTENT_MANAGEMENT: "CONTENT_MANAGEMENT",
  ROLE_MANAGEMENT: "ROLE_MANAGEMENT",
  ANALYTICS: "ANALYTICS",
  SYSTEM: "SYSTEM",
  PROFILE: "PROFILE",
  COURSE_MANAGEMENT: "COURSE_MANAGEMENT",
} as const;

const permissionSchema = z.object({
  id: mongooseObjectId,
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long.")
    .max(30, "Name must be at most 30 characters long.")
    .regex(/^[a-z][a-z-]*$/i, "Name must start with a letter and can only contain letters and hyphens.")
    .transform((val) => val.toLowerCase().trim()),
  description: z.string().min(25).max(255),
  category: z.nativeEnum(PermissionCategory),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: mongooseObjectId,
  updatedBy: mongooseObjectId,
});

export const createPermissionSchema = permissionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  updatedBy: true,
});

export const validatePermissionName = permissionSchema.pick({ name: true });

export const getPermissionSchema = permissionSchema.omit({
  createdBy: true,
  updatedBy: true,
  isDeleted: true,
});

export type Permission = z.infer<typeof permissionSchema>;
export type CreatePermission = z.infer<typeof createPermissionSchema>;
export type GetPermission = z.infer<typeof getPermissionSchema>;

export const rolePermissionSchema = z.object({
  roleId: mongooseObjectId,
  permissionId: mongooseObjectId,
});

export type RolePermission = z.infer<typeof rolePermissionSchema>;

export const userSchema = z.object({
  id: mongooseObjectId,
  googleId: z.string().optional(),
  username: username,
  email: z.string().email().trim().toLowerCase().min(1, "Email is required"),
  password: password,
  confirmPassword: password,
  isEmailVerified: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const createUserWithGoogleSchema = userSchema
  .extend({
    googleId: z.string(),
  })
  .pick({
    email: true,
    username: true,
    isEmailVerified: true,
    googleId: true,
  });

const createUserWithEmailAndPasswordSchema = userSchema
  .pick({
    email: true,
    username: true,
    password: true,
    confirmPassword: true,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password does not match password",
    path: ["confirmPassword"],
  });

const registerSchema = z.union([createUserWithEmailAndPasswordSchema, createUserWithGoogleSchema]);

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

export const getUserSchema = userSchema.omit({
  password: true,
  confirmPassword: true,
  isDeleted: true,
});

export const resetPasswordSchema = userSchema
  .pick({ password: true, confirmPassword: true })
  .extend({
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password does not match password",
    path: ["confirmPassword"],
  });

export type User = z.infer<typeof userSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type GetUser = z.infer<typeof getUserSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;

export const validateRegister = (data: RegisterSchema) => {
  return registerSchema.parse(data);
};

export const validateResetPasswordSchema = (data: unknown): ResetPassword => {
  return resetPasswordSchema.parse(data);
};

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

export const profileSchema = z.object({
  userId: mongooseObjectId,
  name: z.string().optional(),
  givenName: z.string().optional(),
  familyName: z.string().optional(),
  avatar: z.string().url().optional(),
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
      twitter: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      github: z.string().url().optional(),
    })
    .optional(),
  isPublic: z.boolean().optional(),
});

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
        code: z.ZodIssueCode.custom,
        path: Object.keys(profileSchema.shape).filter((key) => key !== "userId"),
        message: "At least one field from the profile schema must be provided",
      },
    ]);
  }

  return profileSchema.parse(data);
};

export type ProfileData = z.infer<typeof profileSchema>;
export type CreateProfileData = Omit<ProfileData, "userId">;
