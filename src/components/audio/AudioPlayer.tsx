"use client";

import { useState, useRef, useCallback } from "react";
import {
  PlayIcon,
  PauseIcon,
  VolumeUpIcon,
  VolumeMuteIcon,
  MusicIcon,
} from "@/components/icons";

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  // Ref-based DOM updates — same pattern as Lumina, no React state batching delay
  const fillRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const seekRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const current = audio.currentTime;
    const total = durationRef.current;
    const pct = total > 0 ? (current / total) * 100 : 0;

    if (fillRef.current) fillRef.current.style.width = `${pct}%`;
    if (seekRef.current) seekRef.current.value = String(current);
    if (timeRef.current)
      timeRef.current.textContent = `${formatTime(current)} / ${formatTime(total)}`;
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    durationRef.current = audio.duration;
    if (seekRef.current) {
      seekRef.current.max = String(audio.duration);
      seekRef.current.value = "0";
    }
    if (timeRef.current)
      timeRef.current.textContent = `0:00 / ${formatTime(audio.duration)}`;
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      // Immediately update fill so it doesn't lag on scrub
      const total = durationRef.current;
      const pct = total > 0 ? (time / total) * 100 : 0;
      if (fillRef.current) fillRef.current.style.width = `${pct}%`;
      if (timeRef.current)
        timeRef.current.textContent = `${formatTime(time)} / ${formatTime(total)}`;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-warm-950/95 backdrop-blur-md border-t border-white/10 pb-safe overflow-hidden">
      {/* Scrubber row — h-8 gives proper touch target; visual track is the inner h-px bar */}
      <div className="relative h-8 mx-3 md:mx-6 flex items-center group">
        {/* Visual track */}
        <div className="absolute inset-x-0 h-px bg-white/10 top-1/2 -translate-y-1/2 pointer-events-none">
          {/* Yellow fill — direct DOM ref, no React state */}
          <div
            ref={fillRef}
            className="absolute inset-y-0 left-0 bg-bodega-yellow w-0"
          />
        </div>
        {/* Invisible range input — sits over the full h-8 hitbox */}
        <input
          ref={seekRef}
          type="range"
          min={0}
          max={100}
          step={0.1}
          defaultValue={0}
          onChange={handleSeek}
          aria-label="Seek audio position"
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-6 pb-2.5 flex items-center justify-between gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-10 h-10 bg-warm-800 rounded-sm flex items-center justify-center flex-shrink-0">
            <MusicIcon className="w-5 h-5 text-bodega-yellow" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium text-sm tracking-wide truncate">CHAMPAGNE COAST</p>
            <p className="text-warm-500 text-xs truncate">
              A$TRIDX, YLMRN JERSEY EDIT
            </p>
          </div>
        </div>

        {/* Time display — direct DOM ref */}
        <span
          ref={timeRef}
          className="hidden md:block font-mono text-xs text-warm-500 tabular-nums flex-shrink-0"
        >
          0:00 / 0:00
        </span>

        {/* Controls */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="w-11 h-11 bg-bodega-yellow rounded-sm flex items-center justify-center hover:scale-105 transition-transform duration-300"
          >
            {isPlaying ? (
              <PauseIcon className="w-4 h-4 text-warm-950 fill-current" />
            ) : (
              <PlayIcon className="w-4 h-4 text-warm-950 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
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
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        src="/music/mixes/CHAMPAGNE COAST (A$TRIDX, YLMRN JERSEY  EDIT)/CHAMPAGNE COAST (A$TRIDX, YLMRN JERSEY  EDIT).mp3"
      />
    </div>
  );
}
