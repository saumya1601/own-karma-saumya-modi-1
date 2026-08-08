"use client";

import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePreferences } from "@/lib/usePreferences";

export interface Act06PhilosophyProps {
  onComplete?: () => void;
  onBack?: () => void;
  initialProgress?: number;
}

const STATEMENTS: { subject: string; predicate: string }[] = [
  { subject: "LUXURY", predicate: "is temporary." },
  { subject: "MEANING", predicate: "is timeless." },
  { subject: "STATUS", predicate: "belongs to others." },
  { subject: "CHARACTER", predicate: "belongs to you." },
  { subject: "FASHION", predicate: "changes." },
  { subject: "PURPOSE", predicate: "remains." },
];

const TIMING = {
  charFadeDuration: 0.55,
  charStagger: 0.06,
  hairlineDuration: 0.7,
  predicateDuration: 0.7,
  holdSeconds: 1.4,
  fadeOutDuration: 0.9,
  gapBetween: 0.7,
  reducedMotion: {
    holdSeconds: 2.5,
    fadeOutDuration: 0.6,
    gapBetween: 0.5,
  },
} as const;

const STARS: { top: string; left: string; size: number; duration: number; delay: number }[] = [
  { top: "9%", left: "14%", size: 1.4, duration: 4.5, delay: 0.0 },
  { top: "14%", left: "78%", size: 1.0, duration: 6.0, delay: 1.8 },
  { top: "20%", left: "36%", size: 1.6, duration: 5.2, delay: 2.5 },
  { top: "26%", left: "88%", size: 1.2, duration: 4.8, delay: 3.4 },
  { top: "34%", left: "8%", size: 1.0, duration: 6.5, delay: 1.2 },
  { top: "42%", left: "72%", size: 1.4, duration: 5.8, delay: 0.7 },
  { top: "56%", left: "22%", size: 1.2, duration: 6.8, delay: 4.2 },
  { top: "62%", left: "82%", size: 1.5, duration: 5.6, delay: 3.1 },
  { top: "72%", left: "10%", size: 1.0, duration: 7.2, delay: 4.6 },
  { top: "78%", left: "56%", size: 1.4, duration: 5.5, delay: 2.0 },
  { top: "84%", left: "90%", size: 0.9, duration: 6.4, delay: 1.5 },
  { top: "88%", left: "34%", size: 1.2, duration: 6.0, delay: 3.7 },
];

/**
 * ACT VI — "The Philosophy"
 *
 * Six statements, one at a time, on black. Editorial two-line composition:
 * monumental uppercase subject → gold hairline expansion → italic predicate.
 * "Statements. No paragraphs." — spec.
 *
 * See _documents/OWN_KARMA_Landing_Page_Experience_Spec.md — ACT VI.
 */
export function Act06Philosophy({ onComplete }: Act06PhilosophyProps) {
  const { prefersReducedMotion } = usePreferences();
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const subjectCharRefs = useRef<(HTMLSpanElement | null)[][]>(
    STATEMENTS.map((s) =>
      new Array<HTMLSpanElement | null>(Array.from(s.subject).length).fill(null)
    )
  );
  const hairlineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const predicateRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useLayoutEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => onCompleteRef.current?.(),
    });

    let cursor = 0;

    STATEMENTS.forEach((_stmt, i) => {
      const group = groupRefs.current[i];
      const chars = subjectCharRefs.current[i].filter(
        (c): c is HTMLSpanElement => c !== null
      );
      const hairline = hairlineRefs.current[i];
      const predicate = predicateRefs.current[i];
      if (!group || !hairline || !predicate || chars.length === 0) return;

      if (prefersReducedMotion) {
        tl.set(group, { opacity: 1 }, cursor);
        tl.set(chars, { opacity: 1, y: 0 }, cursor);
        tl.set(hairline, { scaleX: 1, opacity: 1 }, cursor);
        tl.set(predicate, { opacity: 0.9, y: 0 }, cursor);
        cursor += TIMING.reducedMotion.holdSeconds;
        tl.to(
          group,
          {
            opacity: 0,
            duration: TIMING.reducedMotion.fadeOutDuration,
            ease: "power2.in",
          },
          cursor
        );
        cursor += TIMING.reducedMotion.fadeOutDuration;
      } else {
        tl.set(group, { opacity: 1 }, cursor);
        tl.set(chars, { opacity: 0, y: 14 }, cursor);
        tl.set(hairline, { scaleX: 0, opacity: 1 }, cursor);
        tl.set(predicate, { opacity: 0, y: 12 }, cursor);

        // 1. Subject reveal — letter by letter.
        chars.forEach((char, ci) => {
          tl.to(
            char,
            {
              opacity: 1,
              y: 0,
              duration: TIMING.charFadeDuration,
              ease: "power2.out",
            },
            cursor + ci * TIMING.charStagger
          );
        });
        cursor += (chars.length - 1) * TIMING.charStagger + TIMING.charFadeDuration;

        // 2. Gold hairline expands from center — the "moment".
        tl.to(
          hairline,
          {
            scaleX: 1,
            duration: TIMING.hairlineDuration,
            ease: "power3.inOut",
          },
          cursor
        );
        cursor += TIMING.hairlineDuration;

        // 3. Predicate rises into place.
        tl.to(
          predicate,
          {
            opacity: 0.9,
            y: 0,
            duration: TIMING.predicateDuration,
            ease: "power2.out",
          },
          cursor
        );
        cursor += TIMING.predicateDuration;

        // 4. Hold — whole composition breathes gently.
        tl.to(
          group,
          {
            scale: 1.015,
            duration: TIMING.holdSeconds / 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1,
          },
          cursor
        );
        cursor += TIMING.holdSeconds;

        // 5. Dissolve the whole composition together.
        tl.to(
          group,
          {
            opacity: 0,
            duration: TIMING.fadeOutDuration,
            ease: "power2.inOut",
          },
          cursor
        );
        cursor += TIMING.fadeOutDuration;
      }

      if (i < STATEMENTS.length - 1) {
        cursor += prefersReducedMotion
          ? TIMING.reducedMotion.gapBetween
          : TIMING.gapBetween;
      }
    });

    tl.to({}, { duration: 0.001 }, cursor);

    return () => {
      tl.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-(--ok-black) px-6 select-none overflow-hidden">
      {/* Ambient constellation drifting far behind the composition */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {STARS.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#F4F0E8] shadow-[0_0_4px_1px_rgba(232,200,122,0.35)]"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationName: "starTwinkle",
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
              animationIterationCount: "infinite",
              animationTimingFunction: "ease-in-out",
            }}
          />
        ))}
      </div>

      {/* Soft breathing gold aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-260 max-h-260 rounded-full bg-radial from-(--ok-gold)/15 via-(--ok-gold)/4 to-transparent pointer-events-none filter blur-3xl animate-[auraBreathe_6s_ease-in-out_infinite]" />

      {/* Screen reader fallback */}
      <div className="sr-only">
        <p>
          Luxury is temporary. Meaning is timeless. Status belongs to others.
          Character belongs to you. Fashion changes. Purpose remains.
        </p>
      </div>

      <div
        className="relative z-10 w-full flex items-center justify-center"
        aria-hidden="true"
      >
        {STATEMENTS.map((stmt, qIndex) => (
          <div
            key={`${qIndex}-${stmt.subject}`}
            ref={(el) => {
              groupRefs.current[qIndex] = el;
            }}
            className="absolute flex flex-col items-center gap-6 opacity-0"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Subject — monumental uppercase, wide tracking */}
            <h2
              className="whitespace-nowrap uppercase font-light"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "clamp(2.8rem, 7vw, 6rem)",
                letterSpacing: "0.28em",
                color: "var(--ok-ivory)",
                lineHeight: 1.05,
                paddingLeft: "0.28em",
              }}
            >
              {Array.from(stmt.subject).map((char, cIndex) => (
                <span
                  key={cIndex}
                  ref={(el) => {
                    subjectCharRefs.current[qIndex][cIndex] = el;
                  }}
                  className="inline-block"
                  style={{ opacity: 0 }}
                >
                  {char}
                </span>
              ))}
            </h2>

            {/* Gold hairline — expands from center as the moment lands */}
            <div
              ref={(el) => {
                hairlineRefs.current[qIndex] = el;
              }}
              className="h-px w-40 bg-linear-to-r from-transparent via-[#C9A55A] to-transparent shadow-[0_0_10px_rgba(201,165,90,0.5)]"
              style={{ transformOrigin: "center", transform: "scaleX(0)" }}
            />

            {/* Predicate — italic, slightly smaller, contemplative */}
            <p
              ref={(el) => {
                predicateRefs.current[qIndex] = el;
              }}
              className="italic font-light whitespace-nowrap"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "clamp(1.4rem, 3.2vw, 2.6rem)",
                color: "var(--ok-ivory)",
                letterSpacing: "0.02em",
                opacity: 0,
              }}
            >
              {stmt.predicate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}



