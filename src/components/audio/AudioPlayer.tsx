"use client";

import { useState, useRef } from "react";
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
  const audioRef = useRef<HTMLAudioElement>(null);

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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-warm-950/95 backdrop-blur-md border-t border-white/10 pb-safe">
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-10 h-10 bg-warm-800 rounded-sm flex items-center justify-center flex-shrink-0">
            <MusicIcon className="w-5 h-5 text-bodega-yellow" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium text-sm tracking-wide truncate">CHAMPAGNE COAST</p>
            <p className="text-warm-500 text-xs truncate">
              A$TRIDX, YLMRN JERSEY  EDIT
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={togglePlay}
            className="w-11 h-11 bg-bodega-yellow rounded-md flex items-center justify-center hover:scale-105 transition-transform duration-300"
          >
            {isPlaying ? (
              <PauseIcon className="w-4 h-4 text-warm-950 fill-current" />
            ) : (
              <PlayIcon className="w-4 h-4 text-warm-950 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={toggleMute}
            className="p-2.5 text-warm-400 hover:text-white transition-colors duration-300"
          >
            {isMuted ? (
              <VolumeMuteIcon className="w-5 h-5" />
            ) : (
              <VolumeUpIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        loop
        src="/music/mixes/CHAMPAGNE COAST (A$TRIDX, YLMRN JERSEY  EDIT)/CHAMPAGNE COAST (A$TRIDX, YLMRN JERSEY  EDIT).mp3"
      />
    </div>
  );
}
