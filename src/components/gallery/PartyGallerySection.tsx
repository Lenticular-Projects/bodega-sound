"use client";

import { useState } from "react";
import { LuminaInteractiveList } from "@/components/ui/lumina-interactive-list";
import { gallerySlides } from "@/data/events";
import { cn } from "@/lib/utils";

export function PartyGallerySection() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section id="gallery" aria-label="Party photo gallery">
      <LuminaInteractiveList
        slides={gallerySlides}
        mode="minimal"
        onSlideChange={setActiveSlide}
      />

      {/* Dot indicators — outside the canvas so they're always legible */}
      <div
        className="flex justify-center items-center gap-2 py-4 bg-black"
        aria-hidden="true"
      >
        {gallerySlides.map((_, i) => (
          <div
            key={i}
            className={cn(
              "rounded-sm transition-all duration-300",
              activeSlide === i
                ? "w-4 h-1 bg-bodega-yellow"
                : "w-1 h-1 bg-warm-600"
            )}
          />
        ))}
      </div>
    </section>
  );
}
