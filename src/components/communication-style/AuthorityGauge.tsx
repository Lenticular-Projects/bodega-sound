import * as React from "react";
import { cn } from "@/lib/utils";

interface AuthorityGaugeProps {
  leadingRatio: number;
  className?: string;
}

export function AuthorityGauge({
  leadingRatio,
  className,
}: AuthorityGaugeProps) {
  const getPosition = (ratio: number) => {
    return Math.min(Math.max(ratio, 0), 100);
  };

  const getZoneColor = (ratio: number) => {
    if (ratio >= 70) return "text-emerald-500";
    if (ratio >= 40) return "text-amber-500";
    return "text-red-500";
  };

  const position = getPosition(leadingRatio);
  const colorClass = getZoneColor(leadingRatio);

  return (
    <div className={cn("w-full", className)}>
      {/* Spectrum bar */}
      <div className="relative h-2 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-full">
        {/* Indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700 ease-out"
          style={{ left: `${position}%` }}
        >
          <div
            className={cn(
              "w-3 h-3 rounded-full bg-background border-2 shadow-md",
              colorClass.replace("text-", "border-"),
            )}
          />
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground uppercase tracking-wider">
        <span className="text-red-500">Passive</span>
        <span className={cn("font-medium", colorClass)}>
          {position}% Leading
        </span>
        <span className="text-emerald-500">Leading</span>
      </div>
    </div>
  );
}
