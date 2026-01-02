"use client";

import * as React from "react";

import { cn } from "../lib/utils";

export interface NavbarProps extends React.ComponentProps<"header"> {
  children?: React.ReactNode;
}

const NavbarRoot = ({ children, className, ...props }: NavbarProps) => {
  return (
    <div className="w-full px-4 pt-2 md:px-8 md:pt-2">
      <header
        className={cn(
          "bg-background/80 border-border/40 shadow-card/10 mx-auto flex h-14 w-full max-w-7xl items-center justify-between rounded-2xl border px-4 backdrop-blur-md transition-all md:h-16 md:px-6",
          className
        )}
        {...props}
      >
        {children}
      </header>
    </div>
  );
};

const NavbarLeft = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex items-center gap-4", className)}>{children}</div>
);

const NavbarCenter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("hidden flex-1 items-center justify-center md:flex", className)}>{children}</div>
);

const NavbarRight = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex items-center gap-2 md:gap-4", className)}>{children}</div>
);

const NavbarBrand = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex items-center gap-2", className)}>{children}</div>
);

export interface NavbarComponent extends React.FC<NavbarProps> {
  Left: typeof NavbarLeft;
  Center: typeof NavbarCenter;
  Right: typeof NavbarRight;
  Brand: typeof NavbarBrand;
}

export const Navbar = Object.assign(NavbarRoot, {
  Left: NavbarLeft,
  Center: NavbarCenter,
  Right: NavbarRight,
  Brand: NavbarBrand,
}) as NavbarComponent;

Navbar.displayName = "Navbar";
NavbarLeft.displayName = "Navbar.Left";
NavbarCenter.displayName = "Navbar.Center";
NavbarRight.displayName = "Navbar.Right";
NavbarBrand.displayName = "Navbar.Brand";
