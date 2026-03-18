"use client";

import { useMemo, useState } from "react";

import { useUser } from "@ansospace/react";
import { ChangePasswordRequest, changePasswordRequestSchema } from "@ansospace/types";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Spinner,
  Switch,
  Typography,
  toast,
} from "@ansospace/ui/components";
import { cn } from "@ansospace/ui/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronRight, Key, Lock, ShieldAlert, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";

import { AuthFields } from "@/components/auth/AuthFields";
import { changePasswordAction } from "@/lib/ansospace/actions";
import { AUTH_FORM_FIELDS } from "@/src/constants/auth-fields";

export function SignInMethods() {
  const { user, isSignedIn } = useUser();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  // if (!isLoadingProfile) return <div className="flex h-full w-full items-center justify-center">Loading...</div>;

  const hasPassword = user?.hasPassword;

  const passwordFields = useMemo(() => {
    const allFields = AUTH_FORM_FIELDS.filter((field) => field.type === "password");

    if (!hasPassword) {
      return allFields.filter((field) => field.name !== "currentPassword");
    }
    return allFields.sort((a) => (a.name === "currentPassword" ? -1 : 0));
  }, [hasPassword]);

  const defaultValues = useMemo(
    () => ({
      currentPassword: hasPassword ? "" : undefined,
      password: "",
      confirmPassword: "",
    }),
    [hasPassword]
  );

  const passwordForm = useForm({
    resolver: zodResolver(changePasswordRequestSchema),
    defaultValues,
  });

  const onPasswordSubmit = async (data: ChangePasswordRequest) => {
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
      setPasswordDialogOpen(false);
    } else {
      toast.error(resp.message);
    }
  };

  if (!isSignedIn) return <div>Redirecting...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="flex items-center gap-2">
            <div className="text-primary/10 border-primary/20 rounded-lg border p-2">
              <Lock className="text-primary size-5" />
            </div>
            Sign-in & Security
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex-1 space-y-6">
          {/* Password Section */}
          <div className="group relative">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <Typography variant="h6">Password</Typography>
                <Typography variant="mutedText">
                  {hasPassword ? "Last changed 3 months ago" : "No password set"}
                </Typography>
              </div>
              {hasPassword ? (
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary uppercase">
                  Secure
                </Badge>
              ) : (
                <Badge variant="outline" className="border-red-500/20 bg-red-500/5 text-red-500 uppercase">
                  Insecure
                </Badge>
              )}
            </div>

            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
              <DialogTrigger
                render={
                  <Button
                    variant="secondary"
                    className="group/btn hover:bg-primary w-full justify-between rounded-xl py-6 transition-all hover:text-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-background/50 rounded-lg p-2 group-hover/btn:bg-white/20">
                        <Key className="size-4" />
                      </div>
                      <span className="font-bold">Update Password</span>
                    </div>
                    <ChevronRight className="size-4 opacity-50" />
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader className="gap-2">
                  <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                    <Key className="text-primary size-6" />
                    {hasPassword ? "Change Password" : "Set Password"}
                  </DialogTitle>
                  <DialogDescription>Protect your account with a strong, industrial-grade password.</DialogDescription>
                </DialogHeader>
                <form className="mt-4 space-y-5" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                  <AuthFields
                    form={passwordForm}
                    fields={passwordFields}
                    loading={passwordForm.formState.isSubmitting}
                  />
                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setPasswordDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                      {passwordForm.formState.isSubmitting ? (
                        <>
                          <Spinner /> Saving...
                        </>
                      ) : (
                        <>
                          <Check /> Save changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-border/50 h-px w-full" />

          {/* 2FA Section */}
          <div className="group relative">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <Typography variant="h6">Two-Factor Auth</Typography>
                <Typography variant="mutedText">
                  {twoFactorEnabled ? "Your account is bulletproof." : "Add a shield to your account."}
                </Typography>
              </div>
              <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
            </div>

            <div
              className={cn(
                "flex items-center justify-between rounded-xl border p-4 transition-all duration-500",
                twoFactorEnabled
                  ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
                  : "bg-muted/30 border-border/50 text-muted-foreground grayscale"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("rounded-lg p-2", twoFactorEnabled ? "bg-emerald-500/10" : "bg-muted")}>
                  {twoFactorEnabled ? <ShieldCheck className="size-5" /> : <ShieldAlert className="size-5" />}
                </div>
                <div className="flex flex-col gap-1">
                  <Typography variant="h6" className="font-bold tracking-widest uppercase">
                    {twoFactorEnabled ? "Shield On" : "Shield Off"}
                  </Typography>
                  <Typography variant="smallText">
                    {twoFactorEnabled ? "Verified via Authenticator" : "Recommended security step"}
                  </Typography>
                </div>
              </div>
              {!twoFactorEnabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-0 text-[10px] font-bold underline hover:bg-transparent"
                >
                  Setup
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
