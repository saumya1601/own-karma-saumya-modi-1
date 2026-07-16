"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";

export default function Manifesto() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const pillars = [
    {
      num: "01",
      title: "DIVINE",
      subtitle: "THE OBSERVER'S LAW",
      lead: "We do not sell products. We align.",
      body: "Before stars, there was structure. The universe exists because you observe it. Human existence is older than the galaxy. You are not inside the universe; the universe is inside your alignment.",
      highlight: "universe exists",
      video: "/pillar videos/story-divine.mp4",
    },
    {
      num: "02",
      title: "KARMA'S EYE",
      subtitle: "THE INWARD VERTEX",
      lead: "We do not chase trends. We witness.",
      body: "The staircase is not leading upward. It is folding inward. The climb is inward. Every journey begins in illusion. Read the geometry of a star.",
      highlight: "folding inward",
      video: "/pillar videos/story-karmas-eye.mp4",
    },
    {
      num: "03",
      title: "DESTINY",
      subtitle: "PSYCHOLOGICAL WALLS",
      lead: "We do not decorate. We remove.",
      body: "Destiny is not something you reach. It is something you remove. You are not building your future; you are breaking your prison. Break what contains you.",
      highlight: "Break what contains you",
      video: "/pillar videos/story-destiny.mp4",
    },
    {
      num: "04",
      title: "HOURGLASS",
      subtitle: "THE PRISON OF TIME",
      lead: "We do not adapt. We inscribe.",
      body: "Time contains you — until you decide to break it. Glass shatters in slow motion into crystalline shards, reorganizing into geometric patterns. Break the frame.",
      highlight: "Break the frame",
      video: "/pillar videos/story-hourglass.mp4",
    },
  ];

  // Storytelling Card Swap Scroll Trigger
  useEffect(() => {
    // Dynamic import to prevent SSR build issues on window/document reference
    const { ScrollTrigger } = require("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    // Pins the entire section in place and updates active card index on page scroll
    const pin = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${window.innerHeight * 2.8}`,
      pin: true,
      scrub: true,
      onUpdate: (self: any) => {
        const index = Math.min(
          Math.floor(self.progress * 4),
          3
        );
        setActiveIndex(index);
      }
    });

    return () => {
      pin.kill();
    };
  }, []);

  // Clicking a pillar only switches which one is shown — it does NOT scroll the
  // page. (Previously it called window.scrollTo(section.offsetTop + …) which
  // yanked the visitor back up to the top of the section whenever they clicked
  // a lower-numbered pillar than the one currently in view.)
  //
  // The scroll-linked ScrollTrigger above still keeps `activeIndex` in sync
  // with scroll position — so as soon as the visitor scrolls again, the active
  // pillar will follow the scroll. The click gesture just gives them a manual
  // preview of any pillar without forcing a jump.
  const handlePillarClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      data-chapter="II · The Manifesto"
      className="relative w-full h-screen flex items-center bg-black border-t border-[#D4A855]/10 bg-noise overflow-hidden px-6 sm:px-12 lg:px-20"
    >
      {/* Background abstract glowing node */}
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-[#D4A855]/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex flex-col justify-center relative z-20">

        {/* Chapter Header */}
        <div className="flex items-center justify-center gap-6 mb-12">
          <LaurelBranch />
          <div className="text-center">
            <p className="utility-label text-[#D4A855] font-mono text-xs tracking-widest uppercase">II · The Manifesto</p>
            <h2 className="font-serif text-[#F3EFE7] mt-3 uppercase text-2xl sm:text-3xl tracking-[0.24em] font-light">
              The Voice
            </h2>
          </div>
          <LaurelBranch flipped />
        </div>

        {/* Top Segment: Split Selector & Wide Horizontal Video */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-stretch">

          {/* Top Left: Navigation selector */}
          <div className="lg:col-span-5 flex flex-col justify-between lg:h-full gap-4 lg:gap-0 lg:py-1">
            {pillars.map((p, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={p.title}
                  onClick={() => handlePillarClick(idx)}
                  className="group flex items-center justify-between py-2.5 border-b border-zinc-900 text-left focus:outline-none cursor-pointer transition-all duration-300 w-full"
                >
                  <div className="flex items-center gap-6">
                    <span
                      className={`font-mono text-xs font-semibold tracking-wider transition-colors duration-300 ${isActive ? "text-[#D4A855]" : "text-zinc-600 group-hover:text-[#D4A855]/60"
                        }`}
                    >
                      {p.num}
                    </span>
                    <h3
                      className={`font-serif text-base sm:text-lg tracking-[0.1em] uppercase transition-all duration-300 ${isActive
                          ? "text-[#F3EFE7] translate-x-2"
                          : "text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-1"
                        }`}
                    >
                      {p.title}
                    </h3>
                  </div>
                  <span
                    className={`font-mono text-[9px] tracking-widest uppercase transition-colors duration-300 ${isActive ? "text-[#D4A855]" : "text-zinc-700"
                      }`}
                  >
                    {p.subtitle}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Top Right: Wide Horizontal Video Frame */}
          <div className="lg:col-span-7 flex items-center justify-center">
            <div className="group w-full aspect-video bg-zinc-950 relative overflow-hidden border border-zinc-900/60 rounded shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#D4A855]/20 group-hover:border-[#D4A855]/60 transition-colors duration-500 z-20" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#D4A855]/20 group-hover:border-[#D4A855]/60 transition-colors duration-500 z-20" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#D4A855]/20 group-hover:border-[#D4A855]/60 transition-colors duration-500 z-20" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#D4A855]/20 group-hover:border-[#D4A855]/60 transition-colors duration-500 z-20" />

              {/* Layered Crossfading Video Loops */}
              {pillars.map((p, idx) => (
                <video
                  key={p.title}
                  autoPlay
                  loop
                  muted
                  playsInline
                  src={p.video}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out z-0 ${activeIndex === idx ? "opacity-75 scale-100" : "opacity-0 scale-[1.02] pointer-events-none"
                    }`}
                />
              ))}

              {/* Vignette Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.7)_100%)] z-10 pointer-events-none" />

              {/* Notched Category Tab */}
              <div
                className="absolute bottom-[-1px] left-[-1px] z-20 bg-[#0A0A0C] py-2 px-6 pr-10 border-t border-r border-zinc-900"
                style={{ clipPath: "polygon(0 0, 92% 0%, 100% 100%, 0% 100%)" }}
              >
                <h3 className="text-[#D4A855] font-serif font-bold tracking-[0.06em] text-sm uppercase leading-none">
                  {pillars[activeIndex].title}
                </h3>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Segment: Centered Storytelling text */}
        <div className="mt-12 min-h-[160px] max-w-3xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <p className="font-serif italic text-[#F3EFE7] text-xl sm:text-3xl leading-snug tracking-wide">
                {pillars[activeIndex].lead}
              </p>
              <p className="font-serif text-[#A9A399] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                {pillars[activeIndex].body.includes(pillars[activeIndex].highlight) ? (
                  <>
                    {pillars[activeIndex].body.split(pillars[activeIndex].highlight)[0]}
                    <span className="text-[#D4A855] font-semibold">
                      {pillars[activeIndex].highlight}
                    </span>
                    {pillars[activeIndex].body.split(pillars[activeIndex].highlight)[1]}
                  </>
                ) : (
                  pillars[activeIndex].body
                )}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Timeline dots / indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {pillars.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-500 ease-out ${activeIndex === idx ? "w-8 bg-[#D4A855]" : "w-2 bg-[#D4A855]/20"
                }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

function LaurelBranch({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg
      viewBox="0 0 80 80"
      width="50"
      height="50"
      fill="none"
      className="stroke-[#D4A855]"
      strokeWidth="1.2"
      strokeLinecap="round"
      style={{ transform: flipped ? "scaleX(-1)" : undefined }}
      aria-hidden
    >
      {/* Central stem */}
      <path d="M40 6 Q46 40 40 74" />
      {/* Left leaves */}
      {Array.from({ length: 6 }).map((_, i) => {
        const y = 14 + i * 10;
        return (
          <path
            key={`l${i}`}
            d={`M40 ${y} Q22 ${y + 2} 18 ${y - 6}`}
          />
        );
      })}
      {/* Right leaves */}
      {Array.from({ length: 6 }).map((_, i) => {
        const y = 19 + i * 10;
        return (
          <path
            key={`r${i}`}
            d={`M40 ${y} Q58 ${y + 2} 62 ${y - 6}`}
          />
        );
      })}
      {/* Berry */}
      <circle cx={40} cy={6} r={1.5} fill="#D4A855" stroke="none" />
    </svg>
  );
}
