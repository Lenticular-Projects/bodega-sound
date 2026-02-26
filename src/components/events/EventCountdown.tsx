"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { upcomingEvent } from "@/config/next-event";

export function EventCountdown(): React.ReactElement | null {
  const [daysRemaining, setDaysRemaining] = useState<number>(0);

  useEffect(() => {
    function computeDays(): void {
      const now = Date.now();
      const diff = upcomingEvent.eventDate.getTime() - now;
      setDaysRemaining(Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    computeDays();
    const id = setInterval(computeDays, 1000);
    return () => clearInterval(id);
  }, []);

  if (!upcomingEvent.showCountdown || daysRemaining <= 0) {
    return null;
  }

  return (
    <motion.p
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="font-mono text-xs text-warm-500 tracking-[0.3em] uppercase mt-6"
    >
      {upcomingEvent.name} — {daysRemaining} DAYS
    </motion.p>
  );
}
