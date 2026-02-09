"use client";

import { motion } from "framer-motion";
import { CalendarIcon, LocationIcon, TicketIcon } from "@/components/icons";
import { fadeUp } from "@/lib/animations";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: string;
  imageUrl?: string;
  ticketUrl?: string;
  isActive: boolean;
}

// Static data for MVP - can migrate to database later
const nextEvent: Event = {
  id: "contrabanda-v",
  name: "CONTRABANDA V",
  date: "June 21, 2025",
  time: "10:00 PM - 6:00 AM",
  location: "Secret Location • Poblacion, Makati",
  description:
    "Our summer solstice celebration. 8 hours of house, techno, and open-format selections. Featuring international headliners and Manila's finest selectors.",
  capacity: "Limited Capacity • 500 Tickets",
  imageUrl: "/images/events/contrabanda-v.jpg",
  ticketUrl: "#tickets",
  isActive: true,
};

export function NextEventSection() {
  return (
    <section id="next-event" className="relative pt-32 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-16"
        >
          <p className="text-zinc-500 dark:text-bodega-yellow font-mono tracking-wider text-sm mb-2 transition-colors duration-300">
            NEXT GATHERING
          </p>
          <h2 className="font-['Bebas_Neue'] text-7xl md:text-9xl text-zinc-900 dark:text-white tracking-tight transition-colors duration-300">
            {nextEvent.name}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Event Details */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="space-y-8"
          >
            <p className="text-xl text-zinc-700 dark:text-warm-300 leading-relaxed transition-colors duration-300">
              {nextEvent.description}
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-zinc-700 dark:text-warm-200 transition-colors duration-300">
                <CalendarIcon className="w-5 h-5 text-zinc-900 dark:text-bodega-yellow transition-colors duration-300" />
                <span className="text-lg">
                  {nextEvent.date} • {nextEvent.time}
                </span>
              </div>

              <div className="flex items-center gap-4 text-zinc-700 dark:text-warm-200 transition-colors duration-300">
                <LocationIcon className="w-5 h-5 text-zinc-900 dark:text-bodega-yellow transition-colors duration-300" />
                <span className="text-lg">{nextEvent.location}</span>
              </div>

              <div className="flex items-center gap-4 text-zinc-700 dark:text-warm-200 transition-colors duration-300">
                <TicketIcon className="w-5 h-5 text-zinc-900 dark:text-bodega-yellow transition-colors duration-300" />
                <span className="text-lg">{nextEvent.capacity}</span>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="https://eventbrite.com/bodegasound"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full md:w-auto px-10 py-5 bg-black dark:bg-bodega-yellow text-white dark:text-[#0A0A08] font-bold text-lg rounded-sm hover:bg-zinc-800 dark:hover:bg-bodega-yellow-light transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(229,255,0,0.3)] hover:shadow-[0_0_60px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_60px_rgba(229,255,0,0.5)] text-center"
              >
                SECURE YOUR SPOT
              </a>
            </div>
          </motion.div>

          {/* Event Image */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="relative group"
          >
            <div className="absolute inset-0 bg-bodega-yellow/20 rounded-sm blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-zinc-200 dark:bg-warm-800 transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-[#0A0A08]/80 via-transparent to-transparent z-10" />

              {/* Placeholder for event image */}
              <div className="w-full h-full flex items-center justify-center bg-zinc-200 dark:bg-warm-800 transition-colors duration-300">
                <div className="text-center">
                  <p className="font-['Bebas_Neue'] text-6xl text-zinc-400 dark:text-warm-600 transition-colors duration-300">
                    COMING SOON
                  </p>
                  <p className="text-zinc-500 dark:text-warm-500 mt-2 transition-colors duration-300">Event artwork loading...</p>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 z-20">
                <p className="text-sm text-warm-400 font-mono mb-1">
                  FEATURING
                </p>
                <p className="text-2xl font-bold text-white">Headliner TBA</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
