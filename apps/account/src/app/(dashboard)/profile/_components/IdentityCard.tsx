"use client";

import * as React from "react";

import { useUser } from "@ansospace/react";
import { SpotlightCard } from "@ansospace/ui/blocks";
import { Avatar, AvatarFallback, AvatarImage, Badge, Button, Input } from "@ansospace/ui/components";
import { Check, Edit2, Mail, ShieldCheck, Sparkles } from "lucide-react";

export function IdentityCard() {
  const { user, email } = useUser();
  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(user.kind === "AUTHENTICATED" ? user.displayName : "");

  if (user.kind !== "AUTHENTICATED") return null;

  const initials = user.displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSave = () => {
    setIsEditing(false);
    // TODO: implement actual save logic
  };

  return (
    <SpotlightCard className="flex flex-col p-0 lg:col-span-2 lg:row-span-1">
      {/* Banner Section */}
      <div className="relative h-32 w-full overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 md:h-40">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-background/20 border-white/20 text-white backdrop-blur-md">
            <ShieldCheck className="mr-1 size-3" />
            Verified Account
          </Badge>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="relative flex flex-1 flex-col px-6 pt-16 pb-8">
        <div className="ring-background absolute -top-12 left-6 rounded-full ring-4">
          <Avatar className="border-primary/20 size-24 border-2 shadow-xl">
            <AvatarImage src={user.avatar} alt={user.displayName} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="secondary"
            className="border-background absolute -right-1 -bottom-1 size-8 rounded-full border-2 shadow-lg"
          >
            <Sparkles className="text-primary size-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-muted/50 h-8 text-xl font-bold"
                    />
                    <Button size="icon" variant="ghost" onClick={handleSave} className="size-8 text-green-500">
                      <Check className="size-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="group flex items-center gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditing(true)}
                      className="size-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Edit2 className="text-muted-foreground size-3" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Mail className="size-4" />
                <span className="text-sm">{email}</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
                PRO MEMBER
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-muted/50 border-border/50 flex flex-col gap-1 rounded-xl border p-3">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">Member Since</span>
              <span className="text-sm font-semibold">Jan 2024</span>
            </div>
            <div className="bg-muted/50 border-border/50 flex flex-col gap-1 rounded-xl border p-3">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">Region</span>
              <span className="text-sm font-semibold">India, TN</span>
            </div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
