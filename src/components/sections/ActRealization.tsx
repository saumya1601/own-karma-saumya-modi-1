"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Timeline pacing — 0.5 = half-speed cinematic slow-motion base.
const BASE_TIME_SCALE = 0.5;
const FAST_FORWARD_TIME_SCALE = BASE_TIME_SCALE * 3.5;

export interface ActRealizationProps {
  /** Callback fired when the emblem ritual completes and hands off to Act VI. */
  onComplete?: () => void;
  /** Callback fired when visitor scrolls backward. */
  onBack?: () => void;
}

/**
 * ACT V — "The Realization"
 *
 * High-couture, needle-stitched brand reveal for "OWN KARMA".
 * A polished silver sewing needle moves along unified SVG paths, pulling warm silk thread
 * to stitch an ornate lotus-mandala emblem framing a radiant 8-pointed star, calligraphic
 * letterforms, and a finishing flourish.
 * Ends with a luxury champagne gold shimmer sweep across the brand logo.
 */
export function ActRealization({ onComplete, onBack }: ActRealizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const outerPathRef = useRef<SVGPathElement>(null);
  const innerPathRef = useRef<SVGPathElement>(null);
  const textPathsGroupRef = useRef<SVGGElement>(null);
  const loopPathRef = useRef<SVGPathElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const shimmerStopRef = useRef<SVGStopElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const transitionFiredRef = useRef(false);

  // Wheel scroll navigation handlers
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

  // GSAP Atelier Needle & Silk Thread Stitching Sequence
  useEffect(() => {
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

      // The needle carries a *continuous* heading. atan2 only returns -180..180,
      // so tracing a closed loop (the lotus) crosses the ±180 seam and would flip
      // the sprite 360° in a single frame. We keep an accumulated angle and always
      // resolve a new tangent to the co-terminal value nearest the current heading,
      // so the needle turns the short way and never snaps.
      const angleState = { current: 0 };

      const unwrap = (deg: number, ref: number) => {
        let d = deg;
        while (d - ref > 180) d -= 360;
        while (d - ref < -180) d += 360;
        return d;
      };

      // Tangent via a symmetric central difference around `at`. Because the sample
      // window is clamped inside [0, len] but never collapses to a single point
      // (delta >= 0.75), the heading stays valid at both endpoints — no more the
      // degenerate atan2(0,0) = 0 snap at the end of each stitch.
      const tangentAt = (path: SVGGeometryElement, len: number, at: number) => {
        const delta = Math.max(0.75, len * 0.01);
        const a = Math.max(0, at - delta);
        const b = Math.min(len, at + delta);
        const pa = path.getPointAtLength(a);
        const pb = path.getPointAtLength(b);
        return Math.atan2(pb.y - pa.y, pb.x - pa.x) * RAD2DEG;
      };

      // Place the needle tip (local 0,0) at (x,y) and orient it along `angleDeg`,
      // unwrapped so the pointed end always leads and rotation stays continuous.
      const setNeedle = (x: number, y: number, angleDeg: number) => {
        const a = unwrap(angleDeg, angleState.current);
        angleState.current = a;
        gsap.set(needle, {
          x,
          y,
          rotation: a,
          transformOrigin: "0px 0px",
          opacity: 1,
        });
      };

      // Travel between stitches, arriving pre-aligned to `faceAngle` (the starting
      // tangent of the stitch about to be drawn) so the reveal continues from the
      // exact heading the needle is already holding — no orientation snap.
      const moveNeedleTo = (
        tl: gsap.core.Timeline,
        x: number,
        y: number,
        duration: number,
        faceAngle: number
      ) => {
        const target = unwrap(faceAngle, angleState.current);
        tl.to(needle, {
          x,
          y,
          rotation: target,
          duration,
          ease: "sine.inOut",
        });
        angleState.current = target;
      };

      // Sync the needle tip to the leading edge of the stitch, orienting it to the
      // path tangent at every frame with 100% alignment.
      const animatePathWithNeedle = (
        tl: gsap.core.Timeline,
        path: SVGGeometryElement,
        duration: number,
        startTime?: number | string
      ) => {
        const len = path.getTotalLength();

        // Reveal path stroke (anchor tween — resolves `startTime` once)
        tl.to(path, { opacity: 1, duration: 0.02 }, startTime);

        const obj = { progress: 0 };

        // Stroke reveal and needle drive both align with the anchor tween's START (`"<"`)
        // so the needle tip stays at the leading edge of the stitch instead of running
        // after the design has already been drawn.
        tl.to(
          path,
          {
            strokeDashoffset: 0,
            duration,
            ease: "sine.inOut",
          },
          "<"
        );

        tl.to(
          obj,
          {
            progress: 1,
            duration,
            ease: "sine.inOut",
            onUpdate: () => {
              const currentLen = Math.min(len, Math.max(0, len * obj.progress));
              const pt = path.getPointAtLength(currentLen);
              setNeedle(pt.x, pt.y, tangentAt(path, len, currentLen));
            },
          },
          "<"
        );
      };

      // 1. Initial State: Hide all paths via strokeDashoffset & hide needle
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
        transformOrigin: "0px 0px",
      });
      angleState.current = 0;

      const tl = gsap.timeline({
        onComplete: () => {
          onComplete?.();
        },
      });

      timelineRef.current = tl;
      tl.timeScale(BASE_TIME_SCALE);

      // 2. Needle enters smoothly carrying silk thread to the lotus start point,
      //    already turned to the outer path's opening tangent so the first stitch
      //    flows straight out of the approach.
      const outerLen = outer.getTotalLength();
      const outerStart = outer.getPointAtLength(0);
      const outerAngle = unwrap(tangentAt(outer, outerLen, 0), 0);
      tl.to(needle, {
        opacity: 1,
        x: outerStart.x,
        y: outerStart.y,
        rotation: outerAngle,
        duration: 0.7,
        ease: "power2.out",
      });
      angleState.current = outerAngle;

      // 3. Stitch Outer Lotus Mandala (8 petals) (1.4s)
      animatePathWithNeedle(tl, outer, 1.4, "+=0.05");

      // 4. Move needle to Inner Star start point & Stitch (1.1s)
      const innerLen = inner.getTotalLength();
      const innerStart = inner.getPointAtLength(0);
      moveNeedleTo(tl, innerStart.x, innerStart.y, 0.3, tangentAt(inner, innerLen, 0));
      animatePathWithNeedle(tl, inner, 1.1, "+=0.05");

      // 5. Needle stitches each letter stroke of "OWN KARMA" (0.5s per letter stroke)
      letterPaths.forEach((path) => {
        const len = path.getTotalLength();
        const startPt = path.getPointAtLength(0);
        moveNeedleTo(tl, startPt.x, startPt.y, 0.25, tangentAt(path, len, 0));
        animatePathWithNeedle(tl, path, 0.5, "+=0.02");
      });

      // 6. Needle stitches finishing flourish loop beneath logo (0.8s)
      const loopLen = loop.getTotalLength();
      const loopStart = loop.getPointAtLength(0);
      moveNeedleTo(tl, loopStart.x, loopStart.y, 0.3, tangentAt(loop, loopLen, 0));
      animatePathWithNeedle(tl, loop, 0.8, "+=0.05");

      // 7. Needle exits gracefully off-screen right (0.6s)
      tl.to(needle, {
        x: 440,
        y: 290,
        rotation: unwrap(15, angleState.current),
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
      });

      // 8. Champagne Gold Shimmer Sweep across the embroidered logo (1.4s)
      if (shimmerStop) {
        tl.fromTo(
          shimmerStop,
          { offset: "0%" },
          { offset: "100%", duration: 1.4, ease: "sine.inOut" },
          "-=0.2"
        );
      }

      // 9. Stillness beat holding the luxury embroidered wordmark
      tl.to({}, { duration: 2.5 });

      // 10. Smooth fade out transition to Act VI
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  // Press-and-hold fast-forward
  const handlePointerDown = () => {
    if (timelineRef.current) timelineRef.current.timeScale(FAST_FORWARD_TIME_SCALE);
  };
  const handlePointerUp = () => {
    if (timelineRef.current) timelineRef.current.timeScale(BASE_TIME_SCALE);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#0A0A0A] select-none cursor-pointer overflow-hidden"
      aria-label="Act V: The Realization"
    >
      {/* Background Soft Gold Ambient Aura */}
      <div className="absolute w-[500px] h-[500px] bg-radial from-[#C9A55A]/10 via-transparent to-transparent pointer-events-none filter blur-3xl opacity-60" />

      {/* SVG Canvas containing Needle, Silk Thread Emblem & Typography in UNIFIED (420x320) Space */}
      <div className="relative w-80 h-80 sm:w-[480px] sm:h-[480px] flex items-center justify-center">
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

          {/* Emblem: Outer Lotus Mandala — 8 petals as one continuous cubic-bezier chain (center 210,110 | peaks r=62 | valleys r=40) */}
          <path
            ref={outerPathRef}
            d="M 194.7,73 C 181.3,40.7 238.7,40.7 225.3,73 C 238.7,40.7 279.3,81.3 247,94.7 C 279.3,81.3 279.3,138.7 247,125.3 C 279.3,138.7 238.7,179.3 225.3,147 C 238.7,179.3 181.3,179.3 194.7,147 C 181.3,179.3 140.7,138.7 173,125.3 C 140.7,138.7 140.7,81.3 173,94.7 C 140.7,81.3 181.3,40.7 194.7,73 Z"
            stroke="url(#goldShimmerGrad)"
            strokeWidth="2.0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Emblem: Inner Radiant Star — 8-pointed (outer r=25, inner r=10) at lotus heart */}
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
            {/* O — Oval with Top/Bottom Serif Brackets */}
            <path d="M 45,225 A 11,15 0 1 1 44.99,225 M 40,225 L 50,225 M 40,255 L 50,255" />

            {/* W — Designer Flared Slanted Strokes */}
            <path d="M 64,225 L 68,225 M 66,225 L 72,255 L 81,236 L 90,255 L 96,225 M 94,225 L 98,225" />

            {/* N — Serif Stem & Diagonal */}
            <path d="M 108,225 L 116,225 M 112,225 L 112,255 M 108,255 L 116,255 M 112,225 L 132,255 M 128,225 L 136,225 M 132,225 L 132,255 M 128,255 L 136,255" />

            {/* K — Stem & Center-Junction Arms */}
            <path d="M 162,225 L 170,225 M 166,225 L 166,255 M 162,255 L 170,255 M 166,240 L 184,225 M 180,225 L 188,225 M 166,240 L 184,255 M 180,255 L 188,255" />

            {/* A — Apex Triangle & Serif Feet */}
            <path d="M 200,255 L 208,255 M 204,255 L 216,225 L 228,255 M 224,255 L 232,255 M 208,245 L 224,245" />

            {/* R — Semicircular Upper Bowl & Flared Leg */}
            <path d="M 242,225 L 250,225 M 246,225 L 246,255 M 242,255 L 250,255 M 246,225 L 256,225 A 7,7 0 0 1 256,239 L 246,239 M 250,239 L 264,255 M 260,255 L 268,255" />

            {/* M — Full-Height V-Peak Luxury Designer M */}
            <path d="M 276,225 L 284,225 M 280,225 L 280,255 M 276,255 L 284,255 M 280,225 L 293,255 L 306,225 M 306,225 L 306,255 M 302,255 L 310,255" />

            {/* A — Apex Triangle & Serif Feet */}
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

          {/* Handcrafted Brushed Steel Sewing Needle Element (Tip at 0,0) */}
          <g ref={needleRef} className="pointer-events-none">
            {/* Needle Body (Tapered Sharp Point Tip at 0,0) */}
            <path
              d="M 0,0 L -22,-3.5 C -25,-3 -27,-1.5 -27,0 C -27,1.5 -25,3 -22,3.5 Z"
              fill="url(#needleMetal)"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
            />
            {/* Needle Eyelet Hole */}
            <ellipse cx="-23" cy="0" rx="2.5" ry="1.0" fill="#0A0A0A" />
            {/* Trailing Cream Silk Thread — anchored at eyelet center, symmetric S-curve, ends on needle axis */}
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

      {/* Subtle Hint */}
      <p className="absolute bottom-10 text-[10px] uppercase tracking-[0.3em] text-[#F4F0E8]/40 font-mono pointer-events-none">
        Press & hold to fast forward
      </p>
    </div>
  );
}
