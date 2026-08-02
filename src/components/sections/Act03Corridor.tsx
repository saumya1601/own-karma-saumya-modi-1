"use client";

import { useEffect, useRef, useState } from "react";

export interface Act03CorridorProps {
  /** Callback fired once the visitor advances to the next act. */
  onComplete?: () => void;
  /** Callback fired when visitor scrolls backward at the top of the corridor. */
  onBack?: () => void;
  /** Initial progress (0 for top, 1 for bottom when entering backward). */
  initialProgress?: number;
}

/**
 * ACT III — "The Corridor"
 * Direct Video Playback Engine. Plays the video directly without scroll effects.
 */
export function Act03Corridor({ onComplete }: Act03CorridorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const transitionFiredRef = useRef<boolean>(false);

  const [overlayOpacity, setOverlayOpacity] = useState<number>(1);

  // Smooth fade-in curtain transition on mount & video play start
  useEffect(() => {
    const timer = setTimeout(() => {
      setOverlayOpacity(0);
    }, 50);

    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }

    return () => clearTimeout(timer);
  }, []);

  const triggerComplete = () => {
    if (transitionFiredRef.current) return;
    transitionFiredRef.current = true;
    setOverlayOpacity(1);
    setTimeout(() => {
      onComplete?.();
    }, 800);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const progress = video.currentTime / video.duration;

    if (progressBarRef.current) {
      progressBarRef.current.style.transform = `scaleX(${progress})`;
    }
  };

  const handleVideoEnded = () => {
    triggerComplete();
  };

  return (
    <div className="fixed inset-0 select-none bg-black overflow-hidden">
      {/* Direct Fullscreen Video Player */}
      <video
        ref={videoRef}
        src="/videos/corridor_full.mp4"
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* Dark Luxury Vignette Gradient Overlay */}
      <div className="fixed inset-0 bg-radial from-transparent via-black/20 to-black/80 pointer-events-none z-10" />

      {/* Sleek Top Gold Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/40 z-30 pointer-events-none overflow-hidden">
        <div
          ref={progressBarRef}
          className="h-full w-full bg-gradient-to-r from-[var(--ok-gold)] via-[#E6CA65] to-[var(--ok-gold)] shadow-[0_0_12px_rgba(201,165,90,0.8)] origin-left transition-transform duration-100 ease-linear"
          style={{ transform: "scaleX(0)", willChange: "transform" }}
        />
      </div>

      {/* Fixed Bottom Action Button */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none">
        <button
          onClick={() => triggerComplete()}
          className="pointer-events-auto px-8 py-3 rounded-full bg-black/70 text-[#C9A55A] font-[var(--font-cormorant)] italic text-lg tracking-[0.3em] uppercase border border-[#C9A55A]/50 transition-all duration-500 hover:border-[#C9A55A] hover:bg-[#C9A55A]/20 hover:shadow-[0_0_25px_rgba(201,165,90,0.4)] cursor-pointer"
        >
          Enter The Discovery →
        </button>
      </div>

      {/* Smooth Curtain Fade Overlay for Transitions */}
      <div
        className="fixed inset-0 bg-black pointer-events-none z-50 transition-opacity duration-1000 ease-out"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}



