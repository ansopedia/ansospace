"use client";

import { AccountHealth } from "./_components/AccountHealth";
import { ActivityLog } from "./_components/ActivityLog";
import { IdentityCard } from "./_components/IdentityCard";
import { SessionMap } from "./_components/SessionMap";
import { SignInMethods } from "./_components/SignInMethods";

const NOISE_TEXTURE =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

const ProfilePage = () => {
  return (
    <div className="relative mx-auto w-full">
      {/* Subtle Noise Texture Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[-1] opacity-[0.03] mix-blend-overlay grayscale"
        style={{
          backgroundImage: `url("${NOISE_TEXTURE}")`,
        }}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Row 1: Who & Health */}
        <div className="lg:col-span-2">
          <IdentityCard />
        </div>
        <AccountHealth />
        <div className="lg:col-span-2">
          <SignInMethods />
        </div>

        <ActivityLog />
        <div className="lg:col-span-3">
          <SessionMap />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
