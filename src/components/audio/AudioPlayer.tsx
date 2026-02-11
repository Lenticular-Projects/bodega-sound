"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayIcon,
  PauseIcon,
  VolumeUpIcon,
  VolumeMuteIcon,
  MusicIcon,
} from "@/components/icons";

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showEnableAudio, setShowEnableAudio] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-show enable audio button on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEnableAudio(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const enableAudio = () => {
    setShowEnableAudio(false);
    togglePlay();
  };

  return (
    <>
      {/* Enable Audio Prompt */}
      <AnimatePresence>
        {showEnableAudio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-28 right-4 md:bottom-24 md:right-6 z-50"
          >
            <button
              onClick={enableAudio}
              className="flex items-center gap-3 px-6 py-4 bg-bodega-yellow text-[#0A0A08] font-bold rounded-sm shadow-lg hover:bg-bodega-yellow-light transition-colors duration-300"
            >
              <MusicIcon className="w-5 h-5" />
              ENABLE SOUND
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Player Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A08]/95 backdrop-blur-md border-t border-warm-800"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-warm-800 rounded-sm flex items-center justify-center">
              <MusicIcon className="w-6 h-6 text-bodega-yellow" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">BODEGA RADIO</p>
              <p className="text-warm-500 text-xs">
                Continuous mix • PinkPantheress vibes
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="w-12 h-12 bg-bodega-yellow rounded-full flex items-center justify-center hover:bg-bodega-yellow-light transition-colors duration-300"
            >
              {isPlaying ? (
                <PauseIcon className="w-5 h-5 text-[#0A0A08] fill-current" />
              ) : (
                <PlayIcon className="w-5 h-5 text-[#0A0A08] fill-current ml-1" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="p-2 text-warm-400 hover:text-white transition-colors duration-300"
            >
              {isMuted ? (
                <VolumeMuteIcon className="w-5 h-5" />
              ) : (
                <VolumeUpIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Audio Element - placeholder */}
        <audio
          ref={audioRef}
          loop
        // src="/audio/ambient-mix.mp3"  // Add actual audio file later
        />
      </motion.div>
    </>
  );
}
