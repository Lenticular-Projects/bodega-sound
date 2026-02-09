"use client";

import { motion } from "framer-motion";
import { PlayIcon, YouTubeIcon } from "@/components/icons";
import { fadeUp, staggerContainer } from "@/lib/animations";

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
}

// Static data for MVP - would fetch from YouTube API
const videos: YouTubeVideo[] = [
  {
    id: "video-1",
    title: "Miles Medina - Live at Contrabanda IV",
    thumbnail: "/images/videos/miles-medina.jpg",
    duration: "1:23:45",
    views: "12.5K",
  },
  {
    id: "video-2",
    title: "Butta B - Future Beats & Baile Funk Set",
    thumbnail: "/images/videos/butta-b.jpg",
    duration: "58:32",
    views: "8.2K",
  },
  {
    id: "video-3",
    title: "Roy de Borja - Jersey Club & Electronic Mix",
    thumbnail: "/images/videos/roy-de-borja.jpg",
    duration: "1:05:18",
    views: "6.8K",
  },
  {
    id: "video-4",
    title: "Contrabanda III - Aftermovie",
    thumbnail: "/images/videos/aftermovie.jpg",
    duration: "4:32",
    views: "25.1K",
  },
];

function VideoCard({ video }: { video: YouTubeVideo }) {
  return (
    <motion.div variants={fadeUp} className="group cursor-pointer">
      <div className="relative aspect-video rounded-sm overflow-hidden bg-warm-800 mb-4">
        {/* Placeholder gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-warm-800 to-warm-900" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-bodega-yellow/0 group-hover:bg-bodega-yellow/10 transition-colors duration-300" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-12 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <PlayIcon className="w-6 h-6 text-white fill-current ml-1" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs text-white font-mono">
          {video.duration}
        </div>
      </div>

      <h3 className="text-white font-medium text-lg leading-tight group-hover:text-bodega-yellow transition-colors duration-300 line-clamp-2">
        {video.title}
      </h3>
      <p className="text-warm-500 text-sm mt-1">{video.views} views</p>
    </motion.div>
  );
}

export function YouTubeSection() {
  return (
    <section className="relative py-32 px-6">
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
              <p className="text-warm-400 font-mono text-sm tracking-wider">
                YOUTUBE CHANNEL
              </p>
            </div>
            <h2 className="font-['Bebas_Neue'] text-6xl md:text-8xl text-white tracking-tight">
              FULL SETS
            </h2>
          </div>

          <a
            href="https://youtube.com/@bodegasound"
            target="_blank"
            rel="noopener noreferrer"
            className="text-warm-400 hover:text-bodega-yellow transition-colors duration-300 flex items-center gap-2"
          >
            <span className="font-mono text-sm">@bodegasound</span>
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
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <a
            href="https://youtube.com/@bodegasound"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 border border-warm-600 text-warm-200 rounded-sm hover:border-red-600 hover:text-red-600 transition-all duration-300"
          >
            <YouTubeIcon className="w-5 h-5" />
            SUBSCRIBE FOR MORE
          </a>
        </motion.div>
      </div>
    </section>
  );
}
