"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PlayIcon, YouTubeIcon } from "@/components/icons";
import { fadeUp, fadeUpDelayed, staggerContainer } from "@/lib/animations";

interface YouTubeVideo {
  id: string;
  title: string;
  duration?: string;
  views?: string;
}

const videos: YouTubeVideo[] = [
  {
    id: "BkttX6HE80c",
    title: "A$TRIDX | CONTRABANDA HALLOWEEN",
  },
  {
    id: "n1fYfyC3eOM",
    title: "SKY DOMINIQUE | CONTRABANDA",
  },
  {
    id: "n_tsiGTG3kE",
    title: "BUTTA B | CONTRABANDA HALLOWEEN",
  },
  {
    id: "1PrzUA8Z5h0",
    title: "CABU B2B BABY OLIV | CONTRABANDA",
  },
];

function VideoCard({ video }: { video: YouTubeVideo }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div variants={fadeUp} className="group cursor-pointer">
      <div
        className="relative aspect-video rounded-sm overflow-hidden bg-warm-800 mb-4"
        onClick={() => !isPlaying && setIsPlaying(true)}
      >
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full absolute inset-0"
          />
        ) : (
          <>
            <Image
              src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
              alt={video.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-bodega-yellow/10 border-2 border-bodega-yellow rounded-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-bodega-yellow transition-all duration-300 shadow-lg z-10">
                <PlayIcon className="w-6 h-6 text-bodega-yellow group-hover:text-warm-950 fill-current ml-1 transition-colors duration-300" />
              </div>
            </div>

            {/* Duration badge - Only if provided */}
            {video.duration && (
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs text-white font-mono z-10">
                {video.duration}
              </div>
            )}
          </>
        )}
      </div>

      <h3 className="text-white font-medium text-lg leading-tight group-hover:text-bodega-yellow transition-colors duration-300 line-clamp-2">
        {video.title}
      </h3>
      {video.views && (
        <p className="text-warm-500 text-sm mt-1">{video.views} views</p>
      )}
    </motion.div>
  );
}

export function YouTubeSection() {
  return (
    <section className="relative section-padding px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <YouTubeIcon className="w-6 h-6 text-red-600" />
              <p className="type-label text-warm-400">
                YOUTUBE CHANNEL
              </p>
            </div>
            <h2 className="type-headline text-5xl sm:text-6xl md:text-8xl text-white">
              FULL SETS
            </h2>
          </div>

          <a
            href="https://www.youtube.com/channel/UCpF9K0Lg4wlwNrqprRFRmxg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bodega Sound on YouTube"
            className="text-warm-500 hover:text-bodega-yellow transition-colors duration-300 flex items-center gap-2"
          >
            <YouTubeIcon className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="type-caption">BODEGA SOUND</span>
          </a>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={fadeUpDelayed.transition}
          className="mt-12 text-center"
        >
          <a
            href="https://www.youtube.com/channel/UCpF9K0Lg4wlwNrqprRFRmxg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 border border-warm-600 text-warm-200 rounded-sm hover:border-bodega-yellow hover:text-bodega-yellow transition-all duration-300"
          >
            <YouTubeIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
            @BODEGASOUND
          </a>
        </motion.div>
      </div>
    </section>
  );
}
