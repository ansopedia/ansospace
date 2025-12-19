import z from "zod";

export const otpEvents = z.enum(["EMAIL_VERIFICATION", "FORGET_PASSWORD"]);
export const userActions = z.enum(["VERIFY_EMAIL", "RESET_PASSWORD", "AUTO_LOGIN"]);
export const emailNotificationEvents = z.enum([
  "EMAIL_VERIFICATION_OTP",
  "FORGET_PASSWORD_OTP",
  "PASSWORD_CHANGE_CONFIRMATION",
]);

export type OtpEvents = z.infer<typeof otpEvents>;
export type UserActions = z.infer<typeof userActions>;
export type EmailNotificationEvents = z.infer<typeof emailNotificationEvents>;
