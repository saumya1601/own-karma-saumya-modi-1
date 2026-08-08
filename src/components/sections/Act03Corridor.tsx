"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
export function Act03Corridor({ onComplete, onBack, initialProgress = 0 }: Act03CorridorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const transitionFiredRef = useRef<boolean>(false);

  const [overlayOpacity, setOverlayOpacity] = useState<number>(1);

  // Smooth fade-in curtain transition on mount & video play start
  useEffect(() => {
    const timer = setTimeout(() => {
      setOverlayOpacity(0);
    }, 50);

    const video = videoRef.current;
    if (video) {
      if (initialProgress >= 1) {
        // Arriving backward from Act IV — resume on the corridor's final
        // frame instead of replaying the whole video from the start.
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
        video.play().catch(() => {
          // Autoplay policy fallback
        });
      }
    }

    return () => clearTimeout(timer);
  }, [initialProgress]);

  const triggerComplete = useCallback(() => {
    if (transitionFiredRef.current) return;
    transitionFiredRef.current = true;
    setOverlayOpacity(1);
    setTimeout(() => {
      onComplete?.();
    }, 800);
  }, [onComplete]);

  const triggerBack = useCallback(() => {
    if (transitionFiredRef.current) return;
    transitionFiredRef.current = true;
    setOverlayOpacity(1);
    setTimeout(() => {
      onBack?.();
    }, 800);
  }, [onBack]);

  // Listen to wheel, touch swipe, and keyboard navigation for both forward & backward
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY < -20 && onBack) {
        triggerBack();
      } else if (e.deltaY > 20) {
        triggerComplete();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
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
      const diffY = startY - e.touches[0].clientY;
      if (diffY < -40 && onBack) {
        triggerBack();
      } else if (diffY > 40) {
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
      {/* Direct Fullscreen Video Player */}
      <video
        ref={videoRef}
        src="/videos/corridor_full.mp4"
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* Dark Luxury Vignette Gradient Overlay */}
      <div className="fixed inset-0 bg-radial from-transparent via-black/20 to-black/80 pointer-events-none z-10" />

      {/* Smooth Curtain Fade Overlay for Transitions */}
      <div
        className="fixed inset-0 bg-black pointer-events-none z-50 transition-opacity duration-1000 ease-out"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}



