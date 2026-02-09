"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EmailIcon, SuccessIcon } from "@/components/icons";
import { fadeUp } from "@/lib/animations";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call - would connect to actual backend
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSubmitted(true);
    setEmail("");
  };

  return (
    <section id="newsletter" className="relative py-32 px-6">
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

          {!isSubmitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 bg-transparent border-2 border-zinc-300 dark:border-warm-700 rounded-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-warm-600 focus:outline-none focus:border-bodega-yellow transition-colors duration-300"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-bodega-yellow text-[#0A0A08] font-bold rounded-sm hover:bg-bodega-yellow-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "SUBSCRIBING..." : "SUBSCRIBE"}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-bodega-yellow/20 flex items-center justify-center">
                <SuccessIcon className="w-8 h-8 text-bodega-yellow" />
              </div>
              <p className="text-bodega-yellow text-xl font-medium">
                YOU&apos;RE IN. WELCOME TO THE COLLECTIVE.
              </p>
            </motion.div>
          )}

          <p className="text-zinc-500 dark:text-warm-600 text-sm mt-4 transition-colors duration-300">
            No spam. Only vibes. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
