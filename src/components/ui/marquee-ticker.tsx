import type React from "react";
import { allEvents } from "@/data/events";

/** Deduplicated artist names from all events */
function getArtistNames(): string[] {
  const seen = new Set<string>();
  const names: string[] = [];
  for (const event of allEvents) {
    for (const artist of event.artists) {
      if (!seen.has(artist)) {
        seen.add(artist);
        names.push(artist);
      }
    }
  }
  return names;
}

export function MarqueeTicker(): React.ReactElement {
  const names = getArtistNames();
  // Build a single repeating string: "NAME • NAME • NAME • "
  const tickerContent = names.map((n) => n.toUpperCase()).join("  •  ") + "  •  ";

  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden bg-warm-950 border-y border-warm-800 py-3"
    >
      <div className="marquee-track flex whitespace-nowrap">
        {/* Two copies for seamless loop */}
        <span className="font-mono text-xs tracking-[0.3em] uppercase text-bodega-yellow inline-block shrink-0">
          {tickerContent}
        </span>
        <span
          className="font-mono text-xs tracking-[0.3em] uppercase text-bodega-yellow inline-block shrink-0"
          aria-hidden="true"
        >
          {tickerContent}
        </span>
      </div>
    </div>
  );
}
