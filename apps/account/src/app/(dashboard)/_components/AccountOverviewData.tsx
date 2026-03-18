import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ansospace/ui/components";

import { getSessionsData } from "@/lib/ansospace/actions";

export async function AccountOverviewData() {
  const sessions = await getSessionsData();

  // Fetch connected apps count when API is available
  const connectedAppsCount = 0;
  const twoFactorEnabled = false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Overview</CardTitle>
        <CardDescription>Quick stats about your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Active Sessions</p>
            <p className="text-2xl font-bold">{sessions.length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Connected Apps</p>
            <p className="text-2xl font-bold">{connectedAppsCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">2FA Status</p>
            <p className="text-2xl font-bold">{twoFactorEnabled ? "Enabled" : "Disabled"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
