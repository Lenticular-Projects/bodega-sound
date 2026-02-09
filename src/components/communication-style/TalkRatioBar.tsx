import * as React from "react";
import { cn } from "@/lib/utils";

interface TalkRatioBarProps {
  ratio: number;
  idealMin: number;
  idealMax: number;
  className?: string;
}

export function TalkRatioBar({
  ratio,
  idealMin,
  idealMax,
  className,
}: TalkRatioBarProps) {
  const getBarColor = (ratio: number) => {
    if (ratio >= idealMin && ratio <= idealMax) return "bg-emerald-500";
    if (
      (ratio >= idealMin - 10 && ratio < idealMin) ||
      (ratio > idealMax && ratio <= idealMax + 10)
    ) {
      return "bg-amber-500";
    }
    return "bg-red-500";
  };

  const clampedRatio = Math.min(Math.max(ratio, 0), 100);
  const idealMinPercent = idealMin;
  const idealMaxPercent = idealMax;

  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        {/* Ideal zone background */}
        <div
          className="absolute top-0 bottom-0 bg-emerald-500/10"
          style={{
            left: `${idealMinPercent}%`,
            width: `${idealMaxPercent - idealMinPercent}%`,
          }}
        />

        {/* Actual ratio bar */}
        <div
          className={cn(
            "absolute top-0 bottom-0 rounded-full transition-all duration-700 ease-out",
            getBarColor(clampedRatio),
          )}
          style={{ width: `${clampedRatio}%` }}
        />

        {/* Ideal zone markers */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-emerald-500/50"
          style={{ left: `${idealMinPercent}%` }}
        />
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-emerald-500/50"
          style={{ left: `${idealMaxPercent}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground uppercase tracking-wider">
        <span>0%</span>
        <span className="text-emerald-600 dark:text-emerald-400">
          Ideal {idealMin}-{idealMax}%
        </span>
        <span>100%</span>
      </div>
    </div>
  );
}
