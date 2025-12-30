import { Suspense } from "react";

import { Separator } from "@ansospace/ui/components/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@ansospace/ui/components/sidebar";

import { AuthProvider } from "../../components/providers/AuthProvider";
import { ANSOSPACE_CONFIG } from "../../lib/ansospace/config";
import { getServerUser } from "../../lib/ansospace/server";
import { DashboardSidebar } from "./_components/Sidebar/DashboardSidebar";

// Component that fetches user data (requires runtime data - cookies)
async function UserProvider({ children }: { children: React.ReactNode }) {
  const initialUser = await getServerUser();

  return (
    <AuthProvider baseUrl={ANSOSPACE_CONFIG.baseUrl} initialUser={initialUser}>
      {children}
    </AuthProvider>
  );
}

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProvider>
        <SidebarProvider>
          <DashboardSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </UserProvider>
    </Suspense>
  );
};

export default DashboardLayout;
