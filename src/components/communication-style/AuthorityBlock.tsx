"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AuthorityGauge } from "./AuthorityGauge";
import { MetricTooltip } from "./MetricTooltip";
import { AuthorityData } from "./types";
import { WarningAlt as WarningIcon } from "@carbon/icons-react";

interface AuthorityBlockProps {
  data?: AuthorityData;
  onClick?: () => void;
  className?: string;
}

export function AuthorityBlock({
  data,
  onClick,
  className,
}: AuthorityBlockProps) {
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
          Authority
        </div>
        <div className="text-sm text-muted-foreground text-center py-4">
          No data available
        </div>
      </div>
    );
  }

  const { leadingRatio, assumptiveCloses, passiveQuestions } = data;

  const getRatioColor = (ratio: number) => {
    if (ratio >= 70) return "text-emerald-500";
    if (ratio >= 40) return "text-amber-500";
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
          Authority
        </div>
        <MetricTooltip
          title="Leading Ratio"
          description="Measures how often you lead vs follow. Higher ratios indicate more authoritative communication."
        >
          <div className="text-muted-foreground hover:text-primary transition-colors cursor-help">
            <WarningIcon className="size-4" />
          </div>
        </MetricTooltip>
      </div>

      {/* Leading Ratio Gauge */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <span
            className={cn(
              "font-mono text-3xl font-bold",
              getRatioColor(leadingRatio),
            )}
          >
            {Math.round(leadingRatio)}%
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Leading
          </span>
        </div>
        <AuthorityGauge leadingRatio={leadingRatio} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
        <div>
          <div className="font-mono text-xl font-bold text-emerald-500">
            {assumptiveCloses}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Assumptive Closes
          </div>
        </div>
        <div>
          <div
            className={cn(
              "font-mono text-xl font-bold",
              passiveQuestions > 3 ? "text-red-500" : "text-foreground",
            )}
          >
            {passiveQuestions}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Passive Questions
          </div>
        </div>
      </div>
    </motion.div>
  );
}
