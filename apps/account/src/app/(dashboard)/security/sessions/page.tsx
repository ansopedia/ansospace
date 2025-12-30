import { Suspense } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Table } from "@ansospace/ui/components";

import { SessionList } from "./_components/SessionList";
import { SessionListSkeleton } from "./_components/SessionListSkeleton";

const SessionPage = () => {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage devices where you are currently signed in.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <Suspense fallback={<SessionListSkeleton />}>
              <SessionList />
            </Suspense>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionPage;
