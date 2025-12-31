import { Lock, Mail, User } from "lucide-react";

import { AuthFieldConfig } from "../components/auth/AuthFields";

export const AUTH_FORM_FIELDS: readonly AuthFieldConfig[] = [
  {
    id: "signup_username",
    icon: <User className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />,
    placeholder: "Create a unique username",
    name: "username",
    type: "text",
    label: "Username",
  },
  {
    id: "signup_email",
    icon: <Mail className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />,
    placeholder: "Email",
    name: "email",
    type: "email",
    label: "Email",
  },
  {
    id: "signup_password",
    icon: <Lock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />,
    placeholder: "Create a password",
    name: "password",
    type: "password",
    label: "Password",
  },
  {
    id: "signup_confirm_password",
    icon: <Lock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />,
    placeholder: "Confirm password",
    name: "confirmPassword",
    type: "password",
    label: "Confirm Password",
  },
  {
    id: "change_current_password",
    icon: <Lock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />,
    placeholder: "Enter current password",
    name: "currentPassword",
    type: "password",
    label: "Current Password",
  },
] as const;
