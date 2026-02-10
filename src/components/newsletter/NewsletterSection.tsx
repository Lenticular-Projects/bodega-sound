"use client";

import { motion } from "framer-motion";
import { EmailIcon } from "@/components/icons";
import { fadeUp } from "@/lib/animations";
import { NewsletterForm } from "./NewsletterForm";

export function NewsletterSection() {
  return (
    <section id="newsletter" className="relative pt-4 pb-32 px-6">
      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <span className="font-['Bebas_Neue'] text-[20vw] text-warm-200/50 dark:text-warm-800/30 whitespace-nowrap select-none transition-colors duration-300">
          JOIN US
        </span>
      </div>

      <div className="max-w-3xl mx-auto text-center relative">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-bodega-yellow/10 flex items-center justify-center">
              <EmailIcon className="w-8 h-8 text-bodega-yellow" />
            </div>
          </div>

          <h2 className="font-['Bebas_Neue'] text-6xl md:text-8xl text-zinc-900 dark:text-white tracking-tight mb-6 transition-colors duration-300">
            JOIN THE COLLECTIVE
          </h2>

          <p className="text-xl text-zinc-600 dark:text-warm-400 mb-12 max-w-xl mx-auto transition-colors duration-300">
            First access to tickets, secret locations, and after-hours content.
            Be the first to know about Contrabanda drops.
          </p>

          <NewsletterForm />

          <p className="text-zinc-500 dark:text-warm-600 text-sm mt-4 transition-colors duration-300">
            No spam. Only vibes. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
