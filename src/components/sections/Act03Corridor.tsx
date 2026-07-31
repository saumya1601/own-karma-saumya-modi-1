"use client";

import { useEffect, useRef, useState } from "react";

export interface Act03CorridorProps {
  /** Callback fired once the visitor advances to the next act. */
  onComplete?: () => void;
  /** Callback fired when visitor scrolls backward at the top of the corridor. */
  onBack?: () => void;
  /** Initial progress (0 for top, 1 for bottom when entering backward). */
  initialProgress?: number;
}

type FrameItem = ImageBitmap | HTMLCanvasElement;

/**
 * Draw an image/video/bitmap onto canvas adhering to CSS 'object-cover' aspect scaling.
 */
function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: FrameItem | HTMLVideoElement,
  canvasWidth: number,
  canvasHeight: number
) {
  let imgWidth = 0;
  let imgHeight = 0;

  if (img instanceof HTMLVideoElement) {
    imgWidth = img.videoWidth;
    imgHeight = img.videoHeight;
  } else {
    imgWidth = img.width;
    imgHeight = img.height;
  }

  if (!imgWidth || !imgHeight || canvasWidth === 0 || canvasHeight === 0) return;

  const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
  const x = (canvasWidth - imgWidth * scale) / 2;
  const y = (canvasHeight - imgHeight * scale) / 2;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
}

/**
 * Safely convert a video frame to an ImageBitmap or Canvas fallback.
 */
async function captureVideoFrame(video: HTMLVideoElement): Promise<FrameItem> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(video);
    } catch {
      // Fallback if createImageBitmap is not supported
    }
  }
  const offscreen = document.createElement("canvas");
  offscreen.width = video.videoWidth || 1280;
  offscreen.height = video.videoHeight || 720;
  const ctx = offscreen.getContext("2d");
  if (ctx) ctx.drawImage(video, 0, 0);
  return offscreen;
}

/**
 * ACT II / III — "The Corridor"
 * High-performance 60fps Canvas Video Scrubbing Engine.
 * Pre-decodes video frames to GPU textures to eliminate seeking jitter completely.
 */
export function Act03Corridor({ onComplete, onBack, initialProgress = 0 }: Act03CorridorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const framesRef = useRef<FrameItem[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const transitionFiredRef = useRef<boolean>(false);

  // Only track state that actually needs to trigger re-renders (button visibility + overlay).
  const [showProceed, setShowProceed] = useState<boolean>(false);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(1);

  // Smooth fade-in curtain transition on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setOverlayOpacity(0);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const triggerBack = () => {
    if (transitionFiredRef.current) return;
    transitionFiredRef.current = true;
    setOverlayOpacity(1);
    setTimeout(() => {
      onBack?.();
    }, 800);
  };

  const triggerComplete = () => {
    if (transitionFiredRef.current) return;
    transitionFiredRef.current = true;
    setOverlayOpacity(1);
    setTimeout(() => {
      onComplete?.();
    }, 800);
  };

  // 1. Offscreen Video Frame Extraction into GPU Bitmaps (120 frames)
  useEffect(() => {
    let cancelled = false;
    const TOTAL_FRAMES = 120;
    const frames: FrameItem[] = [];
    framesRef.current = frames;

    const video = document.createElement("video");
    video.src = "/videos/corridor_full.mp4";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const extractFrames = async () => {
      await new Promise((resolve) => {
        if (video.readyState >= 1) resolve(true);
        else video.onloadedmetadata = () => resolve(true);
      });

      const duration = video.duration || 1;

      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (cancelled) break;

        const time = (i / (TOTAL_FRAMES - 1)) * duration;
        video.currentTime = time;

        await new Promise((resolve) => {
          const onSeeked = () => {
            video.removeEventListener("seeked", onSeeked);
            resolve(true);
          };
          video.addEventListener("seeked", onSeeked);
        });

        if (cancelled) break;

        try {
          const frameItem = await captureVideoFrame(video);
          // Mutate in place — no array clone, no setState churn.
          frames.push(frameItem);
        } catch (err) {
          console.error("Frame extraction error:", err);
        }
      }
    };

    extractFrames();

    return () => {
      cancelled = true;
      framesRef.current.forEach((frame) => {
        if ("close" in frame && typeof (frame as ImageBitmap).close === "function") {
          (frame as ImageBitmap).close();
        }
      });
      framesRef.current = [];
    };
  }, []);

  // 2. High DPI Canvas Resize Handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 3. 60fps RequestAnimationFrame Canvas Render Loop with Smooth Lerp
  useEffect(() => {
    let active = true;

    const renderLoop = () => {
      if (!active) return;

      const diff = targetProgressRef.current - currentProgressRef.current;

      // Silky smooth spring lerp coefficient (0.15 — snappier response, less lag).
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.15;
      } else if (currentProgressRef.current !== targetProgressRef.current) {
        currentProgressRef.current = targetProgressRef.current;
      }

      const currentP = Math.min(1, Math.max(0, currentProgressRef.current));

      // Update progress bar directly on the DOM — bypasses React reconciliation.
      const bar = progressBarRef.current;
      if (bar) {
        bar.style.transform = `scaleX(${currentP})`;
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const frames = framesRef.current;
        let frameIdx = -1;

        if (frames.length > 0) {
          frameIdx = Math.min(
            frames.length - 1,
            Math.max(0, Math.round(currentP * (frames.length - 1)))
          );
        }

        // Only repaint if the visible frame actually changed OR we're falling back to live video.
        const needsRedraw =
          frameIdx !== lastDrawnFrameRef.current || frames.length === 0;

        if (needsRedraw) {
          const ctx = canvas.getContext("2d", { alpha: false });
          if (ctx) {
            if (frames.length > 0 && frameIdx >= 0) {
              const frame = frames[frameIdx];
              if (frame) {
                drawCoverImage(ctx, frame, canvas.width, canvas.height);
                lastDrawnFrameRef.current = frameIdx;
              }
            } else {
              // Live fallback if frames are still being pre-buffered.
              const video = videoRef.current;
              if (video && video.readyState >= 2) {
                drawCoverImage(ctx, video, canvas.width, canvas.height);
              }
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      active = false;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 4. Scroll position listener mapping scroll track to target progress
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (initialProgress === 1) {
      requestAnimationFrame(() => {
        if (!container) return;
        const maxScroll = container.scrollHeight - container.clientHeight;
        if (maxScroll > 0) {
          container.scrollTop = maxScroll;
          targetProgressRef.current = 1;
          currentProgressRef.current = 1;
        }
      });
    }

    let proceedVisible = false;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll <= 0) return;

      const rawProgress = Math.min(1, Math.max(0, scrollTop / maxScroll));
      targetProgressRef.current = rawProgress;

      // Only re-render React when crossing the button-visibility threshold.
      const shouldShow = rawProgress >= 0.9;
      if (shouldShow !== proceedVisible) {
        proceedVisible = shouldShow;
        setShowProceed(shouldShow);
      }

      if (rawProgress >= 0.985 && !transitionFiredRef.current) {
        triggerComplete();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (container.scrollTop <= 0 && e.deltaY < -15 && !transitionFiredRef.current) {
        triggerBack();
      }
    };

    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const diffY = startY - currentY;
      if (container.scrollTop <= 0 && diffY < -40 && !transitionFiredRef.current) {
        triggerBack();
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
    triggerComplete();
  };

  return (
    <div className="fixed inset-0 select-none bg-black overflow-hidden">
      {/* Offscreen / Pre-buffer Video Element */}
      <video
        ref={videoRef}
        src="/videos/corridor_full.mp4"
        preload="auto"
        muted
        playsInline
        className="hidden"
      />

      {/* 60fps Hardware-Accelerated Canvas Rendering Surface */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      />

      {/* Dark Luxury Vignette Gradient Overlay */}
      <div className="fixed inset-0 bg-radial from-transparent via-black/20 to-black/80 pointer-events-none z-10" />

      {/* Sleek Top Gold Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/40 z-30 pointer-events-none overflow-hidden">
        <div
          ref={progressBarRef}
          className="h-full w-full bg-gradient-to-r from-[var(--ok-gold)] via-[#E6CA65] to-[var(--ok-gold)] shadow-[0_0_12px_rgba(201,165,90,0.8)] origin-left"
          style={{ transform: "scaleX(0)", willChange: "transform" }}
        />
      </div>

      {/* Scrollable Track Container */}
      <div
        ref={containerRef}
        className="fixed inset-0 overflow-y-auto z-20 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="h-[350vh] w-full relative" />
      </div>

      {/* Fixed Bottom Scroll Indicator / Proceed Action (Matches Act Discovery) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none">
        {!showProceed ? (
          <>
            <span className="text-xs uppercase tracking-[0.3em] text-[#F4F0E8]/60 font-mono">
              Scroll to traverse the corridor
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
            Enter The Discovery →
          </button>
        )}
      </div>

      {/* Smooth Curtain Fade Overlay for Transitions */}
      <div
        className="fixed inset-0 bg-black pointer-events-none z-50 transition-opacity duration-1000 ease-out"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}


