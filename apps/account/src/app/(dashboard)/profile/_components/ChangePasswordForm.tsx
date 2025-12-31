"use client";

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
import { Key } from "lucide-react";
import { useForm } from "react-hook-form";

import { AuthFields } from "../../../../components/auth/AuthFields";
import { AUTH_FORM_FIELDS } from "../../../../constants/auth-fields";
import { changePasswordAction } from "./action";

const CHANGE_PASSWORD_FIELDS = AUTH_FORM_FIELDS.filter((field) =>
  ["currentPassword", "password", "confirmPassword"].includes(field.name)
).sort((a) => (a.name === "currentPassword" ? -1 : 0));

export const ChangePasswordForm = () => {
  const passwordForm = useForm({
    resolver: zodResolver(changePasswordRequestSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordRequest) => {
    const resp = await changePasswordAction(data);
    if (resp.status === "success") {
      toast.success("Password changed successfully");
      passwordForm.reset();
    } else {
      toast.error(resp.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password to keep your account secure</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...passwordForm}>
          <form className="space-y-4" onSubmit={passwordForm.handleSubmit(onSubmit)}>
            <AuthFields form={passwordForm} fields={CHANGE_PASSWORD_FIELDS} />
            {/* <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter current password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <Button type="submit">
              <Key className="size-4" />
              Update Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
