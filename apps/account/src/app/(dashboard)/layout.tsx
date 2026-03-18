import { Suspense } from "react";

import { SidebarProvider } from "@ansospace/ui/components";

import { AuthProvider } from "../../components/providers/AuthProvider";
import { getServerUser } from "../../lib/ansospace/actions";
import { ANSOSPACE_CONFIG } from "../../lib/ansospace/config";
import { DashboardSidebar } from "./_components/Sidebar/DashboardSidebar";
import { Footer } from "./_components/footer";
import { DashboardNavbar } from "./_components/navbar/DashboardNavbar";

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
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <UserProvider>
        <SidebarProvider>
          <DashboardSidebar />
          <div className="flex w-full flex-col gap-6">
            <DashboardNavbar />
            <main className="flex-1 p-4 md:p-6">{children}</main>
            <Footer />
          </div>
        </SidebarProvider>
      </UserProvider>
    </Suspense>
  );
};

export default DashboardLayout;
