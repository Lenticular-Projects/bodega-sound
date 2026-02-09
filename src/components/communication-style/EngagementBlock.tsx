"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EnergySparkline } from "./EnergySparkline";
import { MetricTooltip } from "./MetricTooltip";
import { EngagementData } from "./types";
import { WarningAlt as WarningIcon } from "@carbon/icons-react";

interface EngagementBlockProps {
  data?: EngagementData;
  onClick?: () => void;
  className?: string;
}

export function EngagementBlock({
  data,
  onClick,
  className,
}: EngagementBlockProps) {
  if (!data) {
    return (
      <div
        className={cn(
          "border border-border rounded-lg p-4 bg-card cursor-pointer hover:border-primary/20 transition-colors",
          className,
        )}
        onClick={onClick}
      >
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
          Engagement
        </div>
        <div className="text-sm text-muted-foreground text-center py-4">
          No data available
        </div>
      </div>
    );
  }

  const { energyScore, energyHistory, monologueFatigueZones, toneShifts } =
    data;

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <motion.div
      className={cn(
        "border border-border rounded-lg p-4 bg-card cursor-pointer hover:border-primary/20 transition-all duration-300",
        className,
      )}
      onClick={onClick}
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Engagement
        </div>
        <MetricTooltip
          title="Energy Score"
          description="Measures vocal energy and engagement throughout the call. Higher scores indicate more dynamic communication."
        >
          <div className="text-muted-foreground hover:text-primary transition-colors cursor-help">
            <WarningIcon className="size-4" />
          </div>
        </MetricTooltip>
      </div>

      {/* Energy Score */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span
            className={cn(
              "font-mono text-3xl font-bold",
              getScoreColor(energyScore),
            )}
          >
            {Math.round(energyScore)}%
          </span>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
            Energy Score
          </div>
        </div>
        {energyHistory.length > 0 && (
          <EnergySparkline data={energyHistory} width={100} height={36} />
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
        <div>
          <div
            className={cn(
              "font-mono text-xl font-bold",
              monologueFatigueZones > 2 ? "text-red-500" : "text-foreground",
            )}
          >
            {monologueFatigueZones}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Fatigue Zones
          </div>
        </div>
        <div>
          <div className="font-mono text-xl font-bold text-foreground">
            {toneShifts}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Tone Shifts
          </div>
        </div>
      </div>
    </motion.div>
  );
}
