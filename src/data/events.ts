import type { LuminaSlide } from "@/components/ui/lumina-interactive-list";

export interface BodegaEvent {
  id: string;
  name: string;
  date: string;
  sortDate: string; // ISO for sorting (newest first)
  theme: string;
  artists: string[];
  imageUrl: string;
  galleryLabel: string;
  galleryImages?: string[];
}

/** All events, sorted newest-first */
export const allEvents: BodegaEvent[] = [
  {
    id: "mm-manila",
    name: "MILES MEDINA LIVE IN MANILA",
    date: "January 10, 2026",
    sortDate: "2026-01-10",
    theme: "Live in Manila",
    artists: ["A$TRIDX", "Miles Medina", "Orange Juice Asia"],
    imageUrl: "/images/party-photos/optimized/DSC00070.webp",
    galleryLabel: "MILES MEDINA LIVE",
    galleryImages: [
      "/images/party-photos/optimized/DSC00070.webp",
      "/images/party-photos/optimized/DSC00098.webp", // Mixing in other event photos for demo
      "/images/party-photos/optimized/DSC00194.webp",
      "/images/party-photos/optimized/DSC00070.webp",
    ],
  },
  {
    id: "contrabanda-halloween",
    name: "CONTRABANDA HALLOWEEN",
    date: "October 24, 2025",
    sortDate: "2025-10-24",
    theme: "Halloween Edition",
    artists: ["A$TRIDX", "Butta B", "Roy De Borja", "Rjay Ty"],
    imageUrl: "/images/party-photos/optimized/DSC00098.webp",
    galleryLabel: "CONTRABANDA HALLOWEEN",
    galleryImages: [
      "/images/party-photos/optimized/DSC00098.webp",
      "/images/party-photos/optimized/DSC00194.webp",
      "/images/party-photos/optimized/DSC00217.webp",
      "/images/party-photos/optimized/DSC00098.webp",
    ],
  },
  {
    id: "afterkopia",
    name: "AFTERKOPIA",
    date: "September 29, 2025",
    sortDate: "2025-09-29",
    theme: "Tyler, The Creator Afterparty",
    artists: ["A$TRIDX", "DJ Ankle Sandwich", "Butta B", "Margachi"],
    imageUrl: "/images/party-photos/optimized/DSC00194.webp",
    galleryLabel: "AFTERKOPIA",
    galleryImages: [
      "/images/party-photos/optimized/DSC00194.webp",
      "/images/party-photos/optimized/DSC00217.webp",
      "/images/party-photos/optimized/DSC00266.webp",
      "/images/party-photos/optimized/DSC00194.webp",
    ],
  },
  {
    id: "contrabanda-aug",
    name: "CONTRABANDA",
    date: "August 29, 2025",
    sortDate: "2025-08-29",
    theme: "The Collective",
    artists: [
      "Cabu b2b Baby Oliv",
      "Sky Dominique",
      "A$TRIDX",
      "Miss A & Fateeha",
    ],
    imageUrl: "/images/party-photos/optimized/DSC00217.webp",
    galleryLabel: "CONTRABANDA",
    galleryImages: [
      "/images/party-photos/optimized/DSC00217.webp",
      "/images/party-photos/optimized/DSC00266.webp",
      "/images/party-photos/optimized/DSC00317.webp",
      "/images/party-photos/optimized/DSC00217.webp",
    ],
  },
  {
    id: "contrabanda-ii",
    name: "CONTRABANDA II",
    date: "2025",
    sortDate: "2025-06-01",
    theme: "Chapter Two",
    artists: ["A$TRIDX"],
    imageUrl: "/images/party-photos/optimized/DSC00266.webp",
    galleryLabel: "CONTRABANDA II",
    galleryImages: [
      "/images/party-photos/optimized/DSC00266.webp",
      "/images/party-photos/optimized/DSC00317.webp",
      "/images/party-photos/optimized/DSC00070.webp",
      "/images/party-photos/optimized/DSC00266.webp",
    ],
  },
  {
    id: "contrabanda-i",
    name: "CONTRABANDA I",
    date: "2025",
    sortDate: "2025-03-01",
    theme: "Where It Began",
    artists: ["A$TRIDX"],
    imageUrl: "/images/party-photos/optimized/DSC00317.webp",
    galleryLabel: "CONTRABANDA I",
    galleryImages: [
      "/images/party-photos/optimized/DSC00317.webp",
      "/images/party-photos/optimized/DSC00070.webp",
      "/images/party-photos/optimized/DSC00098.webp",
      "/images/party-photos/optimized/DSC00317.webp",
    ],
  },
];

/** First 4 events for the main page PastEventsSection */
export const recentEvents = allEvents.slice(0, 4);

/** Gallery slides derived from all events (for LuminaInteractiveList) */
export const gallerySlides: LuminaSlide[] = allEvents.map((e) => ({
  id: e.id,
  media: e.imageUrl,
  label: e.galleryLabel,
}));

/** Deterministic PRNG (mulberry32) for stable shuffle across renders */
function mulberry32(seed: number): () => number {
  let s = seed;
  return (): number => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Build a shuffled mix of slides from all events (first 2 gallery images each) */
export function buildArchiveDefaultSlides(events: BodegaEvent[]): LuminaSlide[] {
  const slides: LuminaSlide[] = events.flatMap((e) =>
    (e.galleryImages ?? []).slice(0, 2).map((img, i) => ({
      id: `${e.id}-default-${i}`,
      media: img,
      label: e.galleryLabel,
    }))
  );
  // Fisher-Yates shuffle with deterministic seed
  const rng = mulberry32(42);
  for (let i = slides.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [slides[i], slides[j]] = [slides[j], slides[i]];
  }
  return slides;
}

/** Build slides from a single event's gallery images */
export function buildEventSlides(event: BodegaEvent): LuminaSlide[] {
  return (event.galleryImages ?? []).map((img, i) => ({
    id: `${event.id}-slide-${i}`,
    media: img,
    label: event.galleryLabel,
  }));
}
