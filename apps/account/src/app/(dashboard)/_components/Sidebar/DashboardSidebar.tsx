"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useUser } from "@ansospace/react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@ansospace/ui/components/sidebar";
import { Grid3X3, Monitor, Shield, User } from "lucide-react";

const navigation = [
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Security",
    href: "/security",
    icon: Shield,
  },
  {
    title: "Sessions",
    href: "/security/sessions",
    icon: Monitor,
  },
  {
    title: "Connected Apps",
    href: "/connected-apps",
    icon: Grid3X3,
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">Account Settings</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
