"use client";

import Link from "next/link";
import { useState } from "react";

import { useDebounce } from "@ansospace/react";
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Spinner,
  Typography,
} from "@ansospace/ui/components";
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
          <Typography variant="mutedText" className="animate-pulse">
            Loading activity history...
          </Typography>
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

          <Card>
            <CardHeader className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={cn("rounded-xl p-2.5 transition-colors sm:hidden", meta.bg)}>
                    <LogIcon className={cn("size-5", meta.color)} />
                  </div>
                  <div className={cn("mt-1.5 hidden rounded-xl p-2.5 transition-colors sm:block", meta.bg)}>
                    <LogIcon className={cn("size-5", meta.color)} />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {log.action}
                      {log.metadata &&
                        typeof log.metadata === "object" &&
                        !!(log.metadata as Record<string, unknown>).isNewDevice && (
                          <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-indigo-400 uppercase">
                            New Device
                          </span>
                        )}
                    </CardTitle>
                    <CardDescription>
                      <Typography variant="mutedText" className="flex items-center gap-1.5 text-xs">
                        <Calendar className="size-3.5" />
                        {format(new Date(log.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </Typography>
                      {log.ip && (
                        <Typography variant="mutedText" className="flex items-center gap-1.5 text-xs">
                          <Search className="size-3.5" />
                          IP: {log.ip}
                        </Typography>
                      )}
                    </CardDescription>
                  </div>
                </div>

                <CardAction>
                  <Button variant="ghost" size="sm">
                    Details
                    <ArrowRight />
                  </Button>
                </CardAction>
              </div>
            </CardHeader>

            {/* Meta Info if expanded or complex metadata */}
            {log.metadata && Object.keys(log.metadata).length > 1 && (
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {Object.entries(log.metadata || {})
                    .filter(([k]) => k !== "isNewDevice")
                    .map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <Typography variant="mutedText">{key.replace(/([A-Z])/g, " $1")}:</Typography>
                        <Typography variant="smallText">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </Typography>
                      </div>
                    ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      );
    });
  };

  return (
    <div className="relative mx-auto w-full">
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
              <Typography variant="h2" className="pb-0 text-white sm:text-4xl">
                Security Activity
              </Typography>
            </div>
            <Typography variant="mutedText" className="block max-w-md">
              Review your account&apos;s security events, login history, and important changes.
            </Typography>
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
              <DropdownMenuTrigger
                render={
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
                }
              />
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
            <Typography
              variant="mutedText"
              className="flex items-center gap-2 px-4 text-xs font-bold tracking-widest uppercase"
            >
              {Math.floor(offset / limit) + 1} / {Math.ceil(total / limit)}
            </Typography>
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
        {/* <div className="h-px shrink-0 bg-linear-to-r from-transparent to-zinc-800" /> */}
        <Typography variant="mutedText" className="flex items-center gap-2">
          <Lock className="size-4 shrink-0" />
          This history is private and only visible to you. We monitor activity to protect your account security.
        </Typography>
      </div>
    </div>
  );
};

export default ActivityLogPage;
