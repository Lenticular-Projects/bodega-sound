"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { PlayIcon, ArrowRightIcon } from "@/components/icons";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { recentEvents, allEvents, type BodegaEvent } from "@/data/events";

const handleCardClick = (slideIndex: number) => {
  document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
  setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent("lumina-navigate", { detail: { index: slideIndex } })
    );
  }, 600);
};

function EventCard({ event, index }: { event: BodegaEvent; index: number }) {
  const slideIndex = allEvents.findIndex((e) => e.id === event.id);

  return (
    <motion.div
      variants={fadeUp}
      className="group relative overflow-hidden rounded-sm cursor-pointer"
      style={{
        marginTop: index % 2 === 1 ? "2rem" : "0",
      }}
      onClick={() => handleCardClick(slideIndex)}
    >
      {/* Card Background */}
      <div className="relative aspect-[3/4] bg-warm-800">
        <Image
          src={event.imageUrl}
          alt={event.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-bodega-yellow/0 group-hover:bg-bodega-yellow/10 transition-colors duration-500" />

        {/* Content overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A08] via-[#0A0A08]/20 to-transparent" />

        {/* Event info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-bodega-yellow font-mono text-xs tracking-wider mb-1">
            {event.date}
          </p>
          <h3 className="font-['Bebas_Neue'] text-3xl md:text-4xl text-white mb-1 tracking-tight">
            {event.name}
          </h3>
          <p className="text-warm-400 text-sm">{event.theme}</p>

          <p className="text-warm-500 text-xs mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {event.artists.join(" • ")}
          </p>
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-16 h-16 rounded-full bg-bodega-yellow/20 backdrop-blur-sm flex items-center justify-center border border-bodega-yellow/30 group-hover:scale-110 transition-transform duration-500">
            <PlayIcon className="w-6 h-6 text-bodega-yellow fill-current" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function PastEventsSection() {
  return (
    <section className="relative pt-8 pb-8 px-6 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-bodega-yellow/5 rounded-full blur-[200px] -translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-16"
        >
          <h2 className="font-['Bebas_Neue'] text-6xl md:text-8xl text-white tracking-tight mb-4">
            TIME CAPSULE
          </h2>
          <p className="text-xl text-warm-400 max-w-xl">
            Relive the nights that defined us. Each quarter, a new chapter in
            Manila&apos;s underground story.
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {recentEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Link
            href="/archive"
            className="group inline-flex items-center gap-3 px-8 py-4 border border-warm-600 text-warm-200 rounded-sm hover:border-bodega-yellow hover:text-bodega-yellow transition-all duration-300"
          >
            VIEW ALL ARCHIVES
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
