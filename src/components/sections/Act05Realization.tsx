"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface Act05RealizationProps {
  /** Callback fired when the emblem ritual completes and hands off to Act VI. */
  onComplete?: () => void;
  /** Callback fired when visitor scrolls backward. */
  onBack?: () => void;
  /** Initial progress (0 for top, 1 for bottom when entering backward). */
  initialProgress?: number;
}

/**
 * ACT V — "The Realization" (100% Scroll-Scrubbed Needle Stitching Engine)
 *
 * High-couture, needle-stitched brand reveal for "OWN KARMA".
 * Scrolling down drives a polished silver sewing needle along unified SVG paths,
 * pulling warm silk thread to stitch an ornate lotus-mandala emblem framing a radiant 8-pointed star,
 * calligraphic letterforms, and a finishing flourish.
 * Scrolling back up un-stitches the design smoothly in reverse.
 */
export function Act05Realization({ onComplete, onBack, initialProgress = 0 }: Act05RealizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const outerPathRef = useRef<SVGPathElement>(null);
  const innerPathRef = useRef<SVGPathElement>(null);
  const textPathsGroupRef = useRef<SVGGElement>(null);
  const loopPathRef = useRef<SVGPathElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const shimmerStopRef = useRef<SVGStopElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const transitionFiredRef = useRef<boolean>(false);

  const [progress, setProgress] = useState<number>(0);

  // 1. Build Paused GSAP Stitching Timeline
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const outer = outerPathRef.current;
      const inner = innerPathRef.current;
      const textGroup = textPathsGroupRef.current;
      const loop = loopPathRef.current;
      const needle = needleRef.current;
      const shimmerStop = shimmerStopRef.current;

      if (!outer || !inner || !textGroup || !loop || !needle) return;

      const letterPaths = Array.from(textGroup.querySelectorAll("path"));
      const allPaths = [outer, inner, ...letterPaths, loop];

      const RAD2DEG = 180 / Math.PI;

      const tangentAt = (path: SVGGeometryElement, len: number, at: number) => {
        const delta = Math.max(0.75, len * 0.01);
        const a = Math.max(0, at - delta);
        const b = Math.min(len, at + delta);
        const pa = path.getPointAtLength(a);
        const pb = path.getPointAtLength(b);
        return Math.atan2(pb.y - pa.y, pb.x - pa.x) * RAD2DEG;
      };

      const setNeedle = (x: number, y: number, angleDeg: number) => {
        gsap.set(needle, {
          x,
          y,
          rotation: angleDeg,
          transformOrigin: "100% 50%",
          opacity: 1,
        });
      };

      const moveNeedleTo = (
        tl: gsap.core.Timeline,
        x: number,
        y: number,
        duration: number,
        faceAngle: number
      ) => {
        tl.to(needle, {
          x,
          y,
          rotation: faceAngle,
          duration,
          ease: "sine.inOut",
        });
      };

      const animatePathWithNeedle = (
        tl: gsap.core.Timeline,
        path: SVGGeometryElement,
        duration: number,
        startTime?: number | string
      ) => {
        const len = path.getTotalLength();

        tl.to(path, { opacity: 1, duration: 0.01 }, startTime);

        const obj = { progress: 0 };

        tl.to(
          path,
          {
            strokeDashoffset: 0,
            duration,
            ease: "none",
          },
          "<"
        );

        tl.to(
          obj,
          {
            progress: 1,
            duration,
            ease: "none",
            onUpdate: () => {
              const currentLen = Math.min(len, Math.max(0, len * obj.progress));
              const pt = path.getPointAtLength(currentLen);
              setNeedle(pt.x, pt.y, tangentAt(path, len, currentLen));
            },
          },
          "<"
        );
      };

      // Initial State: Hide all paths via strokeDashoffset
      allPaths.forEach((path) => {
        const len = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: len,
          strokeDashoffset: len,
          opacity: 0,
        });
      });

      gsap.set(needle, {
        opacity: 0,
        x: 10,
        y: 110,
        rotation: 0,
        transformOrigin: "100% 50%",
      });

      const tl = gsap.timeline({ paused: true });
      timelineRef.current = tl;

      // Outer Lotus Mandala
      const outerLen = outer.getTotalLength();
      const outerStart = outer.getPointAtLength(0);
      const outerAngle = tangentAt(outer, outerLen, 0);
      tl.to(needle, {
        opacity: 1,
        x: outerStart.x,
        y: outerStart.y,
        rotation: outerAngle,
        duration: 0.15,
        ease: "power1.out",
      });
      animatePathWithNeedle(tl, outer, 4.0);

      // Transition to Inner Star
      const innerLen = inner.getTotalLength();
      const innerStart = inner.getPointAtLength(0);
      const innerAngle = tangentAt(inner, innerLen, 0);
      moveNeedleTo(tl, innerStart.x, innerStart.y, 0.25, innerAngle);
      animatePathWithNeedle(tl, inner, 3.5);

      // Transition to Typography
      if (letterPaths.length > 0) {
        const firstLetter = letterPaths[0];
        const firstLen = firstLetter.getTotalLength();
        const firstStart = firstLetter.getPointAtLength(0);
        const firstAngle = tangentAt(firstLetter, firstLen, 0);

        moveNeedleTo(tl, firstStart.x, firstStart.y, 0.2, firstAngle);

        letterPaths.forEach((letterPath, idx) => {
          const lLen = letterPath.getTotalLength();
          if (idx > 0) {
            const lStart = letterPath.getPointAtLength(0);
            const lAngle = tangentAt(letterPath, lLen, 0);
            moveNeedleTo(tl, lStart.x, lStart.y, 0.1, lAngle);
          }
          animatePathWithNeedle(tl, letterPath, 0.45);
        });
      }

      // Transition to Underline Flourish
      const loopLen = loop.getTotalLength();
      const loopStart = loop.getPointAtLength(0);
      moveNeedleTo(tl, loopStart.x, loopStart.y, 0.3, tangentAt(loop, loopLen, 0));
      animatePathWithNeedle(tl, loop, 0.8, "+=0.05");

      // Needle exit
      tl.to(needle, {
        x: 440,
        y: 290,
        rotation: 15,
        opacity: 0,
        duration: 0.5,
        ease: "sine.inOut",
      });

      // Gold Shimmer Sweep
      if (shimmerStop) {
        tl.fromTo(
          shimmerStop,
          { offset: "0%" },
          { offset: "100%", duration: 1.2, ease: "none" },
          "-=0.2"
        );
      }
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  // 2. 60fps RequestAnimationFrame Render Loop for Scrubbing GSAP Progress
  useEffect(() => {
    let active = true;
    let animFrame: number;

    const renderLoop = () => {
      if (!active) return;

      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.06;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const currentP = Math.min(1, Math.max(0, currentProgressRef.current));
      if (timelineRef.current) {
        timelineRef.current.progress(currentP);
      }

      animFrame = requestAnimationFrame(renderLoop);
    };

    animFrame = requestAnimationFrame(renderLoop);
    return () => {
      active = false;
      cancelAnimationFrame(animFrame);
    };
  }, []);

  // Automated progress timer (0 to 1 over 22s with auto transition on finish)
  useEffect(() => {
    const progressObj = { value: 0 };
    const tween = gsap.to(progressObj, {
      value: 1,
      duration: 22,
      ease: "none",
      onUpdate: () => {
        if (targetProgressRef.current < progressObj.value) {
          targetProgressRef.current = progressObj.value;
          setProgress(progressObj.value);
        }
      },
      onComplete: () => {
        if (!transitionFiredRef.current) {
          transitionFiredRef.current = true;
          setTimeout(() => {
            onComplete?.();
          }, 1200);
        }
      },
    });

    return () => {
      tween.kill();
    };
  }, [onComplete]);

  // 3. Scroll position listener mapping scroll track to target progress
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

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#0A0A0A] select-none overflow-hidden"
      aria-label="Act V: The Realization"
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
      {/* Sleek Top Gold Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/40 z-30 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[var(--ok-gold)] via-[#E6CA65] to-[var(--ok-gold)] transition-all duration-75 shadow-[0_0_12px_rgba(201,165,90,0.8)]"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      {/* Background Soft Gold Ambient Aura */}
      <div className="absolute w-[500px] h-[500px] bg-radial from-[#C9A55A]/10 via-transparent to-transparent pointer-events-none filter blur-3xl opacity-60" />

      {/* SVG Canvas containing Needle, Silk Thread Emblem & Typography in UNIFIED (420x320) Space */}
      <div className="relative w-80 h-80 sm:w-[480px] sm:h-[480px] flex items-center justify-center pointer-events-none z-10">
        <svg
          viewBox="0 0 420 320"
          className="w-full h-full filter drop-shadow-[0_0_18px_rgba(201,165,90,0.4)]"
          fill="none"
        >
          <defs>
            {/* Gold Shimmer Sweep Gradient */}
            <linearGradient id="goldShimmerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F4E7C5" stopOpacity="0.95" />
              <stop ref={shimmerStopRef} offset="0%" stopColor="#FFEAA7" stopOpacity="1" />
              <stop offset="100%" stopColor="#C9A55A" stopOpacity="0.95" />
            </linearGradient>

            {/* Brushed Steel Needle Metallic Gradient */}
            <linearGradient id="needleMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#CBD5E1" />
              <stop offset="80%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          {/* Emblem: Outer Lotus Mandala */}
          <path
            ref={outerPathRef}
            d="M 194.7,73 C 181.3,40.7 238.7,40.7 225.3,73 C 238.7,40.7 279.3,81.3 247,94.7 C 279.3,81.3 279.3,138.7 247,125.3 C 279.3,138.7 238.7,179.3 225.3,147 C 238.7,179.3 181.3,179.3 194.7,147 C 181.3,179.3 140.7,138.7 173,125.3 C 140.7,138.7 140.7,81.3 173,94.7 C 140.7,81.3 181.3,40.7 194.7,73 Z"
            stroke="url(#goldShimmerGrad)"
            strokeWidth="2.0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Emblem: Inner Radiant Star */}
          <path
            ref={innerPathRef}
            d="M 210,85 L 213.8,100.8 L 227.7,92.3 L 219.2,106.2 L 235,110 L 219.2,113.8 L 227.7,127.7 L 213.8,119.2 L 210,135 L 206.2,119.2 L 192.3,127.7 L 200.8,113.8 L 185,110 L 200.8,106.2 L 192.3,92.3 L 206.2,100.8 Z"
            stroke="url(#goldShimmerGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Designer Serif Silk Letterforms: "O W N   K A R M A" */}
          <g
            ref={textPathsGroupRef}
            stroke="url(#goldShimmerGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* O */}
            <path d="M 45,225 A 11,15 0 1 1 44.99,225 M 40,225 L 50,225 M 40,255 L 50,255" />
            {/* W */}
            <path d="M 64,225 L 68,225 M 66,225 L 72,255 L 81,236 L 90,255 L 96,225 M 94,225 L 98,225" />
            {/* N */}
            <path d="M 108,225 L 116,225 M 112,225 L 112,255 M 108,255 L 116,255 M 112,225 L 132,255 M 128,225 L 136,225 M 132,225 L 132,255 M 128,255 L 136,255" />
            {/* K */}
            <path d="M 162,225 L 170,225 M 166,225 L 166,255 M 162,255 L 170,255 M 166,240 L 184,225 M 180,225 L 188,225 M 166,240 L 184,255 M 180,255 L 188,255" />
            {/* A */}
            <path d="M 200,255 L 208,255 M 204,255 L 216,225 L 228,255 M 224,255 L 232,255 M 208,245 L 224,245" />
            {/* R */}
            <path d="M 242,225 L 250,225 M 246,225 L 246,255 M 242,255 L 250,255 M 246,225 L 256,225 A 7,7 0 0 1 256,239 L 246,239 M 250,239 L 264,255 M 260,255 L 268,255" />
            {/* M */}
            <path d="M 276,225 L 284,225 M 280,225 L 280,255 M 276,255 L 284,255 M 280,225 L 293,255 L 306,225 M 306,225 L 306,255 M 302,255 L 310,255" />
            {/* A */}
            <path d="M 320,255 L 328,255 M 324,255 L 336,225 L 348,255 M 344,255 L 352,255 M 328,245 L 344,245" />
          </g>

          {/* Underline Flourish Finishing Loop Path */}
          <path
            ref={loopPathRef}
            d="M 40,285 C 110,296 175,268 210,280 C 245,292 310,268 380,285"
            stroke="url(#goldShimmerGrad)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Handcrafted Brushed Steel Sewing Needle Element */}
          <g ref={needleRef} className="pointer-events-none">
            <path
              d="M 0,0 L -22,-3.5 C -25,-3 -27,-1.5 -27,0 C -27,1.5 -25,3 -22,3.5 Z"
              fill="url(#needleMetal)"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
            />
            <ellipse cx="-23" cy="0" rx="2.5" ry="1.0" fill="#0A0A0A" />
            <path
              d="M -23,0 C -31,-2 -43,2 -54,0"
              stroke="#F4E7C5"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
          </g>
        </svg>
      </div>

      {/* Scrollable Track Container */}
      <div
        ref={scrollContainerRef}
        className="fixed inset-0 overflow-y-auto z-20 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="h-[350vh] w-full relative" />
      </div>

      {/* Fixed Bottom Scroll Indicator / Proceed Action */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none">
        {progress < 0.9 ? (
          <>
            <span className="text-xs uppercase tracking-[0.3em] text-[#F4F0E8]/60 font-mono">
              Scroll to stitch the emblem
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
            Enter The Philosophy →
          </button>
        )}
      </div>
    </div>
  );
}
