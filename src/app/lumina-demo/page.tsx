import {
  LuminaInteractiveList,
  type LuminaSlide,
} from "@/components/ui/lumina-interactive-list";

const demoSlides: LuminaSlide[] = [
  {
    id: "neon-pulse",
    title: "Neon Pulse",
    description: "The city breathes in rhythms of electric light.",
    media:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000",
    label: "Neon Pulse",
  },
  {
    id: "desert-echo",
    title: "Desert Echo",
    description: "Silence speaks louder where the horizon ends.",
    media:
      "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&q=80&w=2000",
    label: "Desert Echo",
  },
  {
    id: "velvet-shadow",
    title: "Velvet Shadow",
    description: "Secrets hidden in the folds of the night.",
    media:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=2000",
    label: "Velvet Shadow",
  },
  {
    id: "golden-hour",
    title: "Golden Hour",
    description: "A fleeting moment of pure, warm embrace.",
    media:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=2000",
    label: "Golden Hour",
  },
  {
    id: "abstract-flow",
    title: "Abstract Flow",
    description: "Where reality bends into liquid dreams.",
    media:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000",
    label: "Abstract Flow",
  },
  {
    id: "cyber-zen",
    title: "Cyber Zen",
    description: "Finding peace in the digital noise.",
    media:
      "https://images.unsplash.com/photo-1614850523060-8da1d56ae167?auto=format&fit=crop&q=80&w=2000",
    label: "Cyber Zen",
  },
];

export default function LuminaDemoPage() {
  return (
    <div className="relative w-full h-screen bg-black">
      <LuminaInteractiveList slides={demoSlides} mode="full" />
    </div>
  );
}
