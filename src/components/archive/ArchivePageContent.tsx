"use client";

import { useState, useMemo, useCallback } from "react";
import { allEvents, buildArchiveDefaultSlides, buildEventSlides } from "@/data/events";
import { LuminaInteractiveList } from "@/components/ui/lumina-interactive-list";
import { ArchiveEventGrid } from "@/components/archive/ArchiveEventGrid";
import type { BodegaEvent } from "@/data/events";

export function ArchivePageContent() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const defaultSlides = useMemo(() => buildArchiveDefaultSlides(allEvents), []);
  const activeSlides = useMemo(() => {
    if (!selectedEventId) return defaultSlides;
    const event = allEvents.find((e) => e.id === selectedEventId);
    return event ? buildEventSlides(event) : defaultSlides;
  }, [selectedEventId, defaultSlides]);

  const handleEventClick = useCallback((event: BodegaEvent) => {
    setSelectedEventId(event.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div>
      <div className="relative h-screen w-full">
        <LuminaInteractiveList
          key={selectedEventId ?? "archive-default"}
          slides={activeSlides}
          mode="minimal"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-content">
          <h1 className="font-display text-7xl md:text-9xl text-white tracking-tight drop-shadow-lg">
            ARCHIVE
          </h1>
          <p className="text-warm-300 text-xl mt-4 drop-shadow-md max-w-2xl text-center px-6">
            A visual history of our gatherings.
          </p>
        </div>
      </div>
      <div className="px-6 pb-20 max-w-7xl mx-auto">
        <ArchiveEventGrid
          events={allEvents}
          selectedEventId={selectedEventId}
          onEventClick={handleEventClick}
        />
      </div>
    </div>
  );
}
