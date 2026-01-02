import { Suspense } from "react";

import { AppShell, Footer } from "@ansospace/ui/blocks";

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
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <UserProvider>
        <AppShell>
          <AppShell.Sidebar>
            <DashboardSidebar />
          </AppShell.Sidebar>

          <AppShell.Content>
            <AppShell.Navbar>
              <DashboardNavbar />
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>

            <AppShell.Footer>
              <Footer
                links={[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Support", href: "/support" },
                ]}
              />
            </AppShell.Footer>
          </AppShell.Content>
        </AppShell>
      </UserProvider>
    </Suspense>
  );
};

export default DashboardLayout;
