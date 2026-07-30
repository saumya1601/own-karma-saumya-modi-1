"use client";

import { useEffect, useRef } from "react";

export interface CinematicVideoOverlayProps {
  src: string;
  opacity?: number;
  className?: string;
}

/**
 * Fullscreen Cinematic Video Background Player with Dark Vignetting.
 * Auto-plays, loops, and blends with WebGL gold star particles & dark void.
 */
export function CinematicVideoOverlay({
  src,
  opacity = 1,
  className = "",
}: CinematicVideoOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      const handleGesture = () => {
        video.play();
        window.removeEventListener("click", handleGesture);
      };
      window.addEventListener("click", handleGesture);
    });
  }, [src]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000 ${className}`}
      style={{ opacity }}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.15]"
      />

      {/* Dark Luxury Vignette Gradient Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/90 pointer-events-none" />
    </div>
  );
}
