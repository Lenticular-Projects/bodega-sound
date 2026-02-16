"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname === "/links") return null;

  return (
    <footer className="w-full pt-12 pb-32 md:pb-20 px-4 md:px-8 border-t border-zinc-200 dark:border-white/10 z-content relative bg-warm-50 dark:bg-[#0A0A08] transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-center gap-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Image
            src="/images/logo/bdg-yellow.png"
            alt="Bodega Sound"
            width={128}
            height={64}
            className="h-16 w-auto object-contain mb-4"
          />
          <p className="text-zinc-600 dark:text-warm-400 text-sm max-w-sm transition-colors duration-300">
            Manila&apos;s underground dance music collective. Quarterly sonic experiences. International DJs. Secret locations.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-start gap-4">
          <h3 className="text-xs font-bold tracking-widest text-zinc-500 dark:text-warm-500 uppercase transition-colors duration-300">Connect</h3>
          <div className="flex gap-6">
            <a
              href="https://www.instagram.com/bodega_sound/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 dark:text-warm-300 hover:text-black dark:hover:text-bodega-yellow transition-colors duration-300"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@bodega_sound"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 dark:text-warm-300 hover:text-black dark:hover:text-bodega-yellow transition-colors duration-300"
            >
              TikTok
            </a>
            <a
              href="https://www.youtube.com/channel/UCpF9K0Lg4wlwNrqprRFRmxg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 dark:text-warm-300 hover:text-black dark:hover:text-bodega-yellow transition-colors duration-300"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-white/5 text-[10px] font-bold tracking-[0.2em] text-zinc-400 dark:text-warm-500 uppercase transition-colors duration-300">
        {/* Mobile: stacked + centered */}
        <div className="flex flex-col items-center text-center gap-1 md:hidden">
          <p>&copy; 2026 BODEGA SOUND COLLECTIVE</p>
          <p>ALL RIGHTS RESERVED</p>
          <p className="mt-2">MANILA / TOKYO / MIAMI</p>
        </div>
        {/* Desktop: side by side */}
        <div className="hidden md:flex justify-between items-center">
          <p>&copy; 2026 BODEGA SOUND COLLECTIVE. ALL RIGHTS RESERVED.</p>
          <p>MANILA / TOKYO / MIAMI</p>
        </div>
      </div>
    </footer>
  );
}
