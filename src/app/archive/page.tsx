"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { allEvents, type BodegaEvent } from "@/data/events";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { ArchiveGallery } from "@/components/archive/ArchiveGallery";
import type { LuminaSlide } from "@/components/ui/lumina-interactive-list";

function ArchiveCard({
  event,
  index,
  onClick,
}: {
  event: BodegaEvent;
  index: number;
  onClick: (event: BodegaEvent) => void;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="group relative overflow-hidden rounded-sm cursor-pointer"
      onClick={() => onClick(event)}
    >
      <div className="relative aspect-[3/4] bg-warm-800">
        <img
          src={event.imageUrl}
          alt={event.name}
          loading={index < 3 ? "eager" : "lazy"}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-bodega-yellow/0 group-hover:bg-bodega-yellow/10 transition-colors duration-500" />

        {/* Content overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A08] via-[#0A0A08]/20 to-transparent" />

        {/* Event info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-bodega-yellow font-mono text-xs tracking-wider mb-1">
            {event.date}
          </p>
          <h3 className="font-['Bebas_Neue'] text-3xl md:text-4xl text-white mb-1 tracking-tight">
            {event.name}
          </h3>
          <p className="text-warm-400 text-sm">{event.theme}</p>

          <p className="text-warm-500 text-xs mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {event.artists.join(" • ")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ArchivePage() {
  const [selectedEvent, setSelectedEvent] = useState<BodegaEvent | null>(null);

  const handleEventClick = (event: BodegaEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseGallery = () => {
    setSelectedEvent(null);
  };

  // Convert event images to LuminaSlide format
  const gallerySlides: LuminaSlide[] =
    selectedEvent?.galleryImages?.map((img, i) => ({
      id: `${selectedEvent.id}-slide-${i}`,
      media: img,
      label: selectedEvent.galleryLabel,
      title: selectedEvent.name,
      description: selectedEvent.theme,
    })) || [];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div initial="initial" animate="animate" variants={fadeUp}>
        <h1 className="font-['Bebas_Neue'] text-7xl md:text-9xl text-white tracking-tight mb-4">
          ARCHIVE
        </h1>
        <p className="text-warm-400 text-xl max-w-2xl">
          A visual history of our gatherings. Every set, every room, every
          movement captured.
        </p>
      </motion.div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {allEvents.map((event, index) => (
          <ArchiveCard
            key={event.id}
            event={event}
            index={index}
            onClick={handleEventClick}
          />
        ))}
      </motion.div>

      {/* Full Screen Gallery Modal */}
      {selectedEvent && (
        <ArchiveGallery
          isOpen={!!selectedEvent}
          onClose={handleCloseGallery}
          slides={gallerySlides}
        />
      )}
    </div>
  );
}
