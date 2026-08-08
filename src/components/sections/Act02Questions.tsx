"use client";

import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePreferences } from "@/lib/usePreferences";
import { audioEngine } from "@/utils/audioEngine";

export interface Act02QuestionsProps {
  onComplete?: () => void;
  /** Reserved for parent-driven navigation — spec has no back UI inside Act II. */
  onBack?: () => void;
}

const QUESTIONS = [
  "Who are you...",
  "When nobody is watching?",
  "What do you wear...",
  "When nobody needs to notice?",
  "What remains...",
  "When status disappears?",
];

const TIMING = {
  charFadeDuration: 0.7,
  charStagger: 0.12,
  fadeOutDuration: 1.2,
  gapBetweenLines: 0.9,
  gapAfterPair: 1.5,
  holdSeconds: 1.6,
  blackSilenceDuration: 5.0,
  heartbeatInDuration: 0.35,
  heartbeatOutDuration: 1.4,
  finalSilenceDuration: 0.6,
  reducedMotion: {
    holdDuration: 2.5,
    fadeOutDuration: 1.0,
  },
} as const;

/**
 * ACT II — "The Questions"
 *
 * Still black. One sentence at a time, revealed letter-by-letter in a large
 * ivory serif. After the six lines fade, five seconds of silence, then a
 * single heartbeat, then the screen "opens" into Act III.
 *
 * Spec: _documents/OWN_KARMA_Landing_Page_Experience_Spec.md — ACT II.
 */
export function Act02Questions({ onComplete }: Act02QuestionsProps) {
  const { prefersReducedMotion } = usePreferences();
  const rootRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const charRefs = useRef<(HTMLSpanElement | null)[][]>(
    QUESTIONS.map((text) =>
      new Array<HTMLSpanElement | null>(Array.from(text).length).fill(null)
    )
  );
  const heartbeatRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete's identity stable so the timeline effect doesn't rebuild
  // when the parent re-renders and passes a new inline callback.
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // useLayoutEffect guarantees every ref (parent <p> and each <span>) is
  // populated before we build the timeline — useEffect can fire on a paint
  // where refs are still being wired up in dev.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => onCompleteRef.current?.(),
      });

      // Explicit cursor — every tween is placed at a known absolute position.
      // No reliance on GSAP's implicit "end of previous" resolution, which was
      // silently collapsing stagger onto sentences 2–6.
      let cursor = 0;

      const animateSentence = (index: number, isPairEnd: boolean, isLast: boolean) => {
        const el = textRefs.current[index];
        if (!el) return;

        const chars = charRefs.current[index].filter(
          (c): c is HTMLSpanElement => c !== null
        );
        if (chars.length === 0) return;

        if (prefersReducedMotion) {
          tl.set(el, { opacity: 1 }, cursor)
            .set(chars, { opacity: 1, y: 0 }, cursor);
          cursor += TIMING.reducedMotion.holdDuration;
          tl.to(
            el,
            { opacity: 0, duration: TIMING.reducedMotion.fadeOutDuration },
            cursor
          );
          cursor += TIMING.reducedMotion.fadeOutDuration;
        } else {
          // 1. Reveal the parent paragraph (chars still hidden by their own
          //    inline opacity: 0).
          tl.set(el, { opacity: 1 }, cursor);

          // 2. Fire ONE callback that flips each letter's inline opacity/y.
          //    Each <span> carries its own `transition-delay` (baked into the
          //    JSX per-letter), so the browser natively cascades the reveal
          //    even though we mutate all letters in the same JS frame.
          tl.call(
            () => {
              for (const char of chars) {
                char.style.opacity = "1";
                char.style.transform = "translateY(0)";
              }
            },
            [],
            cursor
          );

          // 3. Advance cursor past the last letter's transition end.
          cursor += (chars.length - 1) * TIMING.charStagger + TIMING.charFadeDuration;

          // 4. Post-reveal hold beat.
          cursor += TIMING.holdSeconds;

          // 5. Whole line dissolves together (parent opacity).
          tl.to(
            el,
            {
              opacity: 0,
              duration: TIMING.fadeOutDuration,
              ease: "power2.inOut",
            },
            cursor
          );
          cursor += TIMING.fadeOutDuration;
        }

        if (!isLast) {
          cursor += isPairEnd ? TIMING.gapAfterPair : TIMING.gapBetweenLines;
        }
      };

      animateSentence(0, false, false);
      animateSentence(1, true, false);
      animateSentence(2, false, false);
      animateSentence(3, true, false);
      animateSentence(4, false, false);
      animateSentence(5, true, true);

      // Nothing. Five seconds. Silence.
      cursor += TIMING.blackSilenceDuration;

      // A heartbeat. One beat.
      const heartbeat = heartbeatRef.current;
      if (!prefersReducedMotion && heartbeat) {
        tl.call(() => audioEngine.triggerHeartbeat(), [], cursor);
        tl.to(
          heartbeat,
          {
            opacity: 1.0,
            scale: 1.2,
            duration: TIMING.heartbeatInDuration,
            ease: "power3.out",
          },
          cursor
        );
        cursor += TIMING.heartbeatInDuration;
        tl.to(
          heartbeat,
          {
            opacity: 0,
            scale: 2.0,
            duration: TIMING.heartbeatOutDuration,
            ease: "power2.inOut",
          },
          cursor
        );
        cursor += TIMING.heartbeatOutDuration;
      } else if (prefersReducedMotion) {
        tl.call(() => audioEngine.triggerHeartbeat(), [], cursor);
      }

      // Brief still moment before the parent hands off to Act III.
      cursor += TIMING.finalSilenceDuration;
      // Anchor the timeline's end so onComplete fires at `cursor`.
      tl.to({}, { duration: 0.001 }, cursor);
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={rootRef} className="fixed inset-0 select-none bg-(--ok-black) cursor-default">
      {/* Screen Reader Accessibility Fallback */}
      <div className="sr-only">
        <p>
          Who are you when nobody is watching? What do you wear when nobody needs to notice? What remains when status disappears?
        </p>
      </div>

      <div className="relative h-full w-full" aria-hidden="true">
        {/* Heartbeat radial gold pulse — the single beat + "the screen opens" */}
        <div
          ref={heartbeatRef}
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0"
        >
          <div className="w-[60vw] h-[60vw] max-w-180 max-h-180 rounded-full bg-radial from-(--ok-gold)/25 via-(--ok-gold)/6 to-transparent blur-2xl" />
        </div>

        {/* Centered, uniform-weight typography for all six questions */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
          {QUESTIONS.map((text, qIndex) => (
            <p
              key={`${qIndex}-${text}`}
              ref={(el) => {
                textRefs.current[qIndex] = el;
              }}
              className="absolute max-w-none text-center tracking-wide opacity-0 whitespace-nowrap italic"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "clamp(2.2rem, 5.5vw, 4.8rem)",
                fontWeight: 400,
                color: "var(--ok-ivory)",
                lineHeight: 1.25,
                willChange: "transform, opacity",
              }}
            >
              {Array.from(text).map((char, cIndex) => (
                <span
                  key={cIndex}
                  ref={(el) => {
                    charRefs.current[qIndex][cIndex] = el;
                  }}
                  className="inline-block"
                  style={{
                    opacity: 0,
                    transform: "translateY(14px)",
                    transition: `opacity ${TIMING.charFadeDuration}s ease-out, transform ${TIMING.charFadeDuration}s ease-out`,
                    transitionDelay: `${cIndex * TIMING.charStagger}s`,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
