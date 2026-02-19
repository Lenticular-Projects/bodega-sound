"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";
import type { BodegaEvent } from "@/data/events";

interface ArchiveEventGridProps {
  events: BodegaEvent[];
  selectedEventId: string | null;
  onEventClick: (event: BodegaEvent) => void;
}

function ArchiveCard({
  event,
  index,
  isSelected,
  onClick,
}: {
  event: BodegaEvent;
  index: number;
  isSelected: boolean;
  onClick: (event: BodegaEvent) => void;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "group relative overflow-hidden rounded-sm cursor-pointer transition-all duration-300",
        isSelected && "ring-2 ring-bodega-yellow"
      )}
      onClick={() => onClick(event)}
    >
      <div className="relative aspect-[3/4] bg-warm-800">
        <Image
          src={event.imageUrl}
          alt={event.name}
          fill
          priority={index < 3}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-bodega-yellow/0 group-hover:bg-bodega-yellow/10 transition-colors duration-500" />

        {/* Content overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-warm-950 via-warm-950/20 to-transparent" />

        {/* Event info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-bodega-yellow font-mono text-xs tracking-wider mb-1">
            {event.date}
          </p>
          <h3 className="font-display text-3xl md:text-4xl text-white mb-1 tracking-tight">
            {event.name}
          </h3>
          <p className="text-warm-400 text-sm">{event.theme}</p>

          <p className="text-warm-500 text-xs mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {event.artists.join(" \u2022 ")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function ArchiveEventGrid({
  events,
  selectedEventId,
  onEventClick,
}: ArchiveEventGridProps) {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
      className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {events.map((event, index) => (
        <ArchiveCard
          key={event.id}
          event={event}
          index={index}
          isSelected={event.id === selectedEventId}
          onClick={onEventClick}
        />
      ))}
    </motion.div>
  );
}
