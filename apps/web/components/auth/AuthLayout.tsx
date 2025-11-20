import { Card } from "@ansospace/ui/components";

interface AuthLayoutProps {
  children: React.ReactNode;
  showCard?: boolean;
}

export const AuthLayout = ({ children, showCard = true }: AuthLayoutProps) => {
  return (
    <div className="from-primary/5 via-background to-accent/5 relative min-h-dvh w-full overflow-hidden bg-linear-to-br">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary)/0.1)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--accent)/0.1)_0%,transparent_50%)]" />
      <div className="relative container m-auto flex min-h-dvh items-center justify-center p-6">
        {showCard ? (
          <Card className="border-border/50 bg-card/95 w-full max-w-md p-8 shadow-xl backdrop-blur-sm">{children}</Card>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
