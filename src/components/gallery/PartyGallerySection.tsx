"use client";

import { LuminaInteractiveList } from "@/components/ui/lumina-interactive-list";
import { gallerySlides } from "@/data/events";

export function PartyGallerySection() {
  return (
    <section id="gallery" aria-label="Party photo gallery">
      <LuminaInteractiveList slides={gallerySlides} mode="minimal" />
    </section>
  );
}
