"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface Act04DiscoveryProps {
  /** Callback fired when visitor completes Room 4 (Legacy) and hands off to Act V. */
  onComplete?: () => void;
  /** Callback fired when visitor scrolls backward at Room 1. */
  onBack?: () => void;
  /** Initial progress (0 for top, 1 for bottom when entering backward). */
  initialProgress?: number;
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
 * Animated Room Text Component
 * Provides luxury motion graphics: staged blur-in entrance, gold hairline expansion,
 * tracking expansion, and a soft breathing floating effect.
 */
function RoomText({ room, isActive }: { room: (typeof ROOMS)[0]; isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    const line = lineRef.current;
    const quote = quoteRef.current;

    if (!title || !line || !quote) return;

    if (isActive) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Reset initial state for fresh entrance
      gsap.set(title, { opacity: 0, y: 20, filter: "blur(8px)", letterSpacing: "0.3em" });
      gsap.set(line, { scaleX: 0, opacity: 0 });
      gsap.set(quote, { opacity: 0, y: 28, filter: "blur(12px)", scale: 0.97 });

      // 1. Room Title entrance with letter spacing expansion
      tl.to(title, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        letterSpacing: "0.45em",
        duration: 1.0,
      });

      // 2. Gold Hairline Divider expansion
      tl.to(line, { scaleX: 1, opacity: 1, duration: 0.8 }, "-=0.6");

      // 3. Philosophical Quote entrance with soft scale & glow bloom
      tl.to(
        quote,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          duration: 1.2,
        },
        "-=0.5"
      );

      // 4. Ambient breathing float
      tl.to(quote, {
        y: -5,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      return () => {
        tl.kill();
      };
    } else {
      gsap.to([title, line, quote], {
        opacity: 0,
        y: -15,
        filter: "blur(6px)",
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [isActive]);

  return (
    <div ref={containerRef} className="relative z-10 space-y-6 max-w-4xl px-4 flex flex-col items-center">
      {/* Room Title Tag */}
      <span
        ref={titleRef}
        className="inline-block text-xs uppercase tracking-[0.45em] text-[#C9A55A] font-mono filter drop-shadow-[0_0_12px_rgba(201,165,90,0.6)]"
      >
        {room.title}
      </span>

      {/* Gold Accent Hairline Line */}
      <div
        ref={lineRef}
        className="w-28 h-px bg-gradient-to-r from-transparent via-[#C9A55A] to-transparent origin-center opacity-0"
      />

      {/* Room Philosophical Quote Text */}
      <h2
        ref={quoteRef}
        className="font-[var(--font-cormorant)] italic text-[#F4F0E8] text-4xl sm:text-6xl md:text-7xl font-light tracking-wide filter drop-shadow-[0_0_30px_rgba(201,165,90,0.45)] leading-tight"
      >
        &ldquo;{room.text}&rdquo;
      </h2>
    </div>
  );
}

/**
 * ACT IV — "The Discovery" (4 Enormous Rooms)
 *
 * 4K AI Video background playback engine for the 4 rooms with direct scroll transitions
 * and precision motion typography.
 */
export function Act04Discovery({ onComplete, onBack, initialProgress = 0 }: Act04DiscoveryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const roomRefs = useRef<(HTMLElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const transitionFiredRef = useRef(false);

  // IntersectionObserver to detect active room with high accuracy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-room-index"));
            if (!isNaN(index)) {
              setCurrentRoomIndex(index);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    roomRefs.current.forEach((roomEl) => {
      if (roomEl) observer.observe(roomEl);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll & video control handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (initialProgress === 1) {
      requestAnimationFrame(() => {
        if (!container) return;
        const maxScroll = container.scrollHeight - container.clientHeight;
        if (maxScroll > 0) {
          container.scrollTop = maxScroll;
        }
      });
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, clientHeight } = containerRef.current;
      const roomIdx = Math.min(3, Math.floor((scrollTop + clientHeight / 2) / clientHeight));

      // Play current room video and pause others
      videoRefs.current.forEach((v, idx) => {
        if (!v) return;
        if (idx === roomIdx) {
          if (v.paused) v.play().catch(() => { });
        } else {
          if (!v.paused) v.pause();
        }
      });
    };

    const handleWheel = (e: WheelEvent) => {
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

    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!container || transitionFiredRef.current) return;
      const { scrollTop, clientHeight, scrollHeight } = container;
      const maxScroll = scrollHeight - clientHeight;
      const diffY = startY - e.touches[0].clientY;

      if (scrollTop <= 0 && diffY < -40) {
        transitionFiredRef.current = true;
        onBack?.();
      } else if (scrollTop >= maxScroll - 20 && diffY > 40) {
        transitionFiredRef.current = true;
        onComplete?.();
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("wheel", handleWheel, { passive: true });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [onComplete, onBack, initialProgress]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-y-auto bg-[#000000] select-none snap-y snap-mandatory"
      aria-label="Act IV: The Discovery"
    >
      {/* Top-Left Back Button */}
      {onBack && (
        <button
          type="button"
          onClick={() => onBack?.()}
          className="fixed top-6 left-6 z-50 text-xs font-mono uppercase tracking-[0.25em] text-[#C9A55A]/70 hover:text-[#C9A55A] transition-colors cursor-pointer flex items-center gap-2"
        >
          ← Back
        </button>
      )}
      {/* 4 Enormous Scrollable Rooms */}
      {ROOMS.map((room, idx) => (
        <section
          key={room.id}
          data-room-index={idx}
          ref={(el) => {
            roomRefs.current[idx] = el;
          }}
          className="relative z-10 w-full h-screen flex flex-col items-center justify-center px-6 text-center snap-start overflow-hidden"
        >
          {/* 4K AI Video Background */}
          <video
            ref={(el) => {
              videoRefs.current[idx] = el;
            }}
            src={room.video}
            autoPlay
            muted
            playsInline
            onEnded={() => {
              if (idx < ROOMS.length - 1) {
                containerRef.current?.scrollTo({
                  top: (idx + 1) * window.innerHeight,
                  behavior: "smooth",
                });
              } else if (!transitionFiredRef.current) {
                transitionFiredRef.current = true;
                onComplete?.();
              }
            }}
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-85 filter brightness-90 contrast-105 transition-opacity duration-1000"
          />

          {/* Vignette Overlay for Dark Integration */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 pointer-events-none z-5" />

          {/* Room Motion Typography Content */}
          <RoomText room={room} isActive={idx === currentRoomIndex} />

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
