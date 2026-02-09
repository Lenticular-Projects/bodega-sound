"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  YouTubeIcon,
  MusicIcon,
  MoreIcon,
  CloseIcon,
  CopyIcon,
  SuccessIcon,
} from "@/components/icons";
import { fadeUp, staggerContainer } from "@/lib/animations";

const links = [
  {
    title: "On Tour: Philippines | Miles Medina",
    subtitle: "Playlist • Bodega Sounds presents: Miles Medina live this January...",
    image: "/images/party-photos/optimized/DSC00070.webp",
    url: "https://www.youtube.com/channel/UCpF9K0Lg4wlwNrqprRFRmxg",
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DWY3TaVstqhgR",
  },
  {
    title: "MILES MEDINA IN MANILA MERCH",
    image: "/images/party-photos/optimized/DSC00098.webp",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSeDm_1NaY6prQv3Qe7KMbBLk7yxy9cJTqcILSdXeUfSw1Gqdg/viewform",
  },
  {
    title: "BUTTA B | CONTRABANDA HALLOWEEN",
    image: "/images/party-photos/optimized/DSC00194.webp",
    url: "https://youtu.be/n_tsiGTG3kE?si=sGaW3qIanlHysJ0A",
  },
  {
    title: "ROY DE BORJA | CONTRABANDA HALLOWEEN",
    image: "/images/party-photos/optimized/DSC00217.webp",
    url: "https://youtu.be/OXm_eJA6X9Q?si=Dk9vy3yR-RKiD6IJ",
  },
  {
    title: "A$TRIDX | CONTRABANDA HALLOWEEN",
    image: "/images/party-photos/optimized/DSC00266.webp",
    url: "https://youtu.be/BkttX6HE80c?si=E7UrfSZost9qGmkP",
  },
  {
    title: "SKY DOMINIQUE | CONTRABANDA",
    image: "/images/party-photos/optimized/DSC00317.webp",
    url: "https://youtu.be/n1fYfyC3eOM?si=oTSANy4db_jOWkJe",
  },
  {
    title: "MISS A & FATEEHA OF MOROBEATS | CONTRABANDA",
    image: "/images/party-photos/optimized/DSC00070.webp", // Reusing for demo
    url: "https://youtu.be/Craa3afUrnw?si=prTbSqi1YEJW17lh",
  },
  {
    title: "CABU B2B BABY OLIV | CONTRABANDA",
    image: "/images/party-photos/optimized/DSC00098.webp", // Reusing for demo
    url: "https://youtu.be/1PrzUA8Z5h0?si=Ari1sjVnOb0NAa7_",
  },
  {
    title: "OFFICIAL BODEGA SOUND MERCH",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSc2_2cFW-ez1vLFV6QJi7Z-RPTxYzeHltWE1BxZyFAtRoOCWQ/viewform",
  },
  {
    title: "YouTube",
    url: "https://www.youtube.com/channel/UCpF9K0Lg4wlwNrqprRFRmxg",
  },
  {
    title: "TikTok",
    url: "https://www.tiktok.com/@bodega_sound",
  },
];

export default function LinksPage() {
  const [selectedLink, setSelectedLink] = useState<typeof links[0] | null>(null);
  const [embedLink, setEmbedLink] = useState<typeof links[0] | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (selectedLink) {
      await navigator.clipboard.writeText(selectedLink.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLinkClick = (e: React.MouseEvent, link: typeof links[0]) => {
    if (link.embedUrl) {
      e.preventDefault();
      setEmbedLink(link);
    }
  };

  return (
    <main className="min-h-screen bg-black text-zinc-100 flex flex-col items-center selection:bg-[#E5FF00] selection:text-black pt-32 pb-16 relative overflow-hidden">

      {/* Profile Section */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="w-full max-w-md flex flex-col items-center px-4 z-10"
      >
        <motion.div variants={fadeUp} className="relative w-40 h-40 mb-6">
          <div className="absolute inset-0 bg-[#E5FF00] rounded-full blur-2xl opacity-20" />
          <Image
            src="/images/logo/bdg-yellow.png"
            alt="Bodega Sound Logo"
            width={160}
            height={160}
            className="rounded-full relative z-10 drop-shadow-2xl"
          />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-2xl font-bold tracking-tight mb-2"
        >
          Bodega Sound ™
        </motion.h1>

        <motion.div variants={fadeUp} className="flex gap-4 mb-8">
          <a href="https://www.youtube.com/channel/UCpF9K0Lg4wlwNrqprRFRmxg" target="_blank" className="hover:text-[#E5FF00] transition-colors p-2 hover:bg-zinc-900 rounded-full">
            <YouTubeIcon className="w-6 h-6" />
          </a>
          <a href="https://www.tiktok.com/@bodega_sound" target="_blank" className="hover:text-[#E5FF00] transition-colors p-2 hover:bg-zinc-900 rounded-full">
            <MusicIcon className="w-6 h-6" />
          </a>
        </motion.div>

        {/* Links List */}
        <div className="w-full space-y-4 px-2">
          {links.map((link, index) => (
            <motion.div
              key={link.title + index}
              variants={fadeUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative group w-full"
            >
              <div
                className="flex items-center gap-4 w-full p-2 bg-zinc-900/40 backdrop-blur-md rounded-full border border-zinc-800/30 shadow-lg hover:shadow-[#E5FF00]/5 transition-all duration-300"
              >
                {/* Main Clickable Area */}
                <a
                  href={link.url}
                  target="_blank"
                  onClick={(e) => handleLinkClick(e, link)}
                  className="absolute inset-0 z-10 rounded-full"
                  aria-label={`Visit ${link.title}`}
                />

                {/* Content */}
                <div className="relative w-14 h-14 flex-shrink-0 ml-1 z-0 pointer-events-none">
                  {link.image ? (
                    <Image
                      src={link.image}
                      alt={link.title}
                      fill
                      className="rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 rounded-full flex items-center justify-center">
                      <MusicIcon className="w-6 h-6 text-zinc-600" />
                    </div>
                  )}
                </div>

                <div className="flex-grow min-w-0 pr-2 pl-2 flex flex-col justify-center text-center z-0 pointer-events-none">
                  <h2 className={`font-semibold tracking-tight ${link.image ? 'text-[13px]' : 'text-[15px]'} text-zinc-100 group-hover:text-white transition-colors`}>
                    {link.title}
                  </h2>
                  {link.subtitle && (
                    <p className="text-[10px] text-zinc-500 truncate leading-tight mt-0.5 group-hover:text-zinc-400 transition-colors w-full">
                      {link.subtitle}
                    </p>
                  )}
                </div>

                {/* More/Share Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLink(link);
                  }}
                  className="relative z-20 pr-4 pl-2 py-2 hover:scale-110 transition-transform active:scale-95 cursor-pointer"
                  aria-label="Share link"
                >
                  <MoreIcon className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Links Footer */}
        <motion.div
          variants={fadeUp}
          className="mt-16 mb-20 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] text-zinc-500 font-medium tracking-wide uppercase opacity-60 hover:opacity-100 transition-opacity"
        >
          <button className="hover:text-zinc-400">Cookie Preferences</button>
          <span>•</span>
          <button className="hover:text-zinc-400">Report</button>
          <span>•</span>
          <button className="hover:text-zinc-400">Privacy</button>
          <span>•</span>
          <button className="hover:text-zinc-400">Explore</button>
        </motion.div>
      </motion.div>

      {/* Share Drawer */}
      <AnimatePresence>
        {selectedLink && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLink(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#18181B] rounded-t-[2rem] p-6 border-t border-zinc-800 shadow-2xl"
            >
              <div className="w-full max-w-md mx-auto flex flex-col items-center">
                <div className="w-12 h-1 bg-zinc-700 rounded-full mb-8" />

                <div className="flex justify-between items-center w-full mb-8">
                  <h3 className="text-lg font-bold">Share this link</h3>
                  <button
                    onClick={() => setSelectedLink(null)}
                    className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
                  >
                    <CloseIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-full bg-zinc-900 rounded-2xl p-4 flex items-center gap-4 mb-8">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    {selectedLink.image ? (
                      <Image
                        src={selectedLink.image}
                        alt={selectedLink.title}
                        fill
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 rounded-lg flex items-center justify-center">
                        <MusicIcon className="w-8 h-8 text-zinc-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-2">{selectedLink.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1 truncate">{selectedLink.url}</p>
                  </div>
                </div>

                <button
                  onClick={handleCopy}
                  className="w-full py-4 bg-zinc-100 text-black rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-white transition-colors active:scale-98"
                >
                  {copied ? (
                    <>
                      <SuccessIcon className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-5 h-5" />
                      Copy link
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Embed Drawer */}
      <AnimatePresence>
        {embedLink && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEmbedLink(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
            />
            <motion.div
              initial={{ y: "100%", x: "-50%" }}
              animate={{ y: 0, x: "-50%" }}
              exit={{ y: "100%", x: "-50%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 z-50 bg-[#18181B] rounded-t-[2rem] border-x border-t border-zinc-800 shadow-2xl h-[85vh] w-full max-w-2xl"
            >
              <div className="w-full h-full flex flex-col">
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-zinc-800">
                  <h3 className="text-sm font-bold truncate max-w-[80%]">{embedLink.title}</h3>
                  <button
                    onClick={() => setEmbedLink(null)}
                    className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
                  >
                    <CloseIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Iframe Container */}
                <div className="flex-grow w-full bg-zinc-950 relative">
                  <iframe
                    src={embedLink.embedUrl}
                    width="100%"
                    height="100%"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
