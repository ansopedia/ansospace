"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ansospace/ui/components";
import { LogOut, Trash2 } from "lucide-react";

const SecurityPage = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogoutAllDevices = async () => {
    setIsLoggingOut(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Logged out from all devices");
    setIsLoggingOut(false);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Account deleted");
    setIsDeleting(false);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Log Out All Devices */}
      <Card>
        <CardHeader>
          <CardTitle>Log Out All Devices</CardTitle>
          <CardDescription>Sign out from all devices except this one</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm">
                This will log you out from all other devices where you're currently signed in. You'll need to sign in
                again on those devices.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <LogOut className="size-4" />
                  Log Out All Devices
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will log you out from all devices except this one. You'll need to sign in again on those
                    devices.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogoutAllDevices} disabled={isLoggingOut}>
                    {isLoggingOut ? "Logging out..." : "Log Out All Devices"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Delete Account</CardTitle>
          <CardDescription>Permanently delete your account and all associated data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-destructive/10 border-destructive/20 rounded-md border p-4">
              <h4 className="text-sm font-medium">Warning: This action cannot be undone</h4>
              <p className="text-muted-foreground mt-2 text-sm">
                Deleting your account will permanently remove all your data, including:
              </p>
              <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1 text-sm">
                <li>Your profile information</li>
                <li>All connected applications</li>
                <li>Your activity history</li>
                <li>Any saved preferences</li>
              </ul>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="size-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data
                    from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="bg-destructive hover:bg-destructive/90 text-white"
                  >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityPage;
