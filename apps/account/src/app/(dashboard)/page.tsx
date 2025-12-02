"use client";

import Link from "next/link";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ansospace/ui/components";
import { Grid3X3, Monitor, Shield, User } from "lucide-react";

const DashboardPage = () => {
  const quickActions = [
    {
      title: "Profile",
      description: "Edit your name, email, password, and avatar",
      icon: User,
      href: "/profile",
    },
    {
      title: "Security",
      description: "Manage account security and delete account",
      icon: Shield,
      href: "/security",
    },
    {
      title: "Sessions",
      description: "View and manage active sessions",
      icon: Monitor,
      href: "/security/sessions",
    },
    {
      title: "Connected Apps",
      description: "Manage third-party application access",
      icon: Grid3X3,
      href: "/connected-apps",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Welcome back!</h2>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {quickActions.map((action) => (
          <Card key={action.href} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                  <action.icon className="text-primary size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </div>
              </div>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm">
                <Link href={action.href}>Manage</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
          <CardDescription>Quick stats about your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Active Sessions</p>
              <p className="text-2xl font-bold">4</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Connected Apps</p>
              <p className="text-2xl font-bold">4</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">2FA Status</p>
              <p className="text-2xl font-bold">Disabled</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
