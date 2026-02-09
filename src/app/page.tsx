import { HeroSection } from "@/components/hero/HeroSection";
import { TextReveal } from "@/components/ui/text-reveal";
import { NextEventSection } from "@/components/events/NextEventSection";
import { PastEventsSection } from "@/components/archive/PastEventsSection";
import { YouTubeSection } from "@/components/media/YouTubeSection";
import { MerchSection } from "@/components/shop/MerchSection";
import { NewsletterSection } from "@/components/newsletter/NewsletterSection";
import { AudioPlayer } from "@/components/audio/AudioPlayer";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Main Content */}
      <div className="relative z-content">
        <HeroSection />
        <TextReveal
          lines={[
            "WE ARE THE VIBRATION OF THE STREETS.",
            "A COLLECTIVE OF SOUND ARCHITECTS",
            "BUILDING THE FUTURE OF BASS CULTURE.",
            "JOIN THE MOVEMENT.",
          ]}
          highlightWords={[
            "vibration",
            "streets",
            "sound",
            "architects",
            "future",
            "culture",
            "movement",
          ]}
        />

        <NextEventSection />
        <PastEventsSection />
        <YouTubeSection />
        <MerchSection />
        <NewsletterSection />
      </div>

      {/* Audio Player */}
      <div className="z-overlay">
        <AudioPlayer />
      </div>
    </div>
  );
}
