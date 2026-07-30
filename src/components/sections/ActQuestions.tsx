"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { usePreferences } from "@/lib/usePreferences";

export interface ActQuestionsProps {
  onComplete?: () => void;
}

const QUESTIONS = [
  "Who are you...",
  "When nobody is watching?",
  "What do you wear...",
  "When nobody needs to notice?",
  "What remains...",
  "When status disappears?",
];

// Centralized pacing config — tweak here instead of hunting through the timeline chain.
const TIMING = {
  fadeInDuration: 1.4,
  fadeOutDuration: 1.2,
  gapBetweenLines: 0.8,
  gapAfterPair: 1.4,
  // Hold duration scales with text length so short lines don't linger
  // and long lines aren't rushed. Tune the multiplier/floor to taste.
  holdMinSeconds: 2.2,
  holdPerCharSeconds: 0.045,
  blackSilenceDuration: 5.0,
  heartbeatInDuration: 0.4,
  heartbeatOutDuration: 0.6,
  finalSilenceDuration: 1.2,
  reducedMotion: {
    fadeInDuration: 1.0,
    holdDuration: 2.5,
    fadeOutDuration: 1.0,
  },
  skipButtonRevealDelay: 2000, // ms before the visible skip affordance fades in
} as const;

function getHoldDuration(text: string) {
  return Math.max(TIMING.holdMinSeconds, text.length * TIMING.holdPerCharSeconds);
}

/**
 * ACT II — "The Questions"
 *
 * Razor-sharp high-contrast serif typography:
 * Still black -> One sentence -> Large typography -> Centered
 *
 * See _documents/implementation_plans/act-ii-canonical-spec.md
 */
export function ActQuestions({ onComplete }: ActQuestionsProps) {
  const { prefersReducedMotion } = usePreferences();
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const glowRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const heartbeatRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const elRefs = textRefs.current;
    const glows = glowRefs.current;
    const heartbeat = heartbeatRef.current;

    // Master cinematic timeline
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.();
      },
    });
    timelineRef.current = tl;

    // Helper for pure razor-sharp sentence fade-in, hold, and fade-out
    const animateSentence = (index: number, isPairEnd: boolean) => {
      const el = elRefs[index];
      const glow = glows[index];
      if (!el) return;

      const holdDuration = getHoldDuration(QUESTIONS[index]);

      if (prefersReducedMotion) {
        tl.to(el, { opacity: 1, duration: TIMING.reducedMotion.fadeInDuration })
          .to(el, { opacity: 1, duration: TIMING.reducedMotion.holdDuration })
          .to(el, { opacity: 0, duration: TIMING.reducedMotion.fadeOutDuration });
        return;
      }

      // 1. Crystal-clear razor-sharp fade-in (opacity 0 -> 1, y 16px -> 0px)
      //    Glow blooms in parallel so the gold light feels alive, not static.
      tl.fromTo(
        el,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: TIMING.fadeInDuration,
          ease: "power2.out",
        }
      );
      if (glow) {
        tl.fromTo(
          glow,
          { opacity: 0.35 },
          { opacity: 1, duration: TIMING.fadeInDuration, ease: "power2.out" },
          "<" // play alongside the text fade-in
        );
      }

      // 2. Stillness hold beat — scaled to text length
      tl.to(el, { duration: holdDuration });

      // 3. Smooth dissolve fade-out into black (opacity 1 -> 0, y 0px -> -10px)
      //    Glow dims in sync.
      tl.to(el, {
        opacity: 0,
        y: -10,
        duration: TIMING.fadeOutDuration,
        ease: "power2.inOut",
      });
      if (glow) {
        tl.to(
          glow,
          { opacity: 0.35, duration: TIMING.fadeOutDuration, ease: "power2.inOut" },
          "<"
        );
      }

      // 4. Black pause between lines
      tl.to({}, { duration: isPairEnd ? TIMING.gapAfterPair : TIMING.gapBetweenLines });
    };

    // --- Sequence Execution ---
    // Question 1: Who are you... / When nobody is watching?
    animateSentence(0, false);
    animateSentence(1, true);

    // Question 2: What do you wear... / When nobody needs to notice?
    animateSentence(2, false);
    animateSentence(3, true);

    // Question 3: What remains... / When status disappears?
    animateSentence(4, false);
    animateSentence(5, true);

    // Five seconds of pure black silence
    tl.to({}, { duration: TIMING.blackSilenceDuration });

    // A single golden heartbeat pulse
    if (!prefersReducedMotion && heartbeat) {
      tl.to(heartbeat, {
        opacity: 0.85,
        scale: 1.08,
        duration: TIMING.heartbeatInDuration,
        ease: "power2.out",
      }).to(heartbeat, {
        opacity: 0,
        scale: 1.0,
        duration: TIMING.heartbeatOutDuration,
        ease: "power2.in",
      });
    }

    // Silence before screen opens into Act III
    tl.to({}, { duration: TIMING.finalSilenceDuration });

    return () => {
      tl.kill();
      gsap.globalTimeline.timeScale(1.0);
    };
  }, [onComplete, prefersReducedMotion]);

  // Fade in a visible skip affordance after a short delay, so impatient
  // sighted users have an option beyond discovering press-and-hold.
  useEffect(() => {
    const timeout = setTimeout(() => setShowSkip(true), TIMING.skipButtonRevealDelay);
    return () => clearTimeout(timeout);
  }, []);

  // Press-and-hold fast-forward
  const handlePointerDown = () => {
    if (timelineRef.current) {
      timelineRef.current.timeScale(4.0);
    }
  };

  const handlePointerUp = () => {
    if (timelineRef.current) {
      timelineRef.current.timeScale(1.0);
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="fixed inset-0 select-none bg-(--ok-black) cursor-default"
    >
      {/* Screen Reader Accessibility Fallback */}
      <div className="sr-only">
        <button type="button" onClick={() => onComplete?.()}>
          Skip intro questions
        </button>
        <p>
          Who are you when nobody is watching? What do you wear when nobody needs to notice? What remains when status disappears?
        </p>
      </div>

      {/* Visible skip affordance — understated, fades in after a short delay */}
      <button
        type="button"
        onClick={() => onComplete?.()}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute bottom-8 right-8 z-10 text-xs tracking-[0.2em] uppercase transition-opacity duration-1000"
        style={{
          color: "var(--ok-gold)",
          opacity: showSkip ? 0.4 : 0,
          fontFamily: "var(--font-cormorant), serif",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = showSkip ? "0.4" : "0")}
      >
        Skip
      </button>

      {/* Visual Canvas Container */}
      <div className="relative h-full w-full" aria-hidden="true">
        {/* Heartbeat radial gold pulse */}
        <div
          ref={heartbeatRef}
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0"
        >
          <div className="w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-radial from-(--ok-gold)/20 via-(--ok-gold)/5 to-transparent blur-2xl" />
        </div>

        {/* Centered Large Razor-Sharp Typography Container */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
          {QUESTIONS.map((text, index) => {
            // Odd indices are the "twist" line in each question pair —
            // slightly larger and non-italic so the pairing reads as
            // call-and-response rather than six identical beats.
            const isTwistLine = index % 2 === 1;

            return (
              <p
                key={`${index}-${text}`}
                ref={(el) => {
                  textRefs.current[index] = el;
                }}
                className={`absolute max-w-none text-center tracking-wide opacity-0 whitespace-nowrap ${isTwistLine ? "not-italic" : "italic"
                  }`}
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: isTwistLine
                    ? "clamp(2.3rem, 5.8vw, 5.1rem)"
                    : "clamp(2.2rem, 5.5vw, 4.8rem)",
                  fontWeight: isTwistLine ? 600 : 400,
                  color: "var(--ok-gold)",
                  lineHeight: 1.25,
                  willChange: "transform, opacity",
                }}
              >
                <span
                  ref={(el) => {
                    glowRefs.current[index] = el;
                  }}
                  style={{
                    display: "inline-block",
                    filter: "drop-shadow(0 0 20px rgba(201,165,90,0.35))",
                    opacity: 0.8,
                  }}
                >
                  {text}
                </span>
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}