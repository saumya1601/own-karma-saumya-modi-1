"use client";

import { useEffect, useRef, useState } from "react";

export interface Act06PhilosophyProps {
  /** Callback fired when the philosophy statement ritual completes and hands off to Act VII. */
  onComplete?: () => void;
  /** Callback fired when visitor scrolls backward. */
  onBack?: () => void;
  /** Initial progress (0 for top, 1 for bottom when entering backward). */
  initialProgress?: number;
}

const STATEMENTS = [
  { noun: "LUXURY", sub: "is temporary." },
  { noun: "MEANING", sub: "is timeless." },
  { noun: "STATUS", sub: "belongs to others." },
  { noun: "CHARACTER", sub: "belongs to you." },
  { noun: "FASHION", sub: "changes." },
  { noun: "PURPOSE", sub: "remains." },
];

/**
 * ACT VI — "The Philosophy" (100% Scroll-Scrubbed Statement Engine)
 *
 * Minimalist fading presentation showcasing all 6 philosophy statements sequentially
 * tied directly to user scroll progress with zero clutter and 60fps blur dissolves.
 */
export function Act06Philosophy({ onComplete, onBack, initialProgress = 0 }: Act06PhilosophyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const transitionFiredRef = useRef(false);

  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);

  const [progress, setProgress] = useState<number>(0);
  const [statementIndex, setStatementIndex] = useState<number>(0);
  const [statementStyle, setStatementStyle] = useState({
    opacity: 0,
    y: 20,
    blur: 12,
  });

  // 1. 60fps Render Loop mapping scroll progress to statement index & opacity/blur fade
  useEffect(() => {
    let active = true;
    let animFrame: number;

    const renderLoop = () => {
      if (!active) return;

      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.12;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = Math.min(0.999, Math.max(0, currentProgressRef.current));
      const totalSlots = STATEMENTS.length;
      const rawSlot = p * totalSlots;
      const idx = Math.min(totalSlots - 1, Math.floor(rawSlot));
      const localP = rawSlot - idx; // 0.0 to 1.0 within current statement slot

      setStatementIndex(idx);

      // Compute fade in, hold, and fade out within current statement slot
      let opacity = 1;
      let y = 0;
      let blur = 0;

      if (localP < 0.25) {
        const factor = localP / 0.25;
        opacity = factor;
        y = (1 - factor) * 20;
        blur = (1 - factor) * 12;
      } else if (localP > 0.75) {
        const factor = (localP - 0.75) / 0.25;
        opacity = 1 - factor;
        y = -factor * 20;
        blur = factor * 12;
      }

      setStatementStyle({ opacity, y, blur });

      animFrame = requestAnimationFrame(renderLoop);
    };

    animFrame = requestAnimationFrame(renderLoop);
    return () => {
      active = false;
      cancelAnimationFrame(animFrame);
    };
  }, []);

  // 2. Scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (initialProgress === 1) {
      requestAnimationFrame(() => {
        if (!container) return;
        const maxScroll = container.scrollHeight - container.clientHeight;
        if (maxScroll > 0) {
          container.scrollTop = maxScroll;
          targetProgressRef.current = 1;
          currentProgressRef.current = 1;
          setProgress(1);
        }
      });
    }

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll <= 0) return;

      const rawProgress = Math.min(1, Math.max(0, scrollTop / maxScroll));
      setProgress(rawProgress);
      targetProgressRef.current = rawProgress;

      if (rawProgress >= 0.985 && !transitionFiredRef.current) {
        transitionFiredRef.current = true;
        onComplete?.();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (container.scrollTop <= 0 && e.deltaY < -15 && !transitionFiredRef.current) {
        transitionFiredRef.current = true;
        onBack?.();
      }
    };

    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const diffY = startY - e.touches[0].clientY;
      if (container.scrollTop <= 0 && diffY < -40 && !transitionFiredRef.current) {
        transitionFiredRef.current = true;
        onBack?.();
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [onComplete, onBack]);

  const handleProceed = () => {
    if (transitionFiredRef.current) return;
    transitionFiredRef.current = true;
    onComplete?.();
  };

  const current = STATEMENTS[statementIndex];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#000000] px-6 select-none text-center overflow-hidden"
      aria-label="Act VI: The Philosophy"
    >
      {/* Sleek Top Gold Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/40 z-30 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[var(--ok-gold)] via-[#E6CA65] to-[var(--ok-gold)] transition-all duration-75 shadow-[0_0_12px_rgba(201,165,90,0.8)]"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      {/* Statement Container (Centered in Pitch Darkness) */}
      <div
        className="max-w-4xl space-y-3 pointer-events-none z-10 transition-transform duration-75 ease-out"
        style={{
          opacity: statementStyle.opacity,
          transform: `translateY(${statementStyle.y}px)`,
          filter: `blur(${statementStyle.blur}px)`,
        }}
      >
        {/* Noun (Gold Serif Capitals) */}
        <h2 className="font-[var(--font-cormorant)] text-[#C9A55A] text-5xl sm:text-7xl md:text-8xl tracking-[0.35em] uppercase font-light drop-shadow-[0_0_20px_rgba(201,165,90,0.45)]">
          {current.noun}
        </h2>

        {/* Sub-Statement (Ivory Italic Serif) */}
        <p className="font-[var(--font-cormorant)] italic text-[#F4F0E8]/90 text-3xl sm:text-5xl md:text-6xl tracking-wide font-light">
          {current.sub}
        </p>
      </div>

      {/* Scrollable Track Container */}
      <div
        ref={scrollContainerRef}
        className="fixed inset-0 overflow-y-auto z-20 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="h-[450vh] w-full relative" />
      </div>

      {/* Fixed Bottom Scroll Indicator / Proceed Action */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none">
        {progress < 0.9 ? (
          <>
            <span className="text-xs uppercase tracking-[0.3em] text-[#F4F0E8]/60 font-mono">
              Scroll through the philosophy
            </span>
            <span className="text-[#C9A55A] text-2xl font-light animate-pulse">
              ↓
            </span>
          </>
        ) : (
          <button
            onClick={handleProceed}
            className="pointer-events-auto px-8 py-3 rounded-full bg-black/70 text-[#C9A55A] font-[var(--font-cormorant)] italic text-lg tracking-[0.3em] uppercase border border-[#C9A55A]/50 transition-all duration-500 hover:border-[#C9A55A] hover:bg-[#C9A55A]/20 hover:shadow-[0_0_25px_rgba(201,165,90,0.4)] cursor-pointer"
          >
            Enter The Community →
          </button>
        )}
      </div>

      {/* Accessibility Fallback */}
      <div className="sr-only">
        {STATEMENTS.map((item, i) => (
          <p key={i}>
            {item.noun} {item.sub}
          </p>
        ))}
      </div>
    </div>
  );
}
