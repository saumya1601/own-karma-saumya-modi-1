"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";

/* ------------------------------------------------------------------ */
/*  LoadingUnboundFracture — redesigned                                */
/*  Palette (unchanged): slate-950 base · slate greys · amber accent   */
/*                                                                     */
/*  Narrative, synced exactly to real progress:                        */
/*    00–30%  BOUND      — the word rests, restrained by a bind line   */
/*    30–70%  FRACTURING — the line snaps, letters shatter outward     */
/*    70–100% UNBOUND    — letters return, "UN" materialises in amber  */
/*                                                                     */
/*  All letter motion lives on ONE paused GSAP timeline that is        */
/*  scrubbed by the loading progress. This makes the animation         */
/*  frame-accurate and deterministic, and avoids re-rendering React    */
/*  60 times per second (the old version called setState every tick).  */
/* ------------------------------------------------------------------ */

interface LoadingUnboundFractureProps {
  onComplete?: () => void;
  /** Total simulated load time in seconds. */
  duration?: number;
}

type Phase = "bound" | "fracturing" | "unbound";

const STATUS: Record<Phase, string> = {
  bound: "WE ARE BOUND",
  fracturing: "FRACTURING SYSTEM",
  unbound: "WE ARE UNBOUND",
};

const UN = ["U", "N"];
const BOUND = ["B", "O", "U", "N", "D"];
const PARTICLE_COUNT = 26;

/* Deterministic scatter target per letter — identical every run. */
const scatterOf = (i: number) => ({
  x: Math.sin(i * 2.7 + 1) * 92,
  y: Math.cos(i * 1.9 + 2) * 66,
  r: Math.sin(i * 3.3) * 24,
});

/* Deterministic burst target per particle (elliptical spread). */
const burstOf = (i: number) => {
  const a = (i / PARTICLE_COUNT) * Math.PI * 2 + (i % 3) * 0.4;
  const d = 74 + (i % 5) * 24;
  return { x: Math.cos(a) * d, y: Math.sin(a) * d * 0.72 };
};

/* Quadrant config for the exit split. */
const PANELS = [
  { panel: "top-0 left-0 border-r border-b", inner: "top-0 left-0", x: -105, y: -105, delay: 0 },
  { panel: "top-0 right-0 border-l border-b", inner: "top-0 right-0", x: 105, y: -105, delay: 0.08 },
  { panel: "bottom-0 left-0 border-r border-t", inner: "bottom-0 left-0", x: -105, y: 105, delay: 0.08 },
  { panel: "bottom-0 right-0 border-l border-t", inner: "bottom-0 right-0", x: 105, y: 105, delay: 0.16 },
];

/* useLayoutEffect on the client, useEffect during SSR (avoids the Next warning). */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function LoadingUnboundFracture({
  onComplete,
  duration = 7.5,
}: LoadingUnboundFractureProps) {
  const [phase, setPhase] = useState<Phase>("bound");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  /* ---------- refs (attached in the live scene only) ---------- */
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const unWrapRef = useRef<HTMLSpanElement>(null);
  const unLetterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const boundLetterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const echoLetterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const particleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const bindLineRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const barHeadRef = useRef<HTMLDivElement>(null);
  const buttonWrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const splitHRef = useRef<HTMLDivElement>(null);
  const splitVRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);

  const phaseRef = useRef<Phase>("bound");
  const loadedRef = useRef(false);
  const exitingRef = useRef(false);

  /* ------------------------------------------------------------ */
  /*  Boot: build the scrubbed timeline + drive the progress       */
  /* ------------------------------------------------------------ */
  useIsoLayoutEffect(() => {
    if (isExiting) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      /* Initial pose. Natural CSS equals the FINAL pose, so the static
         copies rendered during the exit split match pixel-for-pixel. */
      const unWidth = unWrapRef.current?.offsetWidth ?? 0;

      gsap.set(wordRef.current, { x: unWidth / 2 }); // optically centre "BOUND"
      gsap.set(unLetterRefs.current, { opacity: 0, x: -26, filter: "blur(8px)" });
      gsap.set(bindLineRef.current, {
        opacity: 1,
        scaleX: 1,
        boxShadow: "0 0 0px rgba(245,158,11,0)",
      });
      gsap.to(wordRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" });

      /* Master timeline — virtual clock 0 → 10, scrubbed by progress.
         0–3 bound · 3–7 fracture · 7–10 reassembly. */
      const tl = gsap.timeline({ paused: true, defaults: { overwrite: "auto" } });

      if (!reduceMotion) {
        /* Letters shatter out, then fly home. */
        boundLetterRefs.current.forEach((el, i) => {
          if (!el) return;
          const s = scatterOf(i);
          tl.to(el, { x: s.x, y: s.y, rotation: s.r, opacity: 0.12, filter: "blur(7px)", duration: 3.1, ease: "power2.inOut" }, 3 + i * 0.08);
          tl.to(el, { x: 0, y: 0, rotation: 0, opacity: 1, filter: "blur(0px)", duration: 2.3, ease: "power3.inOut" }, 7 + i * 0.07);
        });

        /* Amber "echo" copies drift the opposite way for depth. */
        echoLetterRefs.current.forEach((el, i) => {
          if (!el) return;
          const s = scatterOf(i);
          tl.fromTo(
            el,
            { x: 0, y: 0, rotation: 0, opacity: 0 },
            { x: -s.x * 0.55, y: -s.y * 0.55, rotation: -s.r * 0.6, opacity: 0.3, duration: 2.1, ease: "power2.out" },
            3.1 + i * 0.06
          );
          tl.to(el, { opacity: 0, duration: 1.6, ease: "power1.in" }, 5.3 + i * 0.05);
        });

        /* Ember particles burst from the word's centre. */
        particleRefs.current.forEach((el, i) => {
          if (!el) return;
          const b = burstOf(i);
          tl.fromTo(
            el,
            { xPercent: -50, yPercent: -50, x: 0, y: 0, opacity: 0, scale: 0.4 },
            { x: b.x, y: b.y, opacity: 0.9, scale: 1, duration: 2.1, ease: "power2.out" },
            3 + (i % 6) * 0.12
          );
          tl.to(el, { opacity: 0, scale: 0.2, duration: 1.3, ease: "power1.in" }, 5.5 + (i % 6) * 0.1);
        });
      } else {
        /* Reduced motion: a calm crossfade instead of scatter. */
        tl.to(boundLetterRefs.current, { opacity: 0.3, duration: 3, ease: "none" }, 3);
        tl.to(boundLetterRefs.current, { opacity: 1, duration: 2, ease: "none" }, 7);
      }

      /* The bind line flashes amber, then snaps as the fracture begins. */
      tl.to(bindLineRef.current, { backgroundColor: "rgba(245,158,11,0.95)", boxShadow: "0 0 12px rgba(245,158,11,0.6)", duration: 0.25 }, 2.7);
      tl.to(bindLineRef.current, { scaleX: 0, opacity: 0, duration: 0.6, ease: "power3.in" }, 3.0);

      /* Re-centre the word while "UN" materialises on the left. */
      tl.to(wordRef.current, { x: 0, duration: 1.8, ease: "power3.inOut" }, 6.8);
      unLetterRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.to(el, { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.5, ease: "power3.out" }, 7.9 + i * 0.35);
      });

      /* Soft amber bloom as the word completes — ends exactly at t = 10. */
      tl.fromTo(ringRef.current, { opacity: 0, scale: 0.7 }, { opacity: 0.5, scale: 1.1, duration: 0.9, ease: "power2.out" }, 8.2);
      tl.to(ringRef.current, { opacity: 0, scale: 1.35, duration: 0.9, ease: "power2.in" }, 9.1);

      /* Ambient scan sweep while loading. */
      let sweep: gsap.core.Tween | null = null;
      if (!reduceMotion) {
        sweep = gsap.fromTo(
          sweepRef.current,
          { y: "-30vh" },
          { y: "115vh", duration: 5.5, ease: "none", repeat: -1 }
        );
      }

      /* Progress driver: one tween scrubs the timeline and paints the HUD
         through refs — zero React re-renders per frame. */
      const progress = { v: 0 };
      gsap.to(progress, {
        v: 100,
        duration: reduceMotion ? Math.min(duration, 4) : duration,
        ease: "power2.inOut", // lingers while bound, rushes the fracture, settles the rebuild
        onUpdate: () => {
          const v = progress.v;
          tl.progress(v / 100);

          if (counterRef.current)
            counterRef.current.textContent = `${String(Math.round(v)).padStart(3, "0")}%`;
          if (barFillRef.current)
            barFillRef.current.style.transform = `scaleX(${v / 100})`;
          if (barHeadRef.current) barHeadRef.current.style.left = `${v}%`;

          const next: Phase = v > 70 ? "unbound" : v > 30 ? "fracturing" : "bound";
          if (next !== phaseRef.current) {
            phaseRef.current = next;
            setPhase(next); // only 2 state updates across the whole load
          }
        },
        onComplete: () => {
          tl.progress(1);
          if (counterRef.current) counterRef.current.textContent = "100%";
          sweep?.kill();
          if (sweepRef.current) gsap.to(sweepRef.current, { opacity: 0, duration: 0.6 });
          loadedRef.current = true;
          setIsLoaded(true);
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [duration, isExiting]);

  /* Crossfade the status line whenever the phase flips. */
  useEffect(() => {
    if (!statusRef.current) return;
    gsap.fromTo(
      statusRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
    );
  }, [phase]);

  /* Swap the progress readout for the enter button. */
  useEffect(() => {
    if (!isLoaded || isExiting) return;
    const tl = gsap.timeline();
    tl.to(metaRef.current, { opacity: 0, y: -10, duration: 0.4, ease: "power2.in" });
    tl.fromTo(
      buttonWrapRef.current,
      { opacity: 0, y: 16, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
      "-=0.05"
    );
    tl.set(buttonWrapRef.current, { pointerEvents: "auto" });
    return () => {
      tl.kill();
    };
  }, [isLoaded, isExiting]);

  /* ------------------------------------------------------------ */
  /*  Exit: hairlines draw across the centre, then the viewport    */
  /*  splits into four panels that fly to the corners.             */
  /* ------------------------------------------------------------ */
  const handleEnter = useCallback(() => {
    if (!loadedRef.current || exitingRef.current) return;
    exitingRef.current = true;

    const tl = gsap.timeline({ onComplete: () => setIsExiting(true) });
    tl.to(buttonRef.current, { scale: 0.94, duration: 0.12, ease: "power2.in" }, 0);
    tl.to(buttonWrapRef.current, { opacity: 0, y: 10, duration: 0.3, ease: "power2.in" }, 0.1);
    tl.fromTo(splitHRef.current, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.5, ease: "expo.inOut" }, 0.05);
    tl.fromTo(splitVRef.current, { scaleY: 0, opacity: 1 }, { scaleY: 1, duration: 0.5, ease: "expo.inOut" }, 0.12);
    tl.to([splitHRef.current, splitVRef.current], { opacity: 0.15, duration: 0.18 }, 0.64);
  }, []);

  useEffect(() => {
    if (!isExiting) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => onComplete?.() });
      panelRefs.current.forEach((panel, i) => {
        if (!panel) return;
        const cfg = PANELS[i];
        if (reduceMotion) {
          tl.to(panel, { opacity: 0, duration: 0.6, ease: "power1.inOut" }, 0);
          return;
        }
        tl.to(panel, { xPercent: cfg.x, yPercent: cfg.y, duration: 1.5, ease: "power4.inOut" }, cfg.delay);
        const inner = panel.querySelector("[data-inner]");
        if (inner) tl.to(inner, { scale: 1.06, duration: 1.5, ease: "power4.inOut" }, cfg.delay);
      });
    });

    return () => ctx.revert();
  }, [isExiting, onComplete]);

  /* ------------------------------------------------------------ */
  /*  Scene. `live` attaches refs + dynamic bits; the four exit    */
  /*  copies render the same markup in its natural (final) pose.   */
  /* ------------------------------------------------------------ */
  const renderScene = (live: boolean) => (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-slate-950">
      {/* Backdrop: faint grid, amber core glow, vignette */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40"
      />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.08),transparent_62%)]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,6,23,0.92)_100%)]" />

      {live && (
        <div
          ref={sweepRef}
          aria-hidden
          className="absolute inset-x-0 top-0 h-40 -translate-y-full bg-gradient-to-b from-transparent via-amber-500/[0.05] to-transparent"
        />
      )}

      {/* Corner frame + quiet system labels */}
      <div aria-hidden className="absolute left-5 top-5 h-5 w-5 border-l border-t border-slate-700/70" />
      <div aria-hidden className="absolute right-5 top-5 h-5 w-5 border-r border-t border-slate-700/70" />
      <div aria-hidden className="absolute bottom-5 left-5 h-5 w-5 border-b border-l border-slate-700/70" />
      <div aria-hidden className="absolute bottom-5 right-5 h-5 w-5 border-b border-r border-slate-700/70" />

      <div className="absolute left-10 top-8 flex items-center gap-2.5 font-mono text-[8px] uppercase tracking-[0.3em] text-slate-600">
        <span aria-hidden className="h-1 w-1 bg-amber-500/80" />
        Unbound // boot sequence
      </div>
      <div className="absolute bottom-8 right-10 font-mono text-[8px] uppercase tracking-[0.3em] text-slate-600">
        Fracture kernel
      </div>

      {/* The word */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {live && (
            <div
              ref={ringRef}
              aria-hidden
              className="absolute -inset-x-20 -inset-y-10 rounded-full bg-amber-500/10 opacity-0 blur-2xl"
            />
          )}

          <div
            ref={live ? wordRef : undefined}
            style={live ? { opacity: 0 } : undefined}
            className="relative flex text-4xl font-extralight tracking-[0.32em] text-slate-200 md:text-6xl"
          >
            <span ref={live ? unWrapRef : undefined} className="flex">
              {UN.map((char, i) => (
                <span
                  key={`un-${i}`}
                  ref={live ? (el) => { unLetterRefs.current[i] = el; } : undefined}
                  className="inline-block font-normal text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.45)] will-change-transform"
                >
                  {char}
                </span>
              ))}
            </span>

            <span className="relative flex">
              {BOUND.map((char, i) => (
                <span
                  key={`b-${i}`}
                  ref={live ? (el) => { boundLetterRefs.current[i] = el; } : undefined}
                  className="inline-block will-change-transform"
                >
                  {char}
                </span>
              ))}

              {/* Amber echo layer (fracture only) */}
              {live && (
                <span aria-hidden className="absolute inset-0 flex">
                  {BOUND.map((char, i) => (
                    <span
                      key={`echo-${i}`}
                      ref={(el) => { echoLetterRefs.current[i] = el; }}
                      className="inline-block text-amber-500 opacity-0 will-change-transform"
                    >
                      {char}
                    </span>
                  ))}
                </span>
              )}

              {/* The bind line — the thing that snaps at 30% */}
              {live && (
                <span
                  ref={bindLineRef}
                  aria-hidden
                  className="absolute -bottom-3 left-0 right-[0.32em] h-px origin-center scale-x-0 bg-slate-600 opacity-0"
                />
              )}
            </span>
          </div>

          {/* Ember particles */}
          {live && (
            <span aria-hidden className="pointer-events-none absolute inset-0">
              {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
                <span
                  key={`p-${i}`}
                  ref={(el) => { particleRefs.current[i] = el; }}
                  className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-amber-400 opacity-0"
                />
              ))}
            </span>
          )}
        </div>
      </div>

      {/* Progress readout ⇄ enter control (same slot) */}
      <div className="absolute bottom-20 left-1/2 h-16 w-72 -translate-x-1/2">
        {live && (
          <div ref={metaRef} className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col gap-3">
            <div className="flex items-end justify-between font-mono text-[9px] uppercase tracking-[0.28em]">
              <span ref={statusRef} className="text-slate-400">
                {STATUS[phase]}
              </span>
              <span ref={counterRef} className="font-semibold tabular-nums text-amber-400">
                000%
              </span>
            </div>
            <div className="relative h-px w-full bg-slate-800">
              <div
                ref={barFillRef}
                className="absolute inset-0 origin-left scale-x-0 bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.7)]"
              />
              <div
                ref={barHeadRef}
                style={{ left: "0%" }}
                className="absolute top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_10px_2px_rgba(245,158,11,0.8)]"
              />
            </div>
          </div>
        )}

        {live && (
          <div
            ref={buttonWrapRef}
            className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0"
          >
            <button
              ref={buttonRef}
              onClick={handleEnter}
              className="group relative cursor-pointer overflow-hidden rounded-full border border-amber-400/80 bg-transparent px-7 py-2.5 font-mono text-[10px] uppercase tracking-[0.28em] text-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.15)] transition-[background-color,color,box-shadow] duration-500 hover:bg-amber-400 hover:text-slate-950 hover:shadow-[0_0_32px_rgba(245,158,11,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-300/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
              <span className="relative">Enter The Universe</span>
            </button>
          </div>
        )}
      </div>

      {/* Exit hairlines — drawn just before the viewport splits */}
      {live && (
        <>
          <div
            ref={splitHRef}
            aria-hidden
            className="absolute left-0 right-0 top-1/2 h-px origin-center scale-x-0 bg-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
          />
          <div
            ref={splitVRef}
            aria-hidden
            className="absolute bottom-0 left-1/2 top-0 w-px origin-center scale-y-0 bg-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
          />
        </>
      )}
    </div>
  );

  /* ---------------------------- render ---------------------------- */

  if (!isExiting) {
    return (
      <div
        ref={rootRef}
        role="status"
        aria-live="polite"
        aria-label="Loading Unbound"
        className="fixed inset-0 z-[9999] select-none overflow-hidden bg-slate-950"
      >
        {renderScene(true)}
      </div>
    );
  }

  /* Four quadrants, each holding a full-viewport copy anchored to its own
     corner so the composite is seamless on the swap frame, then they slide
     apart along the hairlines with a subtle parallax zoom. */
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] select-none">
      {PANELS.map((cfg, i) => (
        <div
          key={i}
          ref={(el) => { panelRefs.current[i] = el; }}
          className={`absolute h-1/2 w-1/2 overflow-hidden border-amber-500/15 bg-slate-950 will-change-transform ${cfg.panel}`}
        >
          <div data-inner className={`absolute h-screen w-screen ${cfg.inner}`}>
            {renderScene(false)}
          </div>
        </div>
      ))}
    </div>
  );
}