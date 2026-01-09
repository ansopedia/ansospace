"use client";

import * as React from "react";

import { SpotlightCard } from "@ansospace/ui/blocks";
import { Badge, toast } from "@ansospace/ui/components";
import { cn } from "@ansospace/ui/lib/utils";
import { ArrowUpRight, HardDrive, Shield } from "lucide-react";

const securityTasks = [
  { id: 1, label: "Password Strength", score: 40, completed: true },
  { id: 2, label: "Two-Factor Auth", score: 30, completed: false },
  { id: 3, label: "Email Verified", score: 15, completed: true },
  { id: 4, label: "Recovery Phone", score: 15, completed: false },
];

export function AccountHealth() {
  const score = React.useMemo(
    () => securityTasks.filter((t) => t.completed).reduce((acc, curr) => acc + curr.score, 0),
    []
  );

  // Storage data (Mock)
  const used = 4.6;
  const total = 5;
  const storagePercentage = (used / total) * 100;
  const isNearLimit = storagePercentage >= 90;

  const storageColor = React.useMemo(() => {
    if (storagePercentage >= 90) return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
    if (storagePercentage >= 70) return "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]";
    return "bg-zinc-700";
  }, [storagePercentage]);

  return (
    <SpotlightCard className="flex min-h-[400px] flex-col justify-between p-6 lg:col-span-1 lg:row-span-1">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2">
            <Shield className="size-5 text-emerald-500" />
          </div>
          <h3 className="font-bold tracking-tight">Account Health</h3>
        </div>
        <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-500">
          Good
        </Badge>
      </div>

      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative flex items-center justify-center">
          <svg className="size-32 rotate-[-90deg]">
            <circle
              cx="64"
              cy="64"
              r="54"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-muted/20"
            />
            <circle
              cx="64"
              cy="64"
              r="54"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 54}
              style={{
                strokeDashoffset: 2 * Math.PI * 54 - (score / 100) * (2 * Math.PI * 54),
                transition: "stroke-dashoffset 1s ease-in-out",
              }}
              className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-black">{score}</span>
            <span className="text-muted-foreground text-[8px] font-bold tracking-widest uppercase">Security</span>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {/* Storage Bar Integration */}
        <div className="bg-muted/30 border-border/50 rounded-xl border p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="text-muted-foreground size-3" />
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Storage Usage
              </span>
            </div>
            <span className="text-[10px] font-bold">
              {used}GB / {total}GB
            </span>
          </div>
          <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
            <div
              className={cn("h-full transition-all duration-500", storageColor)}
              style={{ width: `${storagePercentage}%` }}
            />
          </div>
          {isNearLimit && (
            <p className="mt-1.5 animate-pulse text-center text-[9px] font-bold text-red-500">
              Storage almost full. Upgrade to Pro for 50GB.
            </p>
          )}
        </div>

        <button
          className="group border-border/50 hover:bg-muted/50 flex w-full items-center justify-center gap-2 rounded-xl border py-2 text-[10px] font-bold tracking-widest uppercase transition-colors"
          onClick={() => toast.info("Detailed health report coming soon.")}
        >
          View Health Report
          <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </SpotlightCard>
  );
}
