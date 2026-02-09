"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CleanlinessGauge } from "./CleanlinessGauge";
import { MetricTooltip } from "./MetricTooltip";
import { SpeechHygieneData } from "./types";
import { WarningAlt as WarningIcon } from "@carbon/icons-react";

interface SpeechHygieneBlockProps {
  data?: SpeechHygieneData;
  onClick?: () => void;
  className?: string;
}

export function SpeechHygieneBlock({
  data,
  onClick,
  className,
}: SpeechHygieneBlockProps) {
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
          Speech Hygiene
        </div>
        <div className="text-sm text-muted-foreground text-center py-4">
          No data available
        </div>
      </div>
    );
  }

  const { cleanlinessScore, fillerWords, totalFillerWords } = data;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
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
          Speech Hygiene
        </div>
        <MetricTooltip
          title="Cleanliness Score"
          description="Measures filler word usage. Higher scores indicate more professional speech patterns."
        >
          <div className="text-muted-foreground hover:text-primary transition-colors cursor-help">
            <WarningIcon className="size-4" />
          </div>
        </MetricTooltip>
      </div>

      <div className="flex items-start gap-4">
        <CleanlinessGauge score={cleanlinessScore} size={72} strokeWidth={6} />

        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "font-mono text-3xl font-bold mb-1",
              getScoreColor(cleanlinessScore),
            )}
          >
            {Math.round(cleanlinessScore)}%
          </div>
          <div className="text-xs text-muted-foreground mb-3">
            {totalFillerWords} filler words detected
          </div>

          {/* Top filler words */}
          {fillerWords.length > 0 && (
            <div className="space-y-1">
              {fillerWords.slice(0, 3).map((item, index) => (
                <div
                  key={item.word}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-muted-foreground truncate">
                    {index + 1}. &ldquo;{item.word}&rdquo;
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
