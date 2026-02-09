import * as React from "react";
import { cn } from "@/lib/utils";

interface MetricTooltipProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function MetricTooltip({
  title,
  description,
  children,
  className,
}: MetricTooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-popover border border-border rounded-lg shadow-lg z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
            {title}
          </div>
          <div className="text-xs text-popover-foreground leading-relaxed">
            {description}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover" />
        </div>
      )}
    </div>
  );
}
