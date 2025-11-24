import { AuthFlowLoadingState } from "@/components/auth/AuthFlowLoadingState";

export function LoadingState() {
  return (
    <AuthFlowLoadingState title="Preparing Verification" description="Please wait while we set things up for you..." />
  );
}
