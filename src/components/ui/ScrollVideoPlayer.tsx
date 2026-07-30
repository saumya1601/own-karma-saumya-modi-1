"use client";

import { forwardRef, useEffect } from "react";

export interface ScrollVideoPlayerProps {
  src: string;
  className?: string;
}

/**
 * Direct Ref-based Fullscreen Video Player.
 * Controlled directly by R3F animation loop with 0 React re-renders for max performance.
 */
export const ScrollVideoPlayer = forwardRef<HTMLVideoElement, ScrollVideoPlayerProps>(
  function ScrollVideoPlayer({ src, className = "" }, ref) {
    useEffect(() => {
      const video = typeof ref === "function" ? null : ref?.current;
      if (!video) return;

      // Prime the decoder pipeline so early scroll scrubs don't stall on the first seek.
      const warmup = () => {
        const p = video.play();
        if (p && typeof p.then === "function") {
          p.then(() => {
            video.pause();
            video.currentTime = 0;
          }).catch(() => {
            video.pause();
          });
        } else {
          video.pause();
        }
      };

      if (video.readyState >= 2) {
        warmup();
      } else {
        video.addEventListener("loadeddata", warmup, { once: true });
      }

      return () => {
        video.removeEventListener("loadeddata", warmup);
      };
    }, [ref, src]);

    return (
      <div className={`fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden bg-black ${className}`}>
        <video
          ref={ref}
          src={src}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className="w-full h-full object-cover object-center scale-100 opacity-100"
        />
      </div>
    );
  }
);
