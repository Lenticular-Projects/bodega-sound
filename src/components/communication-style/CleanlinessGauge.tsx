import * as React from "react";
import { cn } from "@/lib/utils";

interface CleanlinessGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function CleanlinessGauge({
  score,
  size = 80,
  strokeWidth = 8,
  className,
}: CleanlinessGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const colorClass = getColor(score);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-700 ease-out", colorClass)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-mono text-2xl font-bold", colorClass)}>
          {Math.round(score)}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Score
        </span>
      </div>
    </div>
  );
}
