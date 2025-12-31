import { Suspense } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from "@ansospace/ui/components";

import { AccountOverviewData } from "./AccountOverviewData";

export function AccountOverview() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>Quick stats about your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      }
    >
      <AccountOverviewData />
    </Suspense>
  );
}
