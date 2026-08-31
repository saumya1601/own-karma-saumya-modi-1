"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { audioEngine } from "@/utils/audioEngine";

export interface Act03CorridorProps {
  /** Callback fired once the visitor advances to the next act. */
  onComplete?: () => void;
  /** Callback fired when visitor scrolls backward at the top of the corridor. */
  onBack?: () => void;
  /** Initial progress (0 for top, 1 for bottom when entering backward). */
  initialProgress?: number;
}

/**
 * ACT III — "The Corridor"
 * Direct Video Playback Engine. Plays the video directly without scroll effects.
 */
/**
 * High-DPI Dynamic Cosmic Dust & Optical Star Sparkle Canvas
 * Renders native-resolution 4K star glints, celestial micro-dust, and an interactive
 * cosmic aura to enhance visual depth, clarity, and richness.
 */
function CosmicCorridorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = (canvas.width = window.innerWidth * dpr);
    let height = (canvas.height = window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    window.addEventListener("resize", handleResize);

    // Optical Star Glints (Telescope 4-point diffraction spikes)
    const glints = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: (Math.random() * 2.5 + 1.2) * dpr,
      spikeLen: (Math.random() * 12 + 6) * dpr,
      alpha: Math.random() * 0.4 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.03 + 0.015,
      driftX: (Math.random() - 0.5) * 0.2 * dpr,
      driftY: (Math.random() - 0.5) * 0.2 * dpr,
    }));

    // Micro Gold & Stardust Particles
    const numDust = 50;
    const dust = Array.from({ length: numDust }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: (Math.random() * 1.5 + 0.5) * dpr,
      speedX: (Math.random() - 0.5) * 0.4 * dpr,
      speedY: -Math.random() * 0.5 * dpr - 0.15 * dpr,
      alpha: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX * dpr;
      mouseY = e.clientY * dpr;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Interactive subtle cosmic aura
      const aura = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        350 * dpr
      );
      aura.addColorStop(0, "rgba(201, 165, 90, 0.05)");
      aura.addColorStop(0.5, "rgba(100, 149, 237, 0.02)");
      aura.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      // Render Optical Star Glints
      glints.forEach((g) => {
        g.pulse += g.pulseSpeed;
        g.x += g.driftX;
        g.y += g.driftY;

        if (g.x < 0) g.x = width;
        if (g.x > width) g.x = 0;
        if (g.y < 0) g.y = height;
        if (g.y > height) g.y = 0;

        const currentAlpha = g.alpha * (0.6 + 0.4 * Math.sin(g.pulse));
        const curSpike = g.spikeLen * (0.8 + 0.2 * Math.sin(g.pulse));

        // Center Core
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.fill();

        // 4-Point Diffraction Cross Spikes
        ctx.strokeStyle = `rgba(244, 240, 232, ${currentAlpha * 0.65})`;
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath();
        ctx.moveTo(g.x - curSpike, g.y);
        ctx.lineTo(g.x + curSpike, g.y);
        ctx.moveTo(g.x, g.y - curSpike);
        ctx.lineTo(g.x, g.y + curSpike);
        ctx.stroke();
      });

      // Render Micro Stardust
      dust.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += p.pulseSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 165, 90, ${currentAlpha})`;
        ctx.shadowColor = "rgba(201, 165, 90, 0.4)";
        ctx.shadowBlur = 4 * dpr;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
    />
  );
}

export function Act03Corridor({
  onComplete,
  onBack,
  initialProgress = 0,
}: Act03CorridorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const transitionFiredRef = useRef<boolean>(false);

  const [overlayOpacity, setOverlayOpacity] = useState<number>(1);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Responsive device & orientation check for 9:16 mobile vs 16:9 web
  useEffect(() => {
    const checkOrientation = () => {
      const isPortrait =
        typeof window !== "undefined" &&
        (window.innerWidth < 768 || window.innerHeight > window.innerWidth);
      setIsMobile(isPortrait);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);

    const mql = window.matchMedia("(orientation: portrait)");
    const handleMqlChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches || window.innerWidth < 768);
    };
    if (mql.addEventListener) {
      mql.addEventListener("change", handleMqlChange);
    }

    return () => {
      window.removeEventListener("resize", checkOrientation);
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handleMqlChange);
      }
    };
  }, []);

  const videoSrc = isMobile
    ? "/videos/corridor_mobile.mp4"
    : "/videos/corridor_web.mp4";

  // Smooth fade-in curtain transition on mount & video play start
  useEffect(() => {
    const timer = setTimeout(() => {
      setOverlayOpacity(0);
    }, 60);

    const video = videoRef.current;
    if (video) {
      if (initialProgress >= 1) {
        // Arriving backward from Act IV — resume on the corridor's final frame
        const seekToEnd = () => {
          video.currentTime = Math.max(0, video.duration - 0.05);
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = "scaleX(1)";
          }
        };
        if (video.readyState >= 1) {
          seekToEnd();
        } else {
          video.addEventListener("loadedmetadata", seekToEnd, { once: true });
        }
      } else {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay fallback
          });
        }
      }
    }

    return () => clearTimeout(timer);
  }, [initialProgress, videoSrc]);

  const triggerComplete = useCallback(() => {
    if (transitionFiredRef.current) return;
    transitionFiredRef.current = true;
    audioEngine.triggerThresholdPassage();
    onComplete?.();
  }, [onComplete]);

  const triggerBack = useCallback(() => {
    if (transitionFiredRef.current) return;
    transitionFiredRef.current = true;
    setOverlayOpacity(1);
    setTimeout(() => {
      onBack?.();
    }, 420);
  }, [onBack]);

  // Listen to wheel, touch swipe, and keyboard navigation with intentional gesture thresholds
  useEffect(() => {
    let wheelDeltaAccumulator = 0;
    let wheelResetTimer: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      if (transitionFiredRef.current) return;

      wheelDeltaAccumulator += e.deltaY;
      if (wheelResetTimer) clearTimeout(wheelResetTimer);
      wheelResetTimer = setTimeout(() => {
        wheelDeltaAccumulator = 0;
      }, 300);

      if (wheelDeltaAccumulator < -60 && onBack) {
        triggerBack();
      } else if (wheelDeltaAccumulator > 60) {
        triggerComplete();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (transitionFiredRef.current) return;
      if ((e.key === "Escape" || e.key === "ArrowUp") && onBack) {
        triggerBack();
      } else if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        triggerComplete();
      }
    };

    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (transitionFiredRef.current) return;
      const diffY = startY - e.touches[0].clientY;
      if (diffY < -50 && onBack) {
        triggerBack();
      } else if (diffY > 50) {
        triggerComplete();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      if (wheelResetTimer) clearTimeout(wheelResetTimer);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [onBack, triggerBack, triggerComplete]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const progress = video.currentTime / video.duration;

    if (progressBarRef.current) {
      progressBarRef.current.style.transform = `scaleX(${progress})`;
    }
  };

  const handleVideoEnded = () => {
    triggerComplete();
  };

  return (
    <div className="fixed inset-0 select-none bg-black overflow-hidden">
      {/* Background Preloader for Act IV Room 1 Video to eliminate decoding lag */}
      <video
        src="/videos/room1_silence.mp4"
        preload="auto"
        muted
        playsInline
        className="hidden pointer-events-none"
        aria-hidden="true"
      />

      {/* Direct Fullscreen Video Player */}
      <video
        key={videoSrc}
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
        style={{
          transform: "translateZ(0)",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
          filter: "contrast(1.06) brightness(1.01) saturate(1.06)",
        }}
      >
        <source
          src="/videos/corridor_mobile.mp4"
          type="video/mp4"
          media="(max-width: 767px), (orientation: portrait)"
        />
        <source
          src="/videos/corridor_web.mp4"
          type="video/mp4"
          media="(min-width: 768px) and (orientation: landscape)"
        />
        <source src="/videos/corridor_web.mp4" type="video/mp4" />
      </video>

      {/* Native-Resolution 4K Optical Star Glint & Particle Canvas Layer */}
      <CosmicCorridorCanvas />

      {/* Subtle Cinematic Vignette (Preserves space details without dark-crush banding) */}
      <div className="fixed inset-0 bg-radial from-transparent via-black/10 to-black/40 pointer-events-none z-20" />

      {/* Smooth Curtain Fade Overlay for Transitions */}
      <div
        className="fixed inset-0 bg-black pointer-events-none z-50 transition-opacity duration-400 ease-out"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}



