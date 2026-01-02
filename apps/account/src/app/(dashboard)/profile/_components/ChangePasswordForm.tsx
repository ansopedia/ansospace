"use client";

import { useMemo } from "react";

import { useUser } from "@ansospace/react";
import { ChangePasswordRequest, changePasswordRequestSchema } from "@ansospace/types";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  toast,
} from "@ansospace/ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Lock } from "lucide-react";
import { useForm } from "react-hook-form";

import { AuthFields } from "@/components/auth/AuthFields";
import { changePasswordAction } from "@/lib/ansospace/actions";
import { AUTH_FORM_FIELDS } from "@/src/constants/auth-fields";

// TODO: After changing password, the form should be updated to show new password fields, after changing the profile data, we need to refetch the data or handle the data change in the parent component.
export const ChangePasswordForm = () => {
  const { user, isLoading: isLoadingProfile } = useUser();

  // Determine if user has password - only available for authenticated users
  const hasPassword = useMemo(() => {
    if (user.kind === "AUTHENTICATED") {
      return user.hasPassword ?? false;
    }
    // For non-authenticated users, default to true (show change password form)
    // This will be updated once user data is loaded
    return true;
  }, [user]);

  // Filter fields based on whether user has password
  const passwordFields = useMemo(() => {
    const allFields = AUTH_FORM_FIELDS.filter((field) =>
      ["currentPassword", "password", "confirmPassword"].includes(field.name)
    );

    // If user doesn't have password, exclude currentPassword field
    if (!hasPassword) {
      return allFields.filter((field) => field.name !== "currentPassword");
    }
    // Sort to show currentPassword first when changing password
    return allFields.sort((a) => (a.name === "currentPassword" ? -1 : 0));
  }, [hasPassword]);

  // Conditionally set defaultValues based on hasPassword
  const defaultValues = useMemo(() => {
    if (hasPassword) {
      return {
        currentPassword: "",
        password: "",
        confirmPassword: "",
      };
    }
    // When creating password, set currentPassword to undefined (not empty string)
    // This ensures Zod's optional() validation works correctly
    return {
      currentPassword: undefined,
      password: "",
      confirmPassword: "",
    };
  }, [hasPassword]);

  const passwordForm = useForm({
    resolver: zodResolver(changePasswordRequestSchema),
    defaultValues,
  });

  const onSubmit = async (data: ChangePasswordRequest) => {
    // If user doesn't have password, don't send currentPassword
    const submitData: ChangePasswordRequest = hasPassword
      ? data
      : {
          password: data.password,
          confirmPassword: data.confirmPassword,
        };

    const resp = await changePasswordAction(submitData);
    if (resp.status === "success") {
      toast.success(hasPassword ? "Password changed successfully" : "Password created successfully");
      passwordForm.reset(defaultValues);
    } else {
      toast.error(resp.message);
    }
  };

  const isCreatingPassword = !hasPassword;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="size-5" />
          {isCreatingPassword ? "Create Password" : "Change Password"}
        </CardTitle>
        <CardDescription>
          {isCreatingPassword
            ? "Set up a password to enable email/password login for your account"
            : "Update your password to keep your account secure"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...passwordForm}>
          <form className="space-y-4" onSubmit={passwordForm.handleSubmit(onSubmit)}>
            <AuthFields form={passwordForm} fields={passwordFields} loading={isLoadingProfile} />
            <Button type="submit" disabled={isLoadingProfile}>
              <Key className="size-4" />
              {isCreatingPassword ? "Create Password" : "Update Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
