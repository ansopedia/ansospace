import z from "zod";

export const NotificationType = {
  // Email verification
  EMAIL_VERIFICATION_OTP: "emailVerificationOtp",
  // EMAIL_VERIFICATION_MAGIC_LINK :'emailVerificationMagicLink',

  // Email changes
  // EMAIL_CHANGE_CONFIRMATION :'emailChangeConfirmation',

  // Password operations
  // eslint-disable-next-line -- Not a hardcoded password, just an action type identifier
  FORGET_PASSWORD_OTP: "forgetPasswordOtp",
  // eslint-disable-next-line -- Not a hardcoded password, just an action type identifier
  PASSWORD_CHANGE_CONFIRMATION: "passwordChangeConfirmation",

  // Phone verification
  // PHONE_VERIFICATION :'phoneVerification',

  // Future events (commented until implemented)
  // ACCOUNT_ACTIVATION :"accountActivation",
  // WELCOME :"welcome",
  // TWO_FACTOR_AUTH :"twoFactorAuth",
  // LOGIN_ATTEMPT_ALERT :"loginAttemptAlert",
  // ACCOUNT_DELETION_CONFIRMATION :"accountDeletionConfirmation",
  // EMAIL_SUBSCRIPTION_CONFIRMATION :"emailSubscriptionConfirmation",
  // PROFILE_UPDATE :"profileUpdate",
  // SECURITY_ALERT :"securityAlert",
  // INACTIVE_ACCOUNT_REMINDER :"inactiveAccountReminder",
  // PAYMENT_CONFIRMATION :"paymentConfirmation",
  // ORDER_SHIPPING_UPDATE :"orderShippingUpdate",
  // NEWSLETTER_OPT_IN :"newsletterOptIn",
  // ACCOUNT_LOCKOUT :"accountLockout",
  // PASSWORD_EXPIRATION_REMINDER :"passwordExpirationReminder",
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

/**
 * User account action types that require verification or confirmation
 */
export const UserActionType = {
  // Authentication actions
  VERIFY_EMAIL: "verifyEmail",
  // eslint-disable-next-line -- Not a hardcoded password, just an action type identifier
  RESET_PASSWORD: "resetPassword",
  AUTO_LOGIN: "autoLogin",
  DELETE_ACCOUNT: "deleteAccount",
  CHANGE_SUBSCRIPTION: "changeSubscription",
  VERIFY_PHONE: "verifyPhone",
} as const;

export type UserActionType = (typeof UserActionType)[keyof typeof UserActionType];

// Zod schemas for validation
export const userActionTypeSchema = z.enum(UserActionType);
export const notificationTypeSchema = z.enum(NotificationType);

// Type exports
export type UserAction = z.infer<typeof userActionTypeSchema>;
export type Notification = z.infer<typeof notificationTypeSchema>;
