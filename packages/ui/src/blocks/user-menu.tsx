"use client";

import * as React from "react";

import { LogOut, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/dropdown-menu";
import { cn } from "../lib/utils";

// 1. Define the Shape (Pure UI Interface)
export interface UserMenuProps {
  name: string;
  email: string;
  avatarUrl?: string;
  fallback?: string;
  onLogout: () => void;
  onManageAccount: () => void;
  children?: React.ReactNode; // For app-specific items
  className?: string;
}

// 2. The Component (Dumb & Pure)
export const UserMenu = ({
  name,
  email,
  avatarUrl,
  fallback,
  onLogout,
  onManageAccount,
  children,
  className,
}: UserMenuProps) => {
  const initials =
    fallback ||
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "focus:ring-ring focus:ring-offset-background flex items-center gap-2 rounded-full outline-none focus:ring-2 focus:ring-offset-2",
            className
          )}
        >
          <Avatar className="size-8">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          {/* <span className="hidden text-sm font-medium sm:inline-block">{name}</span> */}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{name}</p>
            <p className="text-muted-foreground text-xs leading-none">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onManageAccount}>
            <User className="mr-2 size-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onManageAccount}>
            <Settings className="mr-2 size-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {children && (
          <>
            <DropdownMenuSeparator />
            {children}
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} variant="destructive">
          <LogOut className="mr-2 size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
