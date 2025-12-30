"use client";

import Image from "next/image";
import { useState } from "react";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ansospace/ui/components";
import { ExternalLink, Trash2 } from "lucide-react";

interface ConnectedApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  connectedDate: string;
  lastAccessed: string;
  permissions: string[];
}

const mockApps: ConnectedApp[] = [
  {
    id: "1",
    name: "GitHub",
    description: "Code hosting platform for version control and collaboration",
    icon: "https://github.githubassets.com/favicons/favicon.svg",
    connectedDate: "Jan 15, 2024",
    lastAccessed: "2 hours ago",
    permissions: ["Read repositories", "Write repositories", "Read profile"],
  },
  {
    id: "2",
    name: "Slack",
    description: "Team communication and collaboration platform",
    icon: "https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png",
    connectedDate: "Dec 10, 2023",
    lastAccessed: "1 day ago",
    permissions: ["Send messages", "Read channels", "Manage workspace"],
  },
  {
    id: "3",
    name: "Notion",
    description: "All-in-one workspace for notes and collaboration",
    icon: "https://www.notion.so/images/favicon.ico",
    connectedDate: "Nov 5, 2023",
    lastAccessed: "3 days ago",
    permissions: ["Read pages", "Write pages", "Manage workspace"],
  },
  {
    id: "4",
    name: "Figma",
    description: "Collaborative interface design tool",
    icon: "https://static.figma.com/app/icon/1/favicon.svg",
    connectedDate: "Oct 20, 2023",
    lastAccessed: "1 week ago",
    permissions: ["Read files", "Edit files", "Share files"],
  },
];

const ConnectedAppPage = () => {
  const [apps, setApps] = useState<ConnectedApp[]>(mockApps);

  const handleRevokeAccess = (appId: string) => {
    setApps(apps.filter((app) => app.id !== appId));
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connected Applications</CardTitle>
          <CardDescription>Manage third-party applications that have access to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apps.map((app) => (
              <div key={app.id} className="flex items-start gap-4 rounded-lg border p-4">
                <Image src={app.icon} alt={`${app.name} icon`} className="size-12 rounded-lg" width={48} height={48} />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{app.name}</h3>
                      <p className="text-muted-foreground text-sm">{app.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <ExternalLink className="size-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {app.permissions.map((permission, index) => (
                      <Badge key={index} variant="secondary">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-muted-foreground flex items-center gap-4 text-xs">
                    <span>Connected {app.connectedDate}</span>
                    <span>•</span>
                    <span>Last accessed {app.lastAccessed}</span>
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeAccess(app.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                      Revoke Access
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectedAppPage;
