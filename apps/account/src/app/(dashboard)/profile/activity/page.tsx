"use client";

import Link from "next/link";
import { useState } from "react";

import { useDebounce } from "@ansospace/react";
import { SpotlightCard } from "@ansospace/ui/blocks";
import { Button, Input, Spinner } from "@ansospace/ui/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ansospace/ui/components/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@ansospace/ui/components/empty";
import { cn } from "@ansospace/ui/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Calendar,
  ChevronLeft,
  Filter,
  History,
  KeyRound,
  Lock,
  LogIn,
  LogOut,
  Search,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";

import { getAuditLogsAction } from "@/lib/ansospace/actions";

const NOISE_TEXTURE =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

const getLogMetadata = (action: string) => {
  const lowerAction = action.toLowerCase();

  // Authentication & Access
  if (lowerAction.includes("login")) {
    return { icon: LogIn, color: "text-sky-500", bg: "bg-sky-500/10" };
  }

  // Password & Security
  if (lowerAction === "auth.password.change") {
    return { icon: KeyRound, color: "text-emerald-500", bg: "bg-emerald-500/10" };
  }
  if (lowerAction === "auth.password.reset") {
    return { icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10" };
  }
  if (lowerAction === "auth.token.refresh.fail") {
    return { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" };
  }

  // Session Management
  if (lowerAction === "auth.logout" || lowerAction === "auth.logout.all") {
    return { icon: LogOut, color: "text-zinc-500", bg: "bg-zinc-500/10" };
  }

  // Fallbacks for profile/generic
  if (lowerAction.includes("profile") || lowerAction.includes("avatar"))
    return { icon: User, color: "text-purple-500", bg: "bg-purple-500/10" };
  if (lowerAction.includes("2fa") || lowerAction.includes("security"))
    return { icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" };

  return { icon: Activity, color: "text-zinc-500", bg: "bg-zinc-500/10" };
};

const ActivityLogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState<string | undefined>(undefined);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs", { limit, offset, action: filterAction || debouncedSearch }],
    queryFn: async () => {
      const res = await getAuditLogsAction({
        limit,
        offset,
        action: filterAction || debouncedSearch,
      });
      if (res.status === "failed") throw new Error(res.message);
      return res.data;
    },
  });

  const logs = data?.logs || [];
  const total = data?.pagination?.total || 0;

  const renderLogsContent = () => {
    if (isLoading) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
          <Spinner className="size-8" />
          <p className="text-muted-foreground animate-pulse text-sm">Loading activity history...</p>
        </div>
      );
    }

    if (logs.length === 0) {
      return (
        <Empty className="border-border/30 bg-black/20 py-20 backdrop-blur-sm">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No activity found</EmptyTitle>
            <EmptyDescription>
              {searchQuery || filterAction
                ? "We couldn't find any events matching your current filters."
                : "You don't have any recent security activity recorded yet."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            {(searchQuery || filterAction) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setFilterAction(undefined);
                }}
              >
                Clear all filters
              </Button>
            )}
          </EmptyContent>
        </Empty>
      );
    }

    return logs.map((log, index) => {
      const meta = getLogMetadata(log.action);
      const LogIcon = meta.icon;

      return (
        <div key={index} className="group relative sm:pl-16">
          {/* Timeline Dot */}
          <div className="absolute top-1 left-[15px] z-10 hidden sm:block">
            <div
              className={cn(
                "flex size-[18px] items-center justify-center rounded-full border-2 border-black bg-zinc-900 ring-4 ring-black/50 transition-all group-hover:scale-125",
                meta.bg
              )}
            >
              <div className={cn("size-2 rounded-full", meta.color.replace("text-", "bg-"))} />
            </div>
          </div>

          <SpotlightCard
            className={cn(
              "border-border/30 hover:border-border/60 relative overflow-hidden bg-black/40 p-5 backdrop-blur-sm transition-all duration-300 group-hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.05)]",
              "hover:-translate-y-0.5"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={cn("rounded-xl p-2.5 transition-colors sm:hidden", meta.bg)}>
                  <LogIcon className={cn("size-5", meta.color)} />
                </div>
                <div className={cn("mt-1.5 hidden rounded-xl p-2.5 transition-colors sm:block", meta.bg)}>
                  <LogIcon className={cn("size-5", meta.color)} />
                </div>
                <div>
                  <h4 className="flex items-start gap-2 text-base font-bold text-white sm:text-lg">
                    {log.action}
                    {log.metadata &&
                      typeof log.metadata === "object" &&
                      !!(log.metadata as Record<string, unknown>).isNewDevice && (
                        <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-indigo-400 uppercase">
                          New Device
                        </span>
                      )}
                  </h4>
                  <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      {format(new Date(log.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                    {log.ip && (
                      <span className="flex items-center gap-1.5">
                        <Search className="size-3.5" />
                        IP: {log.ip}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="hidden shrink-0 sm:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground group/btn gap-2 text-[10px] font-bold tracking-widest uppercase hover:text-white"
                >
                  Details
                  <ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </div>

            {/* Meta Info if expanded or complex metadata */}
            {log.metadata && Object.keys(log.metadata).length > 1 && (
              <div className="border-border/20 mt-4 border-t pt-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {Object.entries(log.metadata || {})
                    .filter(([k]) => k !== "isNewDevice")
                    .map(([key, value]) => (
                      <div key={key}>
                        <div
                          className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase"
                          title={key}
                        >
                          {key.replace(/([A-Z])/g, " $1")}
                        </div>
                        <div className="mt-0.5 truncate text-[11px] font-medium text-white">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </SpotlightCard>
        </div>
      );
    });
  };

  return (
    <div className="relative mx-auto w-full max-w-7xl">
      {/* Background Texture */}
      <div
        className="pointer-events-none fixed inset-0 z-[-1] opacity-[0.03] mix-blend-overlay grayscale"
        style={{
          backgroundImage: `url("${NOISE_TEXTURE}")`,
        }}
      />

      {/* Header */}
      <div className="mb-12">
        <Link
          href="/profile"
          className="group text-muted-foreground mb-6 flex w-fit items-center gap-2 text-sm transition-colors hover:text-white"
        >
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          Back to Profile
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-2.5">
                <History className="size-6 text-indigo-500" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Security Activity</h1>
            </div>
            <p className="text-muted-foreground max-w-md">
              Review your account&apos;s security events, login history, and important changes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search activity..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "shrink-0",
                    filterAction && "border-indigo-500/50 bg-indigo-500/10 text-indigo-400 hover:text-indigo-300"
                  )}
                >
                  <Filter className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => setFilterAction(undefined)}>Clear Filter</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterAction("auth.login")}>Logins</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterAction("auth.password")}>Password Changes</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterAction("auth.logout")}>Logouts</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="border-border/30 absolute top-0 bottom-0 left-[23px] hidden border-l border-dashed sm:block" />

        <div className="space-y-8">{renderLogsContent()}</div>

        {/* Pagination */}
        {total > limit && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - limit))}
              className="rounded-xl"
            >
              Previous
            </Button>
            <div className="text-muted-foreground flex items-center gap-2 px-4 text-xs font-bold tracking-widest uppercase">
              {Math.floor(offset / limit) + 1} / {Math.ceil(total / limit)}
            </div>
            <Button
              variant="outline"
              disabled={offset + limit >= total}
              onClick={() => setOffset(offset + limit)}
              className="rounded-xl"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="mt-16 flex items-center justify-center gap-4 text-center">
        <div className="h-px shrink-0 bg-gradient-to-r from-transparent to-zinc-800" />
        <p className="text-muted-foreground flex w-full max-w-[400px] items-center justify-center gap-2 text-[10px] leading-relaxed select-none">
          <Lock className="size-3 shrink-0" />
          This history is private and only visible to you. We monitor activity to protect your account security.
        </p>
        <div className="h-px shrink-0 bg-gradient-to-l from-transparent to-zinc-800" />
      </div>
    </div>
  );
};

export default ActivityLogPage;
