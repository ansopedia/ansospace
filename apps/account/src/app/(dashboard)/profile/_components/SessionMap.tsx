"use client";

import Link from "next/link";
import * as React from "react";

import { useGetSessions, useSessionActions } from "@ansospace/react";
import { SpotlightCard } from "@ansospace/ui/blocks";
import { Badge, Button, toast } from "@ansospace/ui/components";
import { ArrowUpRight, Globe, MapPin, Monitor, Smartphone, XCircle } from "lucide-react";

export function SessionMap() {
  const { data: allSessions = [], isLoading } = useGetSessions();
  const { revokeSessionById } = useSessionActions();

  const sessions = React.useMemo(() => allSessions.slice(0, 3), [allSessions]);

  const handleKill = async (id: string) => {
    try {
      await revokeSessionById(id as any);
      toast.success("Session terminated successfully");
    } catch (error) {
      console.error("Kill session error:", error);
      toast.error("Failed to terminate session");
    }
  };

  // Helper to map lat/lon to map percentages
  const getCoordinates = (lat?: number, lon?: number) => {
    if (lat === undefined || lon === undefined) {
      // Fallback to randomish spots if no geo data
      return { top: "50%", left: "50%" };
    }
    // Simple projection: (lon + 180) / 360 for X, (90 - lat) / 180 for Y
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { top: `${y}%`, left: `${x}%` };
  };

  return (
    <SpotlightCard className="flex flex-col p-6 lg:col-span-2 lg:row-span-1">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-2">
            <Globe className="size-5 text-indigo-500" />
          </div>
          <h3 className="font-bold tracking-tight">Active Sessions</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="flex size-2 items-center justify-center">
              <span className="absolute size-2 animate-ping rounded-full bg-indigo-500 opacity-75"></span>
              <span className="relative size-1.5 rounded-full bg-indigo-500"></span>
            </span>
            <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              {isLoading ? "..." : sessions.length} Live
            </span>
          </div>

          <Link
            href="/security/sessions"
            className="text-muted-foreground group flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase transition-colors hover:text-indigo-500"
          >
            Manage
            <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      <div className="mt-2 grid flex-1 grid-cols-12 gap-6 overflow-hidden">
        {/* Visual Map Area - Left 7 columns */}
        <div className="bg-muted/30 border-border/50 relative col-span-7 hidden items-center justify-center overflow-hidden rounded-2xl border lg:flex">
          {/* Faded Gradient Mask to prevent text clash */}
          <div className="to-background/40 absolute inset-0 z-10 bg-gradient-to-r from-transparent via-transparent" />

          {/* Mock World Map SVG - Improved landmass contrast */}
          <svg viewBox="0 0 1000 500" className="h-full w-full fill-indigo-500/30 p-4 opacity-40">
            <path d="M150,100 Q400,50 600,100 T850,150 T150,400 T150,100" />
            <path d="M300,200 Q500,150 700,200 T900,250 T300,450 T300,200" />
            <path d="M500,50 Q700,20 900,50 T950,200 T500,300 T500,50" />
          </svg>

          {/* Pulsing Dots based on real lat/lon */}
          {!isLoading &&
            sessions.map((session) => {
              const { lat, lon } = session.deviceInfo?.geolocation || {};
              const coords = getCoordinates(lat, lon);

              return (
                <div
                  key={session.id.toString()}
                  className="group pointer-events-auto absolute z-20"
                  style={{ top: coords.top, left: coords.left }}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute size-4 animate-ping rounded-full bg-indigo-500/50" />
                    <div className="relative size-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                  </div>

                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-4 left-1/2 origin-bottom -translate-x-1/2 scale-0 transition-transform group-hover:scale-100">
                    <div className="bg-background/90 border-border rounded border px-2 py-1 text-[10px] whitespace-nowrap shadow-xl backdrop-blur-sm">
                      {session.deviceInfo?.device?.model || "Unknown Device"} •{" "}
                      {session.deviceInfo?.geolocation?.city || "Unknown City"}
                    </div>
                  </div>
                </div>
              );
            })}

          <div className="text-muted-foreground absolute bottom-4 left-4 z-20 font-mono text-[10px] uppercase">
            Encrypted Tunnel Active
          </div>
        </div>

        {/* Sessions List - Right 5 columns */}
        <div className="col-span-12 flex flex-col gap-3 overflow-y-auto pr-1 lg:col-span-5">
          {isLoading ? (
            <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
              Loading sessions...
            </div>
          ) : (
            sessions.map((session) => {
              const { device, geolocation, browser, os } = session.deviceInfo || {};
              const deviceName = device?.model
                ? device.model
                : `${browser?.name || "Unknown Browser"} on ${os?.name || "Unknown OS"}`;
              const location = geolocation?.city ? `${geolocation.city}, ${geolocation.country}` : "Unknown Location";

              return (
                <div
                  key={session.id.toString()}
                  className="bg-muted/20 border-border/40 hover:bg-muted/40 flex shrink-0 items-center justify-between rounded-xl border p-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-background border-border flex size-8 items-center justify-center rounded-lg border">
                      {device?.type?.toLowerCase().includes("mobile") ? (
                        <Smartphone className="text-muted-foreground size-4" />
                      ) : (
                        <Monitor className="text-muted-foreground size-4" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="max-w-[100px] truncate text-xs leading-tight font-bold">{deviceName}</span>
                      <span className="text-muted-foreground flex items-center gap-1 text-[9px]">
                        <MapPin className="size-2" /> {location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {session.isActive && (
                      <Badge className="h-5 border-indigo-500/20 bg-indigo-500/10 px-1.5 text-[7px] font-bold text-indigo-500 uppercase">
                        Active
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive size-7 transition-colors"
                      onClick={() => handleKill(session.id.toString())}
                      disabled={session.isActive}
                    >
                      <XCircle className="size-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </SpotlightCard>
  );
}
