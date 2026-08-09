"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface Act07CommunityProps {
  /** Callback fired once particle assembly reaches 100%. */
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
 * ACT VII — "The Community" (The Assembly of Souls)
 *
 * 1,800 gold particles float in dark chaotic space. As time progresses (or on scroll),
 * magnetic forces pull them together to assemble the phrase: "YOU ARE OWN KARMA".
 *
 * Spec: _documents/OWN_KARMA_Landing_Page_Experience_Spec.md — ACT VII.
 */
export function Act07Community({
  onComplete,
  onBack,
  initialProgress = 0,
}: Act07CommunityProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const transitionFiredRef = useRef(false);

  const targetProgressRef = useRef<number>(initialProgress);
  const currentProgressRef = useRef<number>(initialProgress);

  const [canClick, setCanClick] = useState<boolean>(initialProgress >= 1);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(1);

  // Smooth fade-in on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setOverlayOpacity(0);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const triggerBack = useCallback(() => {
    if (transitionFiredRef.current) return;
    transitionFiredRef.current = true;
    setOverlayOpacity(1);
    setTimeout(() => {
      onBack?.();
    }, 800);
  }, [onBack]);

  const triggerComplete = useCallback(() => {
    if (transitionFiredRef.current) return;
    transitionFiredRef.current = true;
    setOverlayOpacity(1);
    setTimeout(() => {
      onComplete?.();
    }, 800);
  }, [onComplete]);

  // Listen to wheel, touch swipe, and keyboard navigation for both forward & backward
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY < -20 && onBack) {
        triggerBack();
      } else if (e.deltaY > 20 && targetProgressRef.current >= 0.95) {
        triggerComplete();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Escape" || e.key === "ArrowUp") && onBack) {
        triggerBack();
      } else if ((e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") && targetProgressRef.current >= 0.95) {
        triggerComplete();
      }
    };

    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const diffY = startY - e.touches[0].clientY;
      if (diffY < -40 && onBack) {
        triggerBack();
      } else if (diffY > 40 && targetProgressRef.current >= 0.95) {
        triggerComplete();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [onBack, triggerBack, triggerComplete]);

  // Automated particle assembly timeline (0 to 1 over ~23 seconds with auto transition on finish).
  // Skipped entirely when arriving backward from Act VIII — the phrase is
  // already fully assembled, so it should hold there rather than replay.
  useEffect(() => {
    if (initialProgress >= 1) return;

    const progressObj = { value: 0 };
    const tween = gsap.to(progressObj, {
      value: 1,
      duration: 22.8,
      ease: "none",
      onUpdate: () => {
        targetProgressRef.current = progressObj.value;
      },
      onComplete: () => {
        if (!transitionFiredRef.current) {
          triggerComplete();
        }
      },
    });

    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    const particleCount = 3000;

    // When a phrase has more sampled pixels than particles, stride evenly across
    // the whole point set instead of `idx % length`, which would only ever cover
    // the first `particleCount` pixels (top rows) and crop the rest of the text.
    const pickPoint = (pts: Point[], idx: number, fallback: Point): Point => {
      if (pts.length === 0) return fallback;
      if (pts.length <= particleCount) return pts[idx % pts.length];
      return pts[Math.floor((idx / particleCount) * pts.length)];
    };

    const particles: Particle[] = Array.from({ length: particleCount }).map((_, idx) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * Math.max(width, height) * 0.75 + 200;
      const scatterPt = {
        x: width / 2 + Math.cos(angle) * distance,
        y: height / 2 + Math.sin(angle) * distance,
      };

      return {
        x: scatterPt.x,
        y: scatterPt.y,
        targetX: scatterPt.x,
        targetY: scatterPt.y,
        p1: pickPoint(pts1, idx, scatterPt),
        p2: pickPoint(pts2, idx, scatterPt),
        p3: pickPoint(pts3, idx, scatterPt),
        scatter: scatterPt,
        radius: Math.random() * 1.1 + 0.6,
        alpha: Math.random() * 0.6 + 0.4,
      };
    });

    let lastFrameTime = performance.now();

    const render = () => {
      const now = performance.now();
      // Normalize smoothing to elapsed time (not frame count) so convergence speed
      // stays consistent even when the frame rate dips — otherwise particles fall
      // behind their targets under load and the phrase never fully assembles before
      // the timeline moves on to the next scatter/reform cycle.
      const frameFactor = Math.min(now - lastFrameTime, 100) / 16.6667;
      lastFrameTime = now;

      ctx.clearRect(0, 0, width, height);

      const progressLerp = 1 - Math.pow(1 - 0.12, frameFactor);
      const posLerp = 1 - Math.pow(1 - 0.08, frameFactor);

      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * progressLerp;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = Math.min(1, Math.max(0, currentProgressRef.current));
      // 0.87 must match the form-3 boundary below — clickable once phrase 3 finishes assembling.
      setCanClick(p >= 0.87);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const isMouseActive = mouseRef.current.active;

      ctx.fillStyle = "#C9A55A";

      particles.forEach((part) => {
        let tx: number;
        let ty: number;

        // Boundaries below are tuned in absolute seconds against the ~23s timeline
        // above. Phrase 3's hold (the "else" branch, ~3s) is intentionally short —
        // once the final phrase finishes assembling, the automated timeline (and
        // the onComplete callback above) moves straight into Act VIII rather than
        // sitting on screen.
        if (p <= 0.13) {
          const t = p / 0.13;
          tx = part.scatter.x + (part.p1.x - part.scatter.x) * t;
          ty = part.scatter.y + (part.p1.y - part.scatter.y) * t;
        } else if (p <= 0.26) {
          tx = part.p1.x;
          ty = part.p1.y;
        } else if (p <= 0.35) {
          const t = (p - 0.26) / 0.09;
          tx = part.p1.x + (part.scatter.x - part.p1.x) * t;
          ty = part.p1.y + (part.scatter.y - part.p1.y) * t;
        } else if (p <= 0.48) {
          const t = (p - 0.35) / 0.13;
          tx = part.scatter.x + (part.p2.x - part.scatter.x) * t;
          ty = part.scatter.y + (part.p2.y - part.scatter.y) * t;
        } else if (p <= 0.66) {
          tx = part.p2.x;
          ty = part.p2.y;
        } else if (p <= 0.75) {
          const t = (p - 0.66) / 0.09;
          tx = part.p2.x + (part.scatter.x - part.p2.x) * t;
          ty = part.p2.y + (part.scatter.y - part.p2.y) * t;
        } else if (p <= 0.87) {
          const t = (p - 0.75) / 0.12;
          tx = part.scatter.x + (part.p3.x - part.scatter.x) * t;
          ty = part.scatter.y + (part.p3.y - part.scatter.y) * t;
        } else {
          tx = part.p3.x;
          ty = part.p3.y;
        }

        part.targetX = tx;
        part.targetY = ty;

        part.x += (part.targetX - part.x) * posLerp;
        part.y += (part.targetY - part.y) * posLerp;

        if (isMouseActive) {
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

        // Two flat circles (soft halo + bright core) instead of ctx.shadowBlur —
        // shadowBlur re-blurs every shape on every draw call and made 5,000 particles
        // per frame unaffordable (this was the main cause of the RAM/CPU spike and jitter).
        ctx.globalAlpha = part.alpha * 0.18;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.radius * 2.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = part.alpha;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    if (transitionFiredRef.current || !canClick) return;
    triggerComplete();
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="fixed inset-0 bg-[#000000] select-none cursor-pointer"
      aria-label="Act VII: The Community"
    >
      {/* Pure Gold Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      {/* Smooth Curtain Fade Overlay for Transitions */}
      <div
        className="fixed inset-0 bg-black pointer-events-none z-50 transition-opacity duration-1000 ease-out"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}

