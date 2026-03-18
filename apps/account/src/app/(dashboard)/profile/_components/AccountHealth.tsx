"use client";

import * as React from "react";

import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Progress,
  Typography,
  toast,
} from "@ansospace/ui/components";
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

  return (
    <Card className="justify-between">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2">
            <Shield className="size-5 text-emerald-500" />
          </div>
          <CardTitle>Account Health</CardTitle>
        </div>
        <CardAction>
          <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-500">
            Good
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative flex items-center justify-center">
            <svg className="size-32 -rotate-90">
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
              <Typography className="text-3xl font-black">{score}</Typography>
              <Typography variant="mutedText">Security</Typography>
            </div>
          </div>
        </div>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="text-muted-foreground" />
              <CardTitle>Storage Usage</CardTitle>
            </CardTitle>
            <CardAction>
              {used}GB / {total}GB
            </CardAction>
          </CardHeader>
          <CardContent>
            <Progress value={storagePercentage} />
            <Typography variant="p" className="mt-2 animate-pulse text-center text-[12px] font-bold text-red-500">
              Storage almost full. Upgrade to Pro for 50GB.
            </Typography>
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter className="border-0 bg-transparent">
        <Button
          variant="ghost"
          className="w-full text-xs font-bold uppercase"
          onClick={() => toast.info("Detailed health report coming soon.")}
        >
          View Health Report
          <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
