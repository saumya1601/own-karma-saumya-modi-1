"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface ActCommunityProps {
  /** Callback fired when user clicks THE KARMA COMMUNITY interactive particle wordmark. */
  onComplete?: () => void;
  /** Callback fired when visitor scrolls backward. */
  onBack?: () => void;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

/**
 * ACT VII — "The Community" (Pure Particle Text Assembly Edition)
 *
 * 5,000 gold particles gather across pitch darkness to form each phrase directly.
 * ZERO HTML text overlays—the text is created 100% by the gold particles themselves.
 */
export function ActCommunity({ onComplete, onBack }: ActCommunityProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const transitionFiredRef = useRef(false);

  const [canClick, setCanClick] = useState(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (transitionFiredRef.current) return;
      if (e.deltaY < -15) {
        transitionFiredRef.current = true;
        onBack?.();
      } else if (e.deltaY > 15 && canClick) {
        transitionFiredRef.current = true;
        onComplete?.();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [onComplete, onBack, canClick]);

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

    // 5,000 gold particles
    const particleCount = 5000;
    const particles: Particle[] = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      targetX: Math.random() * width,
      targetY: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      radius: Math.random() * 1.1 + 0.6,
      alpha: Math.random() * 0.6 + 0.4,
    }));

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
      const points: { x: number; y: number }[] = [];

      // Fine sampling step (1.8px) for crystal-clear particle text shape
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

    const setTargetText = (lines: string[], fontSize: number, isItalic = true) => {
      const points = sampleTextPoints(lines, fontSize, isItalic);
      if (points.length === 0) return;

      particles.forEach((p, idx) => {
        const pt = points[idx % points.length];
        p.targetX = pt.x;
        p.targetY = pt.y;
      });
    };

    const scatter = () => {
      particles.forEach((p) => {
        // Radial explosion trajectory launching particles across full screen edges
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * Math.max(width, height) * 0.75 + 200;
        p.targetX = width / 2 + Math.cos(angle) * distance;
        p.targetY = height / 2 + Math.sin(angle) * distance;
      });
    };

    // Timeline for Pure Particle Text Assembly
    const tl = gsap.timeline();

    scatter();

    // Phrase 1 (0.8s -> 6.5s) — Particles gather fast & hold for 5.7s
    tl.add(() => {
      const fontSize = width < 640 ? 32 : width < 1024 ? 50 : 64;
      setTargetText(["You were never looking", "for clothing."], fontSize, true);
    }, 0.8);

    tl.add(() => scatter(), 6.5);

    // Phrase 2 (7.5s -> 13.5s) — Particles gather fast & hold for 6.0s
    tl.add(() => {
      const fontSize = width < 640 ? 28 : width < 1024 ? 44 : 56;
      setTargetText(
        ["You were looking", "for people", "who see the world differently."],
        fontSize,
        true
      );
    }, 7.5);

    tl.add(() => scatter(), 13.5);

    // THE KARMA COMMUNITY (14.5s+)
    tl.add(() => {
      const fontSize = width < 640 ? 32 : width < 1024 ? 54 : 68;
      setTargetText(["THE KARMA COMMUNITY"], fontSize, false);
      setCanClick(true);
    }, 14.5);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const isMouseActive = mouseRef.current.active;

      particles.forEach((p) => {
        // Fast, accurate lerp to target for crisp text locking
        p.x += (p.targetX - p.x) * 0.12;
        p.y += (p.targetY - p.y) * 0.12;

        // Mouse Repel Physics on Hover
        if (isMouseActive) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130;

          if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist;
            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle) * force * 10;
            p.y += Math.sin(angle) * force * 10;
          }
        }

        // Draw solid glowing gold particle forming the text
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 165, 90, ${p.alpha})`;
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
      tl.kill();
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
    if (!canClick) return;

    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.98,
      duration: 1.0,
      ease: "power2.inOut",
      onComplete: () => {
        onComplete?.();
      },
    });
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
      {/* Pure Gold Particle Canvas — Zero HTML Overlays */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Click Hint Overlay */}
      {canClick && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none text-center z-10">
          <span className="text-xs uppercase tracking-[0.4em] text-[#F4F0E8]/50 font-mono animate-pulse">
            Click to enter
          </span>
        </div>
      )}
    </div>
  );
}
