import { Suspense } from "react";

import { SidebarProvider, SidebarTrigger } from "@ansospace/ui/components/sidebar";

import { ThemeToggle } from "../../../../../packages/ui/src/theme/theme-toggle";
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
          <div className="relative flex flex-1 flex-col">
            <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <h1 className="text-lg font-semibold">Dashboard</h1>
              <div className="ml-auto flex items-center space-x-4">
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto p-3 md:p-4">{children}</div>
            </main>
          </div>
        </SidebarProvider>
      </UserProvider>
    </Suspense>
  );
};

export default DashboardLayout;
