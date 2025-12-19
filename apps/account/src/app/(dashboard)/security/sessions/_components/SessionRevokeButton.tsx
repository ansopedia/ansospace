"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useSessionActions } from "@ansospace/react";
// Reusing your existing hook
import { ObjectId } from "@ansospace/types";
import { Button, Spinner, toast } from "@ansospace/ui/components";
import { Trash2 } from "lucide-react";

type SessionRevokeButtonProps = {
  sessionId: ObjectId;
};

export const SessionRevokeButton = ({ sessionId }: SessionRevokeButtonProps) => {
  const router = useRouter();
  const { revokeSessionById } = useSessionActions();
  const [loading, setLoading] = useState(false);

  const handleRevoke = async () => {
    try {
      setLoading(true);
      await revokeSessionById(sessionId);
      toast.success("Session revoked successfully");
      router.refresh(); // 🔥 Refreshes the Server Component (Table)
    } catch (error) {
      toast.error(`Failed to revoke session, ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRevoke}
      disabled={loading}
      className="text-destructive hover:text-destructive hover:bg-destructive/10"
    >
      {loading ? <Spinner className="size-4" /> : <Trash2 className="mr-2 size-4" />}
      Revoke
    </Button>
  );
};
