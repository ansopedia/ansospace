import { Lock, Mail, User } from "lucide-react";

import { AuthFieldConfig } from "../components/auth/AuthFields";

export const SIGNUP_FORM_FIELDS: AuthFieldConfig[] = [
  {
    id: "signup_username",
    icon: <User className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />,
    placeholder: "Create a unique username",
    name: "username",
    type: "text",
    label: "Username",
  },
  {
    id: "signup_email",
    icon: <Mail className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />,
    placeholder: "Email",
    name: "email",
    type: "email",
    label: "Email",
  },
  {
    id: "signup_password",
    icon: <Lock className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />,
    placeholder: "Create a password",
    name: "password",
    type: "password",
    label: "Password",
  },
  {
    id: "signup_confirm_password",
    icon: <Lock className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />,
    placeholder: "Confirm password",
    name: "confirmPassword",
    type: "password",
    label: "Confirm Password",
  },
] as const;
