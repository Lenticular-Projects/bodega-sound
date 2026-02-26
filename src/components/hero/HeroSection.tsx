"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, breathe } from "@/lib/animations";
import { FlipTextReveal } from "@/components/ui/flip-text-reveal";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { EventCountdown } from "@/components/events/EventCountdown";

export function HeroSection() {
  return (
    <motion.section
      animate={breathe.animate}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* Gradient orbs for atmosphere — breathe preset, not animate-pulse */}
      <motion.div
        animate={breathe.animate}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-bodega-yellow/5 rounded-full blur-[150px]"
      />
      <motion.div
        animate={{
          ...breathe.animate,
          transition: { ...breathe.animate.transition, delay: 2 },
        }}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[150px]"
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 w-full"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.p
          variants={fadeUp}
          className="text-sm tracking-[0.4em] mb-6 md:mb-0 text-warm-400 font-mono uppercase"
        >
          Quarterly Sonic Experiences
        </motion.p>

        {/* Logo Container - Ultra Tight Lockup */}
        <div className="relative flex flex-col items-center justify-center w-full mx-auto mb-0 select-none">
          <h1 className="sr-only">BODEGA SOUND</h1>

          {/* bodega-yellow glow — intentional brand signature */}
          <FlipTextReveal
            text="BODEGA"
            className="text-bodega-yellow leading-[0.65] tracking-[-0.03em] text-[clamp(4.5rem,16vw,13rem)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] [text-shadow:0_0_40px_rgba(229,255,0,0.25)]"
          />

          {/* Tucked "SOUND" - Maximum overlap */}
          <FlipTextReveal
            text="SOUND"
            className="text-zinc-900 dark:text-white leading-[0.65] tracking-[-0.03em] text-[clamp(4.5rem,16vw,13rem)] mt-[-0.5em] md:mt-[-0.75em] z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
            delay={0.4}
          />
        </div>

        <motion.p
          variants={fadeUp}
          className="text-base md:text-lg max-w-lg mx-auto mb-10 text-zinc-600 dark:text-warm-300 leading-relaxed mt-6 md:mt-[-1.2rem] px-4"
        >
          Manila&apos;s Underground Collective. International DJs. Secret Locations.
          Step into the venue at 2 AM.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-col md:flex-row gap-4 justify-center items-center"
        >
          {/* bodega-yellow glow — intentional brand signature */}
          <MagneticButton>
            <Link
              href="/shop"
              className="group px-10 py-5 bg-bodega-yellow text-warm-950 font-bold text-lg rounded-sm hover:bg-bodega-yellow-light transition-all duration-300 flex items-center gap-3 shadow-[0_0_40px_rgba(229,255,0,0.3)] hover:shadow-[0_0_60px_rgba(229,255,0,0.5)] min-w-[180px] justify-center"
            >
              SHOP
            </Link>
          </MagneticButton>

          <Link
            href="/archive"
            className="px-10 py-5 bg-zinc-900 dark:bg-black border-2 border-white/30 text-white font-medium text-lg rounded-sm hover:bg-zinc-800 dark:hover:bg-zinc-900 transition-all duration-300 min-w-[180px] text-center"
          >
            ARCHIVE
          </Link>

          {/* bodega-yellow glow — intentional brand signature */}
          <MagneticButton>
            <Link
              href="/events"
              className="group px-10 py-5 bg-bodega-yellow text-warm-950 font-bold text-lg rounded-sm hover:bg-bodega-yellow-light transition-all duration-300 flex items-center gap-3 shadow-[0_0_40px_rgba(229,255,0,0.3)] hover:shadow-[0_0_60px_rgba(229,255,0,0.5)] min-w-[180px] justify-center"
            >
              EVENTS
            </Link>
          </MagneticButton>
        </motion.div>

        <EventCountdown />
      </motion.div>
    </motion.section>
  );
}
