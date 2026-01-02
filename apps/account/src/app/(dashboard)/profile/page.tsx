"use client";

import { useState } from "react";

import { useGetSessions, useUser } from "@ansospace/react";
import { emailSchema } from "@ansospace/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
} from "@ansospace/ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ChangePasswordForm } from "./_components/ChangePasswordForm";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: emailSchema,
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfilePage = () => {
  const { email, user } = useUser();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const { data: sessions } = useGetSessions();
  console.log("sessions", sessions);

  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.kind === "AUTHENTICATED" ? user.username : "",
      email,
    },
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    throw new Error("method not implemented");
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="size-24">
              <AvatarImage src="https://i.pravatar.cc/96?u=johndoe" alt="Profile picture" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm">
                <Camera className="size-4" />
                Upload Photo
              </Button>
              <p className="text-muted-foreground text-xs">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your name and email address</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ChangePasswordForm />

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Enable 2FA</p>
              <p className="text-muted-foreground text-sm">Require a verification code in addition to your password</p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>
          {twoFactorEnabled && (
            <div className="mt-4 space-y-2">
              <Button variant="outline" size="sm">
                Set Up Authenticator App
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
