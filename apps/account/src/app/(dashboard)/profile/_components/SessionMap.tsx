"use client";

import Link from "next/link";
import * as React from "react";

import { useGetSessions, useSessionActions } from "@ansospace/react";
import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  toast,
} from "@ansospace/ui/components";
import { ArrowUpRight, Globe, MapPin, Monitor, Smartphone, XCircle } from "lucide-react";

export function SessionMap() {
  const { data: allSessions = [], isLoading } = useGetSessions();
  const { revokeSessionById } = useSessionActions();

  const sessions = React.useMemo(() => allSessions.slice(0, 3), [allSessions]);

  const handleKill = async (id: string) => {
    try {
      await revokeSessionById(id);
      toast.success("Session terminated successfully");
    } catch (error) {
      toast.error(`Failed to terminate session ${error}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="flex items-center gap-2">
            <div className="text-primary/10 rounded-lg border border-indigo-500/20 p-2">
              <Globe className="text-primary size-5" />
            </div>
            Active Sessions
          </CardTitle>
        </div>
        <CardAction className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="flex size-2 items-center justify-center">
              <span className="text-primary absolute size-2 animate-ping rounded-full opacity-75"></span>
              <span className="text-primary relative size-1.5 rounded-full"></span>
            </span>
            <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              {isLoading ? "..." : sessions.length} Live
            </span>
          </div>
          <Link
            href="/security/sessions"
            className="text-muted-foreground group hover:text-primary flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase transition-colors"
          >
            Manage
            <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {sessions.map((session) => {
          const { device, geolocation, browser, os } = session.deviceInfo || {};
          const deviceName = device?.model
            ? device.model
            : `${browser?.name || "Unknown Browser"} on ${os?.name || "Unknown OS"}`;
          const location = geolocation?.city ? `${geolocation.city}, ${geolocation.country}` : "Unknown Location";

          return (
            <Card key={session.id.toString()}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="text-primary/10 rounded-lg border border-indigo-500/20 p-2">
                    {device?.type?.toLowerCase().includes("mobile") ? (
                      <Smartphone className="text-primary size-5" />
                    ) : (
                      <Monitor className="text-primary size-5" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <CardTitle className="flex items-center gap-2">{deviceName}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="size-3" /> {location}
                    </CardDescription>
                  </div>
                </div>
                <CardAction className="flex items-center gap-2">
                  {session.isActive && <Badge variant="outline">Active</Badge>}
                  <Button variant="ghost" size="icon" onClick={() => handleKill(session.id.toString())}>
                    <XCircle />
                  </Button>
                </CardAction>
              </CardHeader>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
