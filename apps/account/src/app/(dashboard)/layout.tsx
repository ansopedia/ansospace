import { Suspense } from "react";

import { Footer } from "@ansospace/ui/blocks";
import { SidebarProvider } from "@ansospace/ui/components/sidebar";

import { AuthProvider } from "../../components/providers/AuthProvider";
import { getServerUser } from "../../lib/ansospace/actions";
import { ANSOSPACE_CONFIG } from "../../lib/ansospace/config";
import { DashboardSidebar } from "./_components/Sidebar/DashboardSidebar";
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
    <Suspense fallback={<div>Loading...</div>}>
      <UserProvider>
        <SidebarProvider>
          <DashboardSidebar />
          <div className="relative flex flex-1 flex-col">
            <DashboardNavbar />
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto p-4 md:p-6">{children}</div>
            </main>
            <Footer
              links={[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Support", href: "/support" },
              ]}
            />
          </div>
        </SidebarProvider>
      </UserProvider>
    </Suspense>
  );
};

export default DashboardLayout;
