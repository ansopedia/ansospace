"use client";

import { useState } from "react";

import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Typography,
  toast,
} from "@ansospace/ui/components";
import { AlertCircleIcon, LogOut, Trash2 } from "lucide-react";

import { revokeOtherSessionsAction } from "@/src/lib/ansospace/actions";

const SecurityPage = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogoutAllDevices = async () => {
    try {
      setIsLoggingOut(true);
      const res = await revokeOtherSessionsAction();
      if (res.status === "success") {
        toast.success("Logged out from all other devices");
        setIsLogoutDialogOpen(false);
      } else {
        toast.error(res.message || "Failed to log out from other devices");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsLogoutDialogOpen(false);
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await new Promise((_, reject) => setTimeout(() => reject("Method not implemented"), 500));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto w-full space-y-6">
      {/* Log Out All Devices */}
      <Card>
        <CardHeader>
          <CardTitle>Log Out All Devices</CardTitle>
          <CardDescription>Sign out from all devices except this one</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Typography>
                This will log you out from all other devices where you&apos;re currently signed in. You&apos;ll need to
                sign in again on those devices.
              </Typography>
            </div>
          </div>
          <div className="mt-4">
            <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
              <AlertDialogTrigger
                render={
                  <Button variant="outline">
                    <LogOut className="size-4" />
                    Log Out All Devices
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will log you out from all devices except this one. You&apos;ll need to sign in again on those
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
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 max-w-md min-w-full">
            <AlertCircleIcon />
            <AlertTitle>Warning: This action cannot be undone</AlertTitle>
            <AlertDescription>
              Deleting your account will permanently remove all your data, including:
              <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1 text-sm">
                <li>Your profile information</li>
                <li>All connected applications</li>
                <li>Your activity history</li>
                <li>Any saved preferences</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-end border-0 bg-transparent">
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="destructive">
                  <Trash2 />
                  Delete Account
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove all your data from
                  our servers.
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
        </CardFooter>
      </Card>
    </div>
  );
};

export default SecurityPage;
