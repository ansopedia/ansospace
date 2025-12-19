import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ansospace/ui/components";
import { formatDistanceToNow } from "date-fns";
import { Laptop, Monitor, Smartphone } from "lucide-react";

// Standard date formatting
import { getServerSdk } from "../../../../lib/ansospace/server";
import { SessionRevokeButton } from "./_components/SessionRevokeButton";

// Helper to determine icon based on device type
const getDeviceIcon = (type?: string) => {
  const t = type?.toLowerCase() || "";
  if (t.includes("mobile")) return <Smartphone className="text-muted-foreground size-5" />;
  if (t.includes("tablet")) return <Laptop className="text-muted-foreground size-5" />;
  return <Monitor className="text-muted-foreground size-5" />;
};

const SessionPage = async () => {
  const sdk = await getServerSdk();

  // 1. Fetch Data (Server Side)
  const res = await sdk.auth.getActiveSessions();
  const sessions = res.status === "success" ? res.data : [];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage devices where you are currently signed in.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => {
                // 2. Data Transformation (Schema -> UI)
                const { browser, os, device, geolocation, ip } = session.deviceInfo ?? {};

                // Construct readable device name: "Chrome on Windows"
                const deviceName = device?.model
                  ? `${device.model}`
                  : `${browser?.name || "Unknown Browser"} on ${os?.name || "Unknown OS"}`;

                const location = geolocation?.city ? `${geolocation.city}, ${geolocation.country}` : "Unknown Location";

                const isCurrent = session.isActive; // API should return this

                return (
                  <TableRow key={session.id.toString()}>
                    {/* Device Column */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="bg-muted/50 rounded-md p-2">{getDeviceIcon(device?.type)}</div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{deviceName}</span>
                          {isCurrent && (
                            <Badge variant="secondary" className="mt-1 h-5 w-fit px-1.5 text-[10px]">
                              Current Session
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Location Column */}
                    <TableCell className="text-sm">{location}</TableCell>

                    {/* IP Column */}
                    <TableCell className="text-muted-foreground font-mono text-sm">{ip}</TableCell>

                    {/* Time Column */}
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(session.lastActive), { addSuffix: true })}
                    </TableCell>

                    {/* Action Column */}
                    <TableCell className="text-right">
                      {!isCurrent && <SessionRevokeButton sessionId={session.id} />}
                    </TableCell>
                  </TableRow>
                );
              })}

              {sessions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
                    No active sessions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionPage;
