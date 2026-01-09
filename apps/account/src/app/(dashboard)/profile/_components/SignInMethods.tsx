"use client";

import { useMemo, useState } from "react";

import { useUser } from "@ansospace/react";
import { ChangePasswordRequest, changePasswordRequestSchema } from "@ansospace/types";
import { SpotlightCard } from "@ansospace/ui/blocks";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  Switch,
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
  const { user, isLoading: isLoadingProfile } = useUser();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const hasPassword = useMemo(() => {
    if (user.kind === "AUTHENTICATED") {
      return user.hasPassword ?? false;
    }
    return true;
  }, [user]);

  const passwordFields = useMemo(() => {
    const allFields = AUTH_FORM_FIELDS.filter((field) =>
      ["currentPassword", "password", "confirmPassword"].includes(field.name)
    );

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

  if (user.kind !== "AUTHENTICATED") return null;

  return (
    <SpotlightCard className="flex min-h-[400px] flex-col p-6 lg:col-span-1 lg:row-span-1">
      <div className="mb-6 flex items-center gap-2">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-2">
          <Lock className="size-5 text-indigo-500" />
        </div>
        <h3 className="font-bold tracking-tight">Sign-in & Security</h3>
      </div>

      <div className="flex-1 space-y-6">
        {/* Password Section */}
        <div className="group relative">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold">Password</h4>
              <p className="text-muted-foreground text-[10px] font-medium">Last changed 3 months ago</p>
            </div>
            <Badge
              variant="outline"
              className="border-emerald-500/20 bg-emerald-500/5 text-[10px] font-bold text-emerald-500 uppercase"
            >
              Secure
            </Badge>
          </div>

          <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="group/btn w-full justify-between rounded-xl py-6 transition-all hover:bg-indigo-500 hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-background/50 rounded-lg p-2 group-hover/btn:bg-white/20">
                    <Key className="size-4" />
                  </div>
                  <span className="font-bold">Update Password</span>
                </div>
                <ChevronRight className="size-4 opacity-50" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader className="gap-2">
                <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                  <Key className="size-6 text-indigo-500" />
                  {hasPassword ? "Change Password" : "Set Password"}
                </DialogTitle>
                <DialogDescription>Protect your account with a strong, industrial-grade password.</DialogDescription>
              </DialogHeader>
              <Form {...passwordForm}>
                <form className="mt-4 space-y-5" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                  <AuthFields form={passwordForm} fields={passwordFields} loading={isLoadingProfile} />
                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setPasswordDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoadingProfile}
                      className="bg-indigo-500 px-8 text-white hover:bg-indigo-600"
                    >
                      {isLoadingProfile ? (
                        "Saving..."
                      ) : (
                        <>
                          <Check className="mr-2 size-4" /> Save changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-border/50 h-px w-full" />

        {/* 2FA Section */}
        <div className="group relative">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold">Two-Factor Auth</h4>
              <p className="text-muted-foreground max-w-[150px] text-[10px] leading-tight font-medium">
                {twoFactorEnabled ? "Your account is bulletproof." : "Add a shield to your account."}
              </p>
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
              <div>
                <p className="text-[10px] font-black tracking-widest uppercase">
                  {twoFactorEnabled ? "Shield On" : "Shield Off"}
                </p>
                <p className="text-[9px] font-medium opacity-70">
                  {twoFactorEnabled ? "Verified via Authenticator" : "Recommended security step"}
                </p>
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
    </SpotlightCard>
  );
}
