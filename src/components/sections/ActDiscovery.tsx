"use client";

import { useEffect, useRef, useState } from "react";

export interface ActDiscoveryProps {
  /** Callback fired when visitor completes Room 4 (Legacy) and hands off to Act V. */
  onComplete?: () => void;
  /** Callback fired when visitor scrolls backward at Room 1. */
  onBack?: () => void;
}

const ROOMS = [
  {
    id: 1,
    title: "ROOM ONE — SILENCE",
    text: "Every creation begins in silence.",
    video: "/videos/room1_silence.mp4",
  },
  {
    id: 2,
    title: "ROOM TWO — TIME",
    text: "Time never creates character. Choices do.",
    video: "/videos/room2_time.mp4",
  },
  {
    id: 3,
    title: "ROOM THREE — PURPOSE",
    text: "We don't make clothing. We preserve intention.",
    video: "/videos/room3_purpose.mp4",
  },
  {
    id: 4,
    title: "ROOM FOUR — LEGACY",
    text: "Everything fades. Meaning remains.",
    video: "/videos/room4_legacy.mp4",
  },
];

/**
 * ACT IV — "The Discovery" (4 Enormous Rooms)
 *
 * 4K AI Video background playback engine for the 4 rooms with direct scroll transitions.
 */
export function ActDiscovery({ onComplete, onBack }: ActDiscoveryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const transitionFiredRef = useRef(false);

  // Scroll Handler between the 4 rooms
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, clientHeight } = containerRef.current;
      const roomIdx = Math.min(3, Math.floor((scrollTop + clientHeight / 2) / clientHeight));
      setCurrentRoomIndex(roomIdx);

      // Play current room video and pause others
      videoRefs.current.forEach((v, idx) => {
        if (!v) return;
        if (idx === roomIdx) {
          if (v.paused) v.play().catch(() => {});
        } else {
          if (!v.paused) v.pause();
        }
      });
    };

    const handleWheel = (e: WheelEvent) => {
      const container = containerRef.current;
      if (!container || transitionFiredRef.current) return;
      const { scrollTop, clientHeight, scrollHeight } = container;
      const maxScroll = scrollHeight - clientHeight;

      if (scrollTop <= 0 && e.deltaY < -15) {
        transitionFiredRef.current = true;
        onBack?.();
      } else if (scrollTop >= maxScroll - 20 && e.deltaY > 15) {
        transitionFiredRef.current = true;
        onComplete?.();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      container.addEventListener("wheel", handleWheel, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [onComplete, onBack]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-y-auto bg-[#000000] select-none snap-y snap-mandatory"
      aria-label="Act IV: The Discovery"
    >
      {/* 4 Enormous Scrollable Rooms */}
      {ROOMS.map((room, idx) => (
        <section
          key={room.id}
          className="relative z-10 w-full h-screen flex flex-col items-center justify-center px-6 text-center snap-start overflow-hidden"
        >
          {/* 4K AI Video Background (Cropped to hide bottom-right AI watermark) */}
          <video
            ref={(el) => {
              videoRefs.current[idx] = el;
            }}
            src={room.video}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-85 filter brightness-90 contrast-105 transition-opacity duration-1000 scale-[1.08] -translate-y-2"
          />

          {/* Vignette Overlay for Seamless Dark Integration & Bottom-Right Watermark Mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 pointer-events-none z-5" />
          <div className="absolute bottom-0 right-0 w-64 h-32 bg-gradient-to-tl from-black via-black/90 to-transparent pointer-events-none z-5 blur-sm" />

          {/* Room Content */}
          <div className="relative z-10 space-y-4 max-w-3xl">
            {/* Room Title Tag */}
            <span className="text-xs uppercase tracking-[0.4em] text-[#C9A55A] font-mono filter drop-shadow-[0_0_10px_rgba(201,165,90,0.5)]">
              {room.title}
            </span>

            {/* Room Philosophical Text */}
            <h2 className="font-[var(--font-cormorant)] italic text-[#F4F0E8] text-4xl sm:text-6xl md:text-7xl font-light tracking-wide filter drop-shadow-[0_0_25px_rgba(201,165,90,0.5)]">
              "{room.text}"
            </h2>
          </div>

          {/* Scroll Down Indicator for Rooms 1-3, and Enter Realization Button for Room 4 */}
          {idx < ROOMS.length - 1 ? (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
              <span className="text-xs uppercase tracking-[0.3em] text-[#F4F0E8]/60 font-mono">
                Scroll to next room
              </span>
              <span className="text-[#C9A55A] text-2xl font-light animate-pulse">
                ↓
              </span>
            </div>
          ) : (
            <button
              onClick={() => onComplete?.()}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full bg-black/50 text-[#C9A55A] font-[var(--font-cormorant)] italic text-lg tracking-[0.3em] uppercase border border-[#C9A55A]/40 transition-all duration-500 hover:border-[#C9A55A] hover:bg-[#C9A55A]/15 hover:shadow-[0_0_25px_rgba(201,165,90,0.35)] z-20 cursor-pointer"
            >
              Enter Realization →
            </button>
          )}
        </section>
      ))}
    </div>
  );
}
