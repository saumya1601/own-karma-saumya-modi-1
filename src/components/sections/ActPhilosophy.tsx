"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface ActPhilosophyProps {
  /** Callback fired when the philosophy statement ritual completes and hands off to Act VII. */
  onComplete?: () => void;
  /** Callback fired when visitor scrolls backward. */
  onBack?: () => void;
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
 * ACT VI — "The Philosophy"
 *
 * Minimalist fading presentation showcasing all 6 philosophy statements sequentially
 * in pitch darkness with zero clutter, zero vertical lines, and zero arrows.
 */
export function ActPhilosophy({ onComplete, onBack }: ActPhilosophyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const statementBoxRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const transitionFiredRef = useRef(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (transitionFiredRef.current) return;
      if (e.deltaY < -15) {
        transitionFiredRef.current = true;
        onBack?.();
      } else if (e.deltaY > 15) {
        transitionFiredRef.current = true;
        onComplete?.();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [onComplete, onBack]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete?.();
        },
      });

      timelineRef.current = tl;

      STATEMENTS.forEach((_, idx) => {
        // Switch statement index in state
        tl.add(() => setCurrentIndex(idx));

        // 1. Soft Fade In + Blur Dissolve
        tl.fromTo(
          statementBoxRef.current,
          { opacity: 0, y: 16, filter: "blur(12px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.6, ease: "power2.out" }
        );

        // 2. Stillness beat holding the statement
        tl.to({}, { duration: 2.8 });

        // 3. Soft Fade Out + Blur Dissolve
        tl.to(statementBoxRef.current, {
          opacity: 0,
          y: -12,
          filter: "blur(10px)",
          duration: 1.2,
          ease: "power2.in",
        });

        // 4. Brief pause in pure darkness between statements
        tl.to({}, { duration: 0.5 });
      });

      // Final fade to black hand-off to Act VII
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 1.2,
        ease: "power2.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  // Press-and-hold fast-forward
  const handlePointerDown = () => {
    if (timelineRef.current) timelineRef.current.timeScale(3.5);
  };
  const handlePointerUp = () => {
    if (timelineRef.current) timelineRef.current.timeScale(1.0);
  };

  const current = STATEMENTS[currentIndex];

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#000000] px-6 select-none cursor-pointer text-center"
      aria-label="Act VI: The Philosophy"
    >
      {/* Statement Container (Centered in Pitch Darkness) */}
      <div ref={statementBoxRef} className="max-w-4xl space-y-3">
        {/* Noun (Gold Serif Capitals) */}
        <h2 className="font-[var(--font-cormorant)] text-[#C9A55A] text-5xl sm:text-7xl md:text-8xl tracking-[0.35em] uppercase font-light drop-shadow-[0_0_20px_rgba(201,165,90,0.45)]">
          {current.noun}
        </h2>

        {/* Sub-Statement (Ivory Italic Serif) */}
        <p className="font-[var(--font-cormorant)] italic text-[#F4F0E8]/90 text-3xl sm:text-5xl md:text-6xl tracking-wide font-light">
          {current.sub}
        </p>
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
