import * as React from "react";
import { cn } from "@/lib/utils";

interface EnergySparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
}

export function EnergySparkline({
  data,
  width = 120,
  height = 40,
  className,
}: EnergySparklineProps) {
  if (!data || data.length === 0) return null;

  const padding = 2;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
      const y = padding + chartHeight - ((value - min) / range) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const average = data.reduce((a, b) => a + b, 0) / data.length;
  const getTrend = (avg: number) => {
    if (avg >= 70) return "text-emerald-500";
    if (avg >= 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          points={points}
          className={cn("transition-all duration-500", getTrend(average))}
        />
        {/* End dot */}
        {data.length > 0 && (
          <circle
            cx={padding + chartWidth}
            cy={
              padding +
              chartHeight -
              ((data[data.length - 1] - min) / range) * chartHeight
            }
            r={2}
            className={cn("fill-current", getTrend(average))}
          />
        )}
      </svg>
    </div>
  );
}
