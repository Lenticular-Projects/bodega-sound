"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@/components/icons";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { FlipTextReveal } from "@/components/ui/flip-text-reveal";

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Breathing animation for background
    const breatheAnimation = () => {
      if (!heroRef.current) return;

      heroRef.current.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.02)" },
          { transform: "scale(1)" },
        ],
        {
          duration: 4000,
          iterations: Infinity,
          easing: "ease-in-out",
        },
      );
    };

    breatheAnimation();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Gradient orbs for atmosphere */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-bodega-yellow/5 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[150px] animate-pulse delay-1000" />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 w-full"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.p
          variants={fadeUp}
          className="text-sm tracking-[0.4em] mb-0 text-warm-400 font-mono uppercase"
        >
          Quarterly Sonic Experiences
        </motion.p>

        {/* Logo Container - Ultra Tight Lockup */}
        <div className="relative flex flex-col items-center justify-center w-full mx-auto mb-0 select-none">
          <h1 className="sr-only">BODEGA SOUND</h1>

          <FlipTextReveal
            text="BODEGA"
            className="text-bodega-yellow leading-[0.65] tracking-[-0.03em] text-[clamp(4rem,11.5vw,13rem)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
            style={{ textShadow: "0 0 40px rgba(229, 255, 0, 0.25)" }}
          />

          {/* Tucked "SOUND" - Maximum overlap */}
          <FlipTextReveal
            text="SOUND"
            className="text-zinc-900 dark:text-white leading-[0.65] tracking-[-0.03em] text-[clamp(4rem,11.5vw,13rem)] mt-[-0.75em] z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
            delay={0.4}
          />
        </div>

        <motion.p
          variants={fadeUp}
          className="text-base md:text-lg max-w-lg mx-auto mb-10 text-zinc-600 dark:text-warm-300 leading-relaxed mt-[-1.2rem]"
        >
          International DJ secret location at Mila&apos;s Underground
          Collective. Step into the venue at 2 AM.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-col md:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#next-event"
            className="group px-10 py-5 bg-bodega-yellow text-[#0A0A08] font-bold text-lg rounded-sm hover:bg-bodega-yellow-light transition-all duration-300 flex items-center gap-3 shadow-[0_0_40px_rgba(229,255,0,0.3)] hover:shadow-[0_0_60px_rgba(229,255,0,0.5)]"
          >
            ENTER THE VOID
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>

          <a
            href="/archive"
            className="px-10 py-5 border border-zinc-300 dark:border-warm-600 text-zinc-700 dark:text-warm-200 font-medium text-lg rounded-sm hover:border-black dark:hover:border-bodega-yellow hover:text-black dark:hover:text-bodega-yellow transition-all duration-300"
          >
            VIEW ARCHIVE
          </a>
        </motion.div>
      </motion.div>


    </section>
  );
}
