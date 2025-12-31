"use client";

import * as React from "react";

import { Separator } from "../components/separator";
import { SidebarTrigger } from "../components/sidebar";
import { cn } from "../lib/utils";
import { ThemeToggle } from "../theme/theme-toggle";
import { UserMenu, UserMenuProps } from "./user-menu";

export interface NavbarProps extends React.ComponentProps<"header"> {
  userMenu?: UserMenuProps;
  showSidebarTrigger?: boolean;
  title?: string;
  actions?: React.ReactNode;
}

export const Navbar = ({
  userMenu,
  showSidebarTrigger = true,
  title,
  actions,
  className,
  children,
  ...props
}: NavbarProps) => {
  return (
    <header
      className={cn("bg-background sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4", className)}
      {...props}
    >
      {showSidebarTrigger && (
        <>
          <SidebarTrigger variant="outline" className="scale-125 sm:scale-100" />
          <Separator orientation="vertical" className="h-6" />
        </>
      )}
      {title && <h1 className="text-lg font-semibold">{title}</h1>}
      {children}
      <div className="ml-auto flex items-center gap-2">
        {actions}
        {userMenu && <UserMenu {...userMenu} />}
        <ThemeToggle />
      </div>
    </header>
  );
};
