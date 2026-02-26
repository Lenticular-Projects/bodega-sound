"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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

  const animationRef = useRef<number>(0);

  const updateProgress = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const current = audio.currentTime;
    const total = audio.duration && !isNaN(audio.duration) ? audio.duration : 0;
    const pct = total > 0 ? (current / total) * 100 : 0;

    if (fillRef.current) fillRef.current.style.width = `${pct}%`;
    if (seekRef.current) {
      if (!seekRef.current.max || seekRef.current.max === "0" || seekRef.current.max === "100") {
        seekRef.current.max = String(total);
      }
      if (document.activeElement !== seekRef.current) {
        seekRef.current.value = String(current);
      }
    }
    if (timeRef.current)
      timeRef.current.textContent = `${formatTime(current)} / ${formatTime(total)}`;

    if (!audio.paused) {
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  }, []);

  const handlePlayEvent = () => {
    setIsPlaying(true);
    animationRef.current = requestAnimationFrame(updateProgress);
  };

  const handlePauseEvent = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = useCallback(() => {
    // Fallback for native events when paused
    if (audioRef.current && audioRef.current.paused) {
      updateProgress();
    }
  }, [updateProgress]);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const total = audio.duration && !isNaN(audio.duration) ? audio.duration : 0;
    if (seekRef.current) {
      seekRef.current.max = String(total);
      seekRef.current.value = "0";
    }
    if (timeRef.current)
      timeRef.current.textContent = `0:00 / ${formatTime(total)}`;
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      // Immediately update fill so it doesn't lag on scrub
      const total = audioRef.current.duration && !isNaN(audioRef.current.duration) ? audioRef.current.duration : 0;
      const pct = total > 0 ? (time / total) * 100 : 0;
      if (fillRef.current) fillRef.current.style.width = `${pct}%`;
      if (timeRef.current)
        timeRef.current.textContent = `${formatTime(time)} / ${formatTime(total)}`;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-warm-950/95 backdrop-blur-md pb-safe overflow-hidden">
      {/* Scrubber row — positioned exactly at the top edge of the player. 
          The group hover effect makes the line slightly thicker for interactability. */}
      <div className="absolute top-0 left-0 right-0 h-4 -mt-2 group z-10">
        {/* Visual track: h-px centered in the h-4 touch area (top-2). Hover makes it thicker and slightly brighter. */}
        <div className="absolute inset-x-0 h-[2px] bg-white/10 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 group-hover:h-[4px] group-hover:bg-white/20">
          {/* Yellow fill */}
          <div
            ref={fillRef}
            className="absolute inset-y-0 left-0 bg-bodega-yellow w-0 transition-none"
          />
        </div>
        {/* Invisible range input — sits over the full h-4 hitbox */}
        <input
          ref={seekRef}
          type="range"
          min={0}
          max={100}
          step={0.01}
          defaultValue={0}
          onChange={handleSeek}
          aria-label="Seek audio position"
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4 mt-1 border-t border-transparent">
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
        onPlay={handlePlayEvent}
        onPause={handlePauseEvent}
        src="/music/mixes/CHAMPAGNE COAST (A$TRIDX, YLMRN JERSEY  EDIT)/CHAMPAGNE COAST (A$TRIDX, YLMRN JERSEY  EDIT).mp3"
      />
    </div>
  );
}
