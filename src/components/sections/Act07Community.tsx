"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface Act07CommunityProps {
  /** Callback fired when user completes Act VII. */
  onComplete?: () => void;
  /** Callback fired when visitor scrolls backward. */
  onBack?: () => void;
  /** Initial progress (0 for top, 1 for bottom when entering backward). */
  initialProgress?: number;
}

interface Point {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  p1: Point;
  p2: Point;
  p3: Point;
  scatter: Point;
  radius: number;
  alpha: number;
}

/**
 * ACT VII — "The Community" (100% Scroll-Scrubbed Particle Assembly Edition)
 *
 * 5,000 gold particles gather across pitch darkness to form each phrase directly on scroll.
 * ZERO HTML text overlays—the text is created 100% by the gold particles scrubbing on scroll.
 */
export function Act07Community({ onComplete, onBack, initialProgress = 0 }: Act07CommunityProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const transitionFiredRef = useRef(false);

  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);

  const [progress, setProgress] = useState<number>(0);
  const [canClick, setCanClick] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Offscreen Canvas to sample high-resolution text point targets
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d");

    const sampleTextPoints = (lines: string[], fontSize: number, isItalic = true) => {
      offscreen.width = width;
      offscreen.height = height;
      if (!offCtx) return [];

      offCtx.clearRect(0, 0, width, height);
      const fontStr = `${isItalic ? "italic " : ""}400 ${fontSize}px Cormorant Garamond, serif`;
      offCtx.font = fontStr;
      offCtx.fillStyle = "#ffffff";
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";

      const lineHeight = fontSize * 1.35;
      const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, i) => {
        offCtx.fillText(line, width / 2, startY + i * lineHeight);
      });

      const imgData = offCtx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const points: Point[] = [];
      const step = 2;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          if (data[index + 3] > 80) {
            points.push({ x, y });
          }
        }
      }
      return points;
    };

    const fontSize1 = width < 640 ? 32 : width < 1024 ? 50 : 64;
    const pts1 = sampleTextPoints(["You were never looking", "for clothing."], fontSize1, true);

    const fontSize2 = width < 640 ? 28 : width < 1024 ? 44 : 56;
    const pts2 = sampleTextPoints(
      ["You were looking", "for people", "who see the world differently."],
      fontSize2,
      true
    );

    const fontSize3 = width < 640 ? 32 : width < 1024 ? 54 : 68;
    const pts3 = sampleTextPoints(["THE KARMA COMMUNITY"], fontSize3, false);

    const particleCount = 5000;
    const particles: Particle[] = Array.from({ length: particleCount }).map((_, idx) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * Math.max(width, height) * 0.75 + 200;
      const scatterPt = {
        x: width / 2 + Math.cos(angle) * distance,
        y: height / 2 + Math.sin(angle) * distance,
      };

      const p1Pt = pts1.length > 0 ? pts1[idx % pts1.length] : scatterPt;
      const p2Pt = pts2.length > 0 ? pts2[idx % pts2.length] : scatterPt;
      const p3Pt = pts3.length > 0 ? pts3[idx % pts3.length] : scatterPt;

      return {
        x: scatterPt.x,
        y: scatterPt.y,
        targetX: scatterPt.x,
        targetY: scatterPt.y,
        p1: p1Pt,
        p2: p2Pt,
        p3: p3Pt,
        scatter: scatterPt,
        radius: Math.random() * 1.1 + 0.6,
        alpha: Math.random() * 0.6 + 0.4,
      };
    });

    const interpolatePoint = (pA: Point, pB: Point, t: number): Point => ({
      x: pA.x + (pB.x - pA.x) * t,
      y: pA.y + (pB.y - pA.y) * t,
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Lerp smooth scroll progress
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.12;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = Math.min(1, Math.max(0, currentProgressRef.current));
      setCanClick(p >= 0.7);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const isMouseActive = mouseRef.current.active;

      particles.forEach((part) => {
        let tPt: Point;

        if (p <= 0.08) {
          const t = p / 0.08;
          tPt = interpolatePoint(part.scatter, part.p1, t);
        } else if (p <= 0.22) {
          tPt = part.p1;
        } else if (p <= 0.28) {
          const t = (p - 0.22) / 0.06;
          tPt = interpolatePoint(part.p1, part.scatter, t);
        } else if (p <= 0.36) {
          const t = (p - 0.28) / 0.08;
          tPt = interpolatePoint(part.scatter, part.p2, t);
        } else if (p <= 0.52) {
          tPt = part.p2;
        } else if (p <= 0.60) {
          const t = (p - 0.52) / 0.08;
          tPt = interpolatePoint(part.p2, part.scatter, t);
        } else if (p <= 0.70) {
          const t = (p - 0.60) / 0.10;
          tPt = interpolatePoint(part.scatter, part.p3, t);
        } else {
          tPt = part.p3;
        }

        part.targetX = tPt.x;
        part.targetY = tPt.y;

        part.x += (part.targetX - part.x) * 0.14;
        part.y += (part.targetY - part.y) * 0.14;

        if (isMouseActive && p >= 0.7) {
          const dx = part.x - mx;
          const dy = part.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130;

          if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist;
            const angle = Math.atan2(dy, dx);
            part.x += Math.cos(angle) * force * 10;
            part.y += Math.sin(angle) * force * 10;
          }
        }

        ctx.beginPath();
        ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 165, 90, ${part.alpha})`;
        ctx.shadowColor = "#C9A55A";
        ctx.shadowBlur = 4;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Scroll listener
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

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseRef.current = {
      x: e.clientX,
      y: e.clientY,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  const handleClick = () => {
    if (!canClick || transitionFiredRef.current) return;
    transitionFiredRef.current = true;

    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.98,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        onComplete?.();
      },
    });
  };

  const handleProceed = () => {
    if (transitionFiredRef.current) return;
    transitionFiredRef.current = true;
    onComplete?.();
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`fixed inset-0 bg-[#000000] select-none ${
        canClick ? "cursor-pointer" : "cursor-default"
      }`}
      aria-label="Act VII: The Community"
    >
      {/* Sleek Top Gold Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/40 z-30 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[var(--ok-gold)] via-[#E6CA65] to-[var(--ok-gold)] transition-all duration-75 shadow-[0_0_12px_rgba(201,165,90,0.8)]"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      {/* Pure Gold Particle Canvas — Zero HTML Overlays */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

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
            <span className="text-xs uppercase tracking-[0.3em] text-[#F4F0E8]/60 font-mono animate-pulse">
              {progress < 0.6 ? "Scroll to assemble community" : "Click or scroll to enter"}
            </span>
            <span className="text-[#C9A55A] text-2xl font-light animate-pulse">
              ↓
            </span>
          </>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleProceed();
            }}
            className="pointer-events-auto px-8 py-3 rounded-full bg-black/70 text-[#C9A55A] font-[var(--font-cormorant)] italic text-lg tracking-[0.3em] uppercase border border-[#C9A55A]/50 transition-all duration-500 hover:border-[#C9A55A] hover:bg-[#C9A55A]/20 hover:shadow-[0_0_25px_rgba(201,165,90,0.4)] cursor-pointer"
          >
            Enter The Final Screen →
          </button>
        )}
      </div>
    </div>
  );
}
