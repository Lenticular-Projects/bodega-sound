"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TalkRatioBar } from "./TalkRatioBar";
import { MetricTooltip } from "./MetricTooltip";
import { PacingData } from "./types";
import { WarningAlt as WarningIcon } from "@carbon/icons-react";

interface PacingFlowBlockProps {
  data?: PacingData;
  onClick?: () => void;
  className?: string;
}

export function PacingFlowBlock({
  data,
  onClick,
  className,
}: PacingFlowBlockProps) {
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
          Pacing & Flow
        </div>
        <div className="text-sm text-muted-foreground text-center py-4">
          No data available
        </div>
      </div>
    );
  }

  const { talkRatio, idealZone, interruptionRate, longestMonologue } = data;

  const getRatioColor = (ratio: number) => {
    if (ratio >= 40 && ratio <= 50) return "text-emerald-500";
    if ((ratio >= 30 && ratio < 40) || (ratio > 50 && ratio <= 60))
      return "text-amber-500";
    return "text-red-500";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
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
          Pacing & Flow
        </div>
        <MetricTooltip
          title="Talk Ratio"
          description="Ideal range is 40-50%. Too low means not engaging, too high means dominating the conversation."
        >
          <div className="text-muted-foreground hover:text-primary transition-colors cursor-help">
            <WarningIcon className="size-4" />
          </div>
        </MetricTooltip>
      </div>

      {/* Talk Ratio */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <span
            className={cn(
              "font-mono text-3xl font-bold",
              getRatioColor(talkRatio),
            )}
          >
            {Math.round(talkRatio)}%
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Talk Ratio
          </span>
        </div>
        <TalkRatioBar
          ratio={talkRatio}
          idealMin={idealZone.min}
          idealMax={idealZone.max}
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
        <div>
          <div className="font-mono text-xl font-bold text-foreground">
            {interruptionRate}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Interruptions
          </div>
        </div>
        <div>
          <div className="font-mono text-xl font-bold text-foreground">
            {formatTime(longestMonologue)}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Longest Monologue
          </div>
        </div>
      </div>
    </motion.div>
  );
}
