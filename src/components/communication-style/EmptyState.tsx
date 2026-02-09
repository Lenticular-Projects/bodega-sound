import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
  className?: string;
}

export function EmptyState({
  message = "Speech dynamics analysis not available",
  subMessage = "This call was analyzed before speech hygiene tracking was enabled",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border border-border rounded-lg p-8 bg-card text-center",
        className,
      )}
    >
      <div className="text-muted-foreground mb-2 font-mono text-sm">
        {message}
      </div>
      <div className="text-xs text-muted-foreground">{subMessage}</div>
    </div>
  );
}
