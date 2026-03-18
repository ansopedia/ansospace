"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@ansospace/ui/components/sidebar";
import { Grid3X3, History, Home, Monitor, Shield, User } from "lucide-react";

const navigation = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];

const securityNavigation = [
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
    title: "Security Activity",
    href: "/profile/activity",
    icon: History,
  },
  {
    title: "Connected Apps",
    href: "/connected-apps",
    icon: Grid3X3,
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={
                <Link href="/">
                  <Image alt="AnsoSpace Logo" src="/images/Ansopedia_logo.svg" width={32} height={32} />
                  <span className="text-sm font-medium">AnsoSpace</span>
                </Link>
              }
              isActive={pathname === "/"}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    render={
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Security</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {securityNavigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    render={
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
