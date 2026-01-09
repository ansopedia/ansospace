import Link from "next/link";

import { SpotlightCard } from "@ansospace/ui/blocks";
import { cn } from "@ansospace/ui/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  History,
  KeyRound,
  LogIn,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import { getAuditLogsAction } from "@/lib/ansospace/actions";

interface ActivityLogProps {
  className?: string;
}

const getLogMetadata = (action: string) => {
  const lowerAction = action.toLowerCase();

  // Authentication & Access
  if (lowerAction.includes("login")) {
    return { icon: LogIn, color: "text-sky-500" };
  }

  // Password & Security
  if (lowerAction === "auth.password.change") {
    return { icon: KeyRound, color: "text-emerald-500" };
  }
  if (lowerAction === "auth.password.reset") {
    return { icon: ShieldAlert, color: "text-red-500" };
  }
  if (lowerAction === "auth.token.refresh.fail") {
    return { icon: AlertTriangle, color: "text-amber-500" };
  }

  // Session Management
  if (lowerAction === "auth.logout") {
    return { icon: LogOut, color: "text-zinc-500" };
  }
  if (lowerAction === "auth.logout.all") {
    return { icon: LogOut, color: "text-red-500" };
  }

  // Fallbacks for profile/generic
  if (lowerAction.includes("profile") || lowerAction.includes("avatar"))
    return { icon: UserCog, color: "text-purple-500" };
  if (lowerAction.includes("2fa") || lowerAction.includes("security"))
    return { icon: ShieldCheck, color: "text-emerald-500" };

  return { icon: AlertCircle, color: "text-zinc-500" };
};

export function ActivityLog({ className }: ActivityLogProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs", { limit: 3 }],
    queryFn: async () => {
      const res = await getAuditLogsAction({ limit: 3 });
      if (res.status === "failed") throw new Error(res.message);
      return res.data;
    },
  });

  const logs = data?.logs || [];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex animate-pulse items-start gap-3">
              <div className="size-6 rounded-full bg-zinc-800" />
              <div className="flex-1 space-y-2">
                <div className="h-2 w-3/4 rounded bg-zinc-800" />
                <div className="h-2 w-1/4 rounded bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (logs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground text-xs italic">No recent activity found</p>
        </div>
      );
    }

    return logs.map((log, index) => {
      const { icon: LogIcon, color } = getLogMetadata(log.action);
      return (
        <div key={index} className="group relative flex items-start gap-3">
          <div className={cn("mt-1 rounded-full p-1", color, "bg-current/10")}>
            <LogIcon className="size-3.5" />
          </div>
          <div className="border-border/40 flex flex-1 flex-col border-b border-dashed pb-3 text-white transition-colors group-last:border-0">
            <span className="text-xs font-semibold">{log.action}</span>
            <span className="text-muted-foreground text-[10px]">
              {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      );
    });
  };

  return (
    <SpotlightCard className={cn("flex h-full flex-col p-6", className)}>
      <div className="mb-6 flex items-center gap-2">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-2">
          <History className="size-5 text-indigo-500" />
        </div>
        <h3 className="font-bold tracking-tight">Recent Activity</h3>
      </div>

      <div className="space-y-4">{renderContent()}</div>

      <Link
        href="/profile/activity"
        className="text-muted-foreground hover:text-primary mt-auto w-full pt-6 text-center text-[10px] font-bold tracking-widest uppercase transition-colors"
      >
        View Full Audit Log
      </Link>
    </SpotlightCard>
  );
}
