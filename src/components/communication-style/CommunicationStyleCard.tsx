"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpeechHygieneBlock } from "./SpeechHygieneBlock";
import { PacingFlowBlock } from "./PacingFlowBlock";
import { AuthorityBlock } from "./AuthorityBlock";
import { EngagementBlock } from "./EngagementBlock";
import { EmptyState } from "./EmptyState";
import { CommunicationStyleCardProps } from "./types";
import { User as UserIcon, ChartBar as ChartIcon } from "@carbon/icons-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function CommunicationStyleCard({
  data,
  mode,
  agentName,
  callCount,
  onDrillDown,
  className,
}: CommunicationStyleCardProps & { className?: string }) {
  const hasAnyData =
    data.speech_hygiene || data.pacing || data.authority || data.engagement;

  if (!hasAnyData) {
    return (
      <Card className={cn("bg-card border-border", className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-mono text-sm uppercase tracking-wider flex items-center gap-2">
                <ChartIcon className="size-4" />
                Communication Style
              </CardTitle>
              {mode === "aggregate" && agentName && (
                <CardDescription className="text-xs mt-1">
                  {agentName} • {callCount || 0} calls analyzed
                </CardDescription>
              )}
            </div>
            <Badge
              variant="outline"
              className="text-[10px] uppercase tracking-wider"
            >
              {mode}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-card border-border overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-mono text-sm uppercase tracking-wider flex items-center gap-2">
              <ChartIcon className="size-4" />
              Communication Style
            </CardTitle>
            {mode === "aggregate" && agentName && (
              <CardDescription className="text-xs mt-1 flex items-center gap-1">
                <UserIcon className="size-3" />
                {agentName} • {callCount || 0} calls analyzed
              </CardDescription>
            )}
          </div>
          <Badge
            variant="outline"
            className="text-[10px] uppercase tracking-wider"
          >
            {mode}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <SpeechHygieneBlock
              data={data.speech_hygiene}
              onClick={() => onDrillDown?.("speech_hygiene")}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <PacingFlowBlock
              data={data.pacing}
              onClick={() => onDrillDown?.("pacing")}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <AuthorityBlock
              data={data.authority}
              onClick={() => onDrillDown?.("authority")}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <EngagementBlock
              data={data.engagement}
              onClick={() => onDrillDown?.("engagement")}
            />
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}

export default CommunicationStyleCard;
