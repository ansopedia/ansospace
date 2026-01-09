import * as React from "react";

import { SidebarProvider } from "../components/sidebar";
import { cn } from "../lib/utils";

export interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export const AppShellContent = ({ children, className }: AppShellProps) => {
  return (
    <div className={cn("relative flex flex-1 flex-col transition-all duration-300 ease-in-out", className)}>
      {children}
    </div>
  );
};

export const AppShellMain = ({ children, className }: AppShellProps) => {
  return (
    <main className={cn("flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-6", className)}>
      <div className="bg-background border-border/40 mx-auto min-h-[calc(100vh-180px)] w-full max-w-7xl rounded-[1.5rem] border shadow-2xl ring-1 shadow-black/5 ring-black/5 md:rounded-[2rem] dark:ring-white/5">
        <div className="h-full w-full p-6 md:p-10">{children}</div>
      </div>
    </main>
  );
};

export const AppShellSidebar = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const AppShellNavbar = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const AppShellFooter = ({ children }: { children: React.ReactNode }) => {
  return <footer className="mx-auto w-full max-w-7xl px-4 pb-4 md:px-8 md:pb-6">{children}</footer>;
};

export interface AppShellComponent extends React.FC<AppShellProps> {
  Content: typeof AppShellContent;
  Main: typeof AppShellMain;
  Sidebar: typeof AppShellSidebar;
  Navbar: typeof AppShellNavbar;
  Footer: typeof AppShellFooter;
}

const AppShellRoot: React.FC<AppShellProps> = ({ children, className }) => {
  return (
    <SidebarProvider>
      <div className={cn("bg-muted/30 flex min-h-screen w-full transition-colors duration-500", className)}>
        {children}
      </div>
    </SidebarProvider>
  );
};

export const AppShell = Object.assign(AppShellRoot, {
  Content: AppShellContent,
  Main: AppShellMain,
  Sidebar: AppShellSidebar,
  Navbar: AppShellNavbar,
  Footer: AppShellFooter,
}) as AppShellComponent;

AppShell.displayName = "AppShell";
AppShellContent.displayName = "AppShell.Content";
AppShellMain.displayName = "AppShell.Main";
AppShellSidebar.displayName = "AppShell.Sidebar";
AppShellNavbar.displayName = "AppShell.Navbar";
AppShellFooter.displayName = "AppShell.Footer";
