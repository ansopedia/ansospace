"use client";

import { useState } from "react";

import {
  Badge,
  Button,
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
import { Laptop, Monitor, Smartphone, Trash2 } from "lucide-react";

interface Session {
  id: string;
  device: string;
  deviceType: "desktop" | "mobile" | "tablet";
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

const mockSessions: Session[] = [
  {
    id: "1",
    device: "Chrome on Windows",
    deviceType: "desktop",
    location: "New York, USA",
    ipAddress: "192.168.1.1",
    lastActive: "Active now",
    isCurrent: true,
  },
  {
    id: "2",
    device: "Safari on iPhone",
    deviceType: "mobile",
    location: "San Francisco, USA",
    ipAddress: "192.168.1.2",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "3",
    device: "Firefox on macOS",
    deviceType: "desktop",
    location: "London, UK",
    ipAddress: "192.168.1.3",
    lastActive: "1 day ago",
    isCurrent: false,
  },
  {
    id: "4",
    device: "Chrome on Android",
    deviceType: "mobile",
    location: "Tokyo, Japan",
    ipAddress: "192.168.1.4",
    lastActive: "3 days ago",
    isCurrent: false,
  },
];

const SessionPage = () => {
  const [sessions, setSessions] = useState<Session[]>(mockSessions);

  const handleRevokeSession = (sessionId: string) => {
    setSessions(sessions.filter((session) => session.id !== sessionId));
    console.log("Revoked session:", sessionId);
  };

  const getDeviceIcon = (deviceType: Session["deviceType"]) => {
    switch (deviceType) {
      case "desktop":
        return <Monitor className="size-4" />;
      case "mobile":
        return <Smartphone className="size-4" />;
      case "tablet":
        return <Laptop className="size-4" />;
      default:
        return <Monitor className="size-4" />;
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage devices where you're currently signed in</CardDescription>
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
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(session.deviceType)}
                      <div className="flex flex-col">
                        <span className="font-medium">{session.device}</span>
                        {session.isCurrent && (
                          <Badge variant="secondary" className="mt-1 w-fit">
                            Current Session
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{session.location}</TableCell>
                  <TableCell className="text-muted-foreground">{session.ipAddress}</TableCell>
                  <TableCell className="text-muted-foreground">{session.lastActive}</TableCell>
                  <TableCell className="text-right">
                    {!session.isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                        Revoke
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionPage;
