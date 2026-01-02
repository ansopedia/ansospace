"use client";

import { useUser } from "@ansospace/react";
import { SpotlightCard } from "@ansospace/ui/blocks";
import { Button } from "@ansospace/ui/components";
import { Trash2 } from "lucide-react";

import { AccountHealth } from "./_components/AccountHealth";
import { ActivityLog } from "./_components/ActivityLog";
import { IdentityCard } from "./_components/IdentityCard";
import { SessionMap } from "./_components/SessionMap";
import { SignInMethods } from "./_components/SignInMethods";

const NOISE_TEXTURE =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

const ProfilePage = () => {
  const { user } = useUser();

  if (user.kind !== "AUTHENTICATED") {
    return null;
  }

  return (
    <div className="relative mx-auto w-full max-w-7xl">
      {/* Subtle Noise Texture Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[-1] opacity-[0.03] mix-blend-overlay grayscale"
        style={{
          backgroundImage: `url("${NOISE_TEXTURE}")`,
        }}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Row 1: Who & Health */}
        <IdentityCard />
        <AccountHealth />

        {/* Row 2: Presence & Access */}
        <SessionMap />
        <SignInMethods />

        {/* Row 3: History & Risks */}
        <div className="lg:col-span-2">
          <ActivityLog />
        </div>

        <div className="lg:col-span-1">
          <SpotlightCard className="flex h-full flex-col justify-between border-red-500/20 bg-red-500/5 p-6">
            <div className="space-y-1">
              <div className="mb-2 flex items-center gap-2 text-red-500">
                <Trash2 className="size-5" />
                <h3 className="text-xl font-bold">Danger Zone</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Permanently delete your account and all associated data. This action is irreversible.
              </p>
            </div>
            <Button
              variant="ghost"
              className="mt-8 w-full rounded-xl border border-red-900/50 font-bold text-red-500 transition-all duration-300 hover:bg-red-950/50"
            >
              Delete Account
            </Button>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
