"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { SectionShell } from "../_components/section-shell";
import { DisplayHeading, EyebrowLabel } from "../_components/typography";
import { voidCopy } from "@/content/sections";

const INTRO_VIDEO_URL = "/A_cinematic_second_video_S%20Portal%20Video_gwr_video_mvp.mp4";

export default function SectionVoid() {
  const isReduced = useReducedMotion();
  const [showIntroVideo, setShowIntroVideo] = useState(true);

  // ESC key skips the intro
  useEffect(() => {
    if (!showIntroVideo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowIntroVideo(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showIntroVideo]);

  // Lock body scroll while the intro plays so the user can't jump past it.
  useEffect(() => {
    if (!showIntroVideo) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showIntroVideo]);

  // Cascade every element in on mount, then keep them all visible.
  const item: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <>
      <SectionShell
        id="the-void"
        index="01"
        label="THE VOID"
        className="relative flex items-center justify-center bg-ink-cool"
        maxWidthClassName="max-w-8xl"
      >

        {/* Full composition — all elements visible together, matching the mock */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.55, delayChildren: 0.3 } },
          }}
          className="z-10 flex flex-col items-center gap-8 sm:gap-10 px-4 text-center"
        >
          {/* Row 1 — eyebrow: every action */}
          <motion.div variants={item}>
            <EyebrowLabel className="text-ivory tracking-[0.28em] text-xs sm:text-sm font-light">
              {voidCopy.eyebrowTop}
            </EyebrowLabel>
          </motion.div>

          {/* Row 2 — subtle warm sun (matches mock: small gold core, soft halo) */}
          <motion.div variants={item} className="relative flex items-center justify-center h-20 w-20">
            {/* Warm gold core — slightly larger, brighter, still on-brand */}
            <div className="absolute h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-gold-hi shadow-[0_0_22px_6px_rgba(231,199,122,0.9),0_0_44px_16px_rgba(201,162,75,0.55)]" />

            {/* One soft pulsing halo */}
            {!isReduced && (
              <motion.div
                className="absolute h-12 w-12 rounded-full bg-gold/25 blur-lg pointer-events-none"
                animate={{ scale: [0.9, 1.3, 0.9], opacity: [0.55, 0.95, 0.55] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </motion.div>

          {/* Row 3 — eyebrow: every choice */}
          <motion.div variants={item}>
            <EyebrowLabel className="text-ivory tracking-[0.28em] text-xs sm:text-sm font-light">
              {voidCopy.eyebrowBottom}
            </EyebrowLabel>
          </motion.div>

          {/* Row 4 — brand lockup */}
          <motion.div variants={item} className="flex flex-col items-center gap-4 sm:gap-5 mt-4 sm:mt-6">
            <DisplayHeading className="text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] font-extralight tracking-[0.14em] sm:tracking-[0.18em] text-gold leading-none">
              OWN KARMA
            </DisplayHeading>
            <EyebrowLabel className="text-ivory tracking-[0.32em] text-xs sm:text-sm font-medium">
              NOT BOUND. UNBOUND.
            </EyebrowLabel>
          </motion.div>
        </motion.div>
      </SectionShell>

      {/* ---------- Intro Portal Video Overlay ---------- */}
      <AnimatePresence>
        {showIntroVideo && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden"
            aria-label="Portal intro video"
          >
            <video
              src={INTRO_VIDEO_URL}
              autoPlay
              muted
              playsInline
              onEnded={() => setShowIntroVideo(false)}
              className="w-full h-full object-cover"
            />

            {/* Soft vignette so the video edges bleed into black */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.85) 100%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
