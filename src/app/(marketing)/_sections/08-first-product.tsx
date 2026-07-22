"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { SectionShell } from "../_components/section-shell";
import { productCopy } from "@/content/sections";

const HoodieCanvas = dynamic(() => import("./hoodie-canvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-[0.62rem] tracking-widest text-gold/60 animate-pulse">
      INITIALIZING 3D STAGE...
    </div>
  ),
});

const HOODIES = [
  { id: "stylized-jacket", name: "STYLIZED JACKET", subtitle: "Statement Outerwear", url: "/3D-model/stylized_hoodie_jacket.glb" },
  { id: "classic-black-flame", name: "CLASSIC BLACK FLAME", subtitle: "The Phoenix Edition", url: "/3D-model/classic_black_flame_hoodie.glb" },
  { id: "ember", name: "EMBER", subtitle: "Orange Flame Series", url: "/3D-model/orange-hoodie.glb" },
  { id: "underrated", name: "WHITE HOODIE", subtitle: "Clean Edition", url: "/3D-model/underrated_hoodie.glb" },
  { id: "balenciaga", name: "BALENCIAGA", subtitle: "Luxury Oversized Drop", url: "/3D-model/balenciaga_hoodie.glb" },
];

export default function SectionFirstProduct() {
  const [activeFacet, setActiveFacet] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFacet((prev) => (prev + 1) % productCopy.facets.length);
    }, 5000); // automatically cycle facets every 5 seconds
    return () => clearInterval(interval);
  }, [activeFacet]);

  return (
    <SectionShell
      id="the-first-product"
      index="08"
      label="THE FIRST PRODUCT"
      className="relative flex flex-col lg:flex-row items-stretch justify-between bg-ink-warm-soft min-h-screen"
      maxWidthClassName="max-w-8xl"
    >
      {/* Left Column (2/3 width on desktop): Hoodie Studio Visual & Facet selection */}
      <div className="w-full lg:w-[62%] p-6 sm:p-14 lg:p-20 flex flex-col sm:flex-row items-stretch gap-8 sm:gap-14 pt-24 sm:pt-28">

        {/* Facet List */}
        <div className="flex sm:flex-col justify-center gap-4 md:gap-6 flex-wrap sm:flex-nowrap pb-6 sm:pb-0 sm:pr-8 md:pr-12 text-left relative">
          {productCopy.facets.map((facet, idx) => {
            const isActive = idx === activeFacet;
            return (
              <button
                key={facet}
                onClick={() => setActiveFacet(idx)}
                aria-pressed={isActive}
                aria-label={`Show ${facet.toLowerCase()} detail`}
                className={`text-left uppercase cursor-pointer hover:text-gold transition-colors duration-(--motion-base) ease-standard motion-reduce:transition-none focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm ${isActive
                  ? "text-gold text-[0.82rem] sm:text-[1.02rem] tracking-[0.24em] font-semibold py-1.5 sm:py-2"
                  : "text-ivory-mute text-xs sm:text-[0.85rem] tracking-[0.22em] font-medium py-1.5 sm:py-2"
                  }`}
              >
                {facet}
              </button>
            );
          })}
        </div>

        {/* Studio Viewport */}
        <div className="flex-1 relative flex items-center justify-center min-h-[420px] sm:min-h-0 overflow-hidden">
          {/* Accent lighting grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,162,75,0.06)_0%,_transparent_70%)] pointer-events-none" />

          <div className="w-full h-full flex items-center justify-center">
            <HoodieCanvas activeFacet={activeFacet} modelUrl={HOODIES[selectedIdx].url} />
          </div>

          {/* Subtle active detail caption overlay */}
          <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center z-10 pointer-events-none px-4 text-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeFacet}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="text-[0.68rem] tracking-[0.16em] text-gold/80 uppercase block motion-safe:animate-pulse"
              >
                {activeFacet === 0 && "360° Studio View · Drag to Rotate"}
                {activeFacet === 1 && "450 GSM Organic Cotton · Heavyweight French Terry"}
                {activeFacet === 2 && "120,000 Stitch Count Metallic Thread Detail"}
                {activeFacet === 3 && "Flatlock Reinforced Seams · Tailored Fit"}
                {activeFacet === 4 && "The Phoenix Ring - Ancient Geometry Sigil"}
                {activeFacet === 5 && "Satin Loom-Woven Identity Label"}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Column — Collection Switcher */}
      <div className="w-full lg:w-[38%] flex flex-col justify-center border-t border-ivory/5 lg:border-t-0 lg:border-l lg:border-ivory/5 p-8 sm:p-14 lg:p-16 z-10 relative">
        {/* Label */}
        <p className="text-[0.62rem] tracking-[0.3em] text-gold/60 uppercase mb-8 font-medium">
          THE COLLECTION
        </p>

        {/* Hoodie list */}
        <ul className="flex flex-col gap-1" role="list">
          {HOODIES.map((hoodie, idx) => {
            const isActive = idx === selectedIdx;
            return (
              <li key={hoodie.id}>
                <button
                  type="button"
                  onClick={() => { setSelectedIdx(idx); setActiveFacet(0); }}
                  aria-pressed={isActive}
                  aria-label={`View ${hoodie.name}`}
                  className={`group w-full text-left flex items-center gap-5 py-5 px-4 rounded-xl cursor-pointer transition-[background-color,border-color,box-shadow] duration-(--motion-base) ease-standard motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink border ${isActive
                    ? "bg-gold/[0.06] border-gold/25 shadow-[0_0_24px_-8px_rgba(201,162,75,0.25)]"
                    : "border-transparent hover:bg-ivory/[0.03] hover:border-ivory/10"
                    }`}
                >
                  {/* Index number */}
                  <span className={`text-[0.6rem] tracking-[0.28em] font-medium shrink-0 tabular-nums transition-colors duration-(--motion-base) ${isActive ? "text-gold" : "text-ivory/25 group-hover:text-ivory/45"
                    }`}>
                    0{idx + 1}
                  </span>

                  {/* Name + subtitle */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-serif text-lg leading-none tracking-[0.05em] uppercase transition-colors duration-(--motion-base) ${isActive ? "text-gold" : "text-ivory/65 group-hover:text-ivory"
                      }`}>
                      {hoodie.name}
                    </p>
                    <p className={`mt-1.5 text-[0.6rem] tracking-[0.2em] uppercase transition-colors duration-(--motion-base) ${isActive ? "text-gold/55" : "text-ivory/25"
                      }`}>
                      {hoodie.subtitle}
                    </p>
                  </div>

                  {/* Active gold dot */}
                  {isActive && (
                    <motion.span
                      layoutId="hoodie-active-dot"
                      className="w-1.5 h-1.5 rounded-full bg-gold shrink-0"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Thin divider + active hoodie name */}
        <div className="mt-10 pt-6 border-t border-ivory/5">
          <AnimatePresence mode="wait">
            <motion.p
              key={selectedIdx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="text-[0.6rem] tracking-[0.22em] text-ivory/30 uppercase"
            >
              NOW VIEWING — {HOODIES[selectedIdx].name}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </SectionShell>
  );
}
