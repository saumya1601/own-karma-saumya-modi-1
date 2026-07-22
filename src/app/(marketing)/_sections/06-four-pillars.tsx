"use client";

import { useState, Fragment, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SectionShell } from "../_components/section-shell";
import { EyebrowLabel, DisplayHeading, BodyProse } from "../_components/typography";
import { pillars, Pillar } from "@/content/pillars";
import { cn } from "@/lib/utils/cn";

const ROMAN_NUMERALS = ["I", "II", "III", "IV"];

/**
 * An ancient Ionic-inspired stone column, weathered by centuries. Features
 * a widened abacus, twin spiral volutes flanking a central palmette,
 * egg-and-dart moulding, bead-and-reel astragal, fluted necking, a deeply
 * fluted shaft made of stacked stone drums (with hairline cracks and pit
 * chips), and a torus / scotia / torus / two-tier plinth base — all lit by
 * a warm torchlight from the floor. Every detail is carved in SVG.
 *
 * The three parts are stacked in a flex column so the capital + base keep
 * their natural aspect ratio while the fluted shaft stretches to fill
 * whatever height the divider slot has. Because they all share the same
 * viewBox X-axis (0–60), the shaft body lines up exactly across all three.
 */
function PillarColumn() {
  return (
    <div className="relative h-full w-full flex flex-col items-center">
      {/* CAPITAL — Ionic with spiral volutes, palmette, egg-and-dart, astragal + necking. */}
      <svg
        viewBox="0 0 60 96"
        className="w-full h-auto shrink-0"
        preserveAspectRatio="xMidYMin meet"
        aria-hidden
      >
        {/* Abacus — wide crowning slab, flares beyond the shaft */}
        <rect x="1" y="1" width="58" height="6" fill="url(#pillar-stone)" />
        <line x1="1" y1="1" x2="59" y2="1" stroke="rgba(245,220,175,0.28)" strokeWidth="0.5" />
        <line x1="1" y1="6.5" x2="59" y2="6.5" stroke="rgba(230,180,90,0.55)" strokeWidth="0.5" />
        <line x1="1" y1="7.2" x2="59" y2="7.2" stroke="rgba(0,0,0,0.75)" strokeWidth="0.45" />

        {/* Cavetto — short concave moulding tucking under the abacus */}
        <path d="M 3,7.5 L 57,7.5 L 55,11.5 L 5,11.5 Z" fill="url(#pillar-stone)" />
        <line x1="3" y1="7.5" x2="57" y2="7.5" stroke="rgba(245,220,175,0.14)" strokeWidth="0.35" />

        {/* Volute band background — the block that carries the two scrolls */}
        <rect x="4" y="11.5" width="52" height="21" fill="url(#pillar-stone)" />

        {/* IONIC VOLUTES — twin spiral scrolls flanking the central palmette */}
        {/* Left volute — concentric ellipses forming the scroll eye + a tail */}
        <ellipse cx="11" cy="22" rx="6.5" ry="6" stroke="rgba(230,180,90,0.6)" strokeWidth="0.55" fill="none" />
        <ellipse cx="11" cy="22" rx="4.5" ry="4.2" stroke="rgba(230,180,90,0.55)" strokeWidth="0.45" fill="none" />
        <ellipse cx="11" cy="22" rx="2.7" ry="2.5" stroke="rgba(230,180,90,0.5)" strokeWidth="0.4" fill="none" />
        <circle cx="11" cy="22" r="0.8" fill="rgba(245,220,175,0.75)" />
        {/* Left volute tail sweeping down-right */}
        <path d="M 17,22 Q 18,28 21,31" stroke="rgba(230,180,90,0.5)" strokeWidth="0.5" fill="none" strokeLinecap="round" />
        {/* Left volute cushion shadow (underside of the coil) */}
        <path d="M 5.5,26 Q 11,29 16.5,26" stroke="rgba(0,0,0,0.55)" strokeWidth="0.4" fill="none" />

        {/* Right volute — mirrored */}
        <ellipse cx="49" cy="22" rx="6.5" ry="6" stroke="rgba(230,180,90,0.6)" strokeWidth="0.55" fill="none" />
        <ellipse cx="49" cy="22" rx="4.5" ry="4.2" stroke="rgba(230,180,90,0.55)" strokeWidth="0.45" fill="none" />
        <ellipse cx="49" cy="22" rx="2.7" ry="2.5" stroke="rgba(230,180,90,0.5)" strokeWidth="0.4" fill="none" />
        <circle cx="49" cy="22" r="0.8" fill="rgba(245,220,175,0.75)" />
        <path d="M 43,22 Q 42,28 39,31" stroke="rgba(230,180,90,0.5)" strokeWidth="0.5" fill="none" strokeLinecap="round" />
        <path d="M 43.5,26 Q 49,29 54.5,26" stroke="rgba(0,0,0,0.55)" strokeWidth="0.4" fill="none" />

        {/* Central palmette — 5 stylized petals fanning between the volutes */}
        <g stroke="rgba(230,180,90,0.55)" strokeWidth="0.45" fill="none" strokeLinecap="round">
          <path d="M 30,32 L 30,15" />
          <path d="M 30,32 Q 24,26 23,17" />
          <path d="M 30,32 Q 27,25 26,15" />
          <path d="M 30,32 Q 33,25 34,15" />
          <path d="M 30,32 Q 36,26 37,17" />
        </g>
        <circle cx="30" cy="32" r="1" fill="rgba(230,180,90,0.5)" />

        {/* Volute band bottom rule */}
        <line x1="4" y1="32.5" x2="56" y2="32.5" stroke="rgba(230,180,90,0.5)" strokeWidth="0.45" />
        <line x1="4" y1="33.2" x2="56" y2="33.2" stroke="rgba(0,0,0,0.6)" strokeWidth="0.35" />

        {/* Egg-and-dart moulding — the signature Ionic ovolo band */}
        <g stroke="rgba(230,180,90,0.65)" strokeWidth="0.5" fill="none" strokeLinecap="round">
          {/* Alternating egg (ellipse) and dart (V-shape) */}
          <ellipse cx="8" cy="37" rx="1.7" ry="2.3" />
          <path d="M 11.2,34.7 L 12.2,39.5 L 13.2,34.7" />
          <ellipse cx="16" cy="37" rx="1.7" ry="2.3" />
          <path d="M 19.2,34.7 L 20.2,39.5 L 21.2,34.7" />
          <ellipse cx="24" cy="37" rx="1.7" ry="2.3" />
          <path d="M 27.2,34.7 L 28.2,39.5 L 29.2,34.7" />
          <ellipse cx="32" cy="37" rx="1.7" ry="2.3" />
          <path d="M 35.2,34.7 L 36.2,39.5 L 37.2,34.7" />
          <ellipse cx="40" cy="37" rx="1.7" ry="2.3" />
          <path d="M 43.2,34.7 L 44.2,39.5 L 45.2,34.7" />
          <ellipse cx="48" cy="37" rx="1.7" ry="2.3" />
          <path d="M 51.2,34.7 L 52.2,39.5 L 53.2,34.7" />
        </g>
        {/* Dots inside each egg for extra detail */}
        <g fill="rgba(230,180,90,0.4)">
          <circle cx="8" cy="37" r="0.4" />
          <circle cx="16" cy="37" r="0.4" />
          <circle cx="24" cy="37" r="0.4" />
          <circle cx="32" cy="37" r="0.4" />
          <circle cx="40" cy="37" r="0.4" />
          <circle cx="48" cy="37" r="0.4" />
        </g>
        <line x1="4" y1="40.5" x2="56" y2="40.5" stroke="rgba(0,0,0,0.55)" strokeWidth="0.35" />

        {/* Astragal — bead-and-reel band */}
        <line x1="5" y1="42" x2="55" y2="42" stroke="rgba(230,180,90,0.55)" strokeWidth="0.45" />
        <g fill="rgba(230,180,90,0.45)">
          <circle cx="10" cy="44.2" r="1.05" />
          <circle cx="16.5" cy="44.2" r="1.05" />
          <circle cx="23" cy="44.2" r="1.05" />
          <circle cx="30" cy="44.2" r="1.05" />
          <circle cx="37" cy="44.2" r="1.05" />
          <circle cx="43.5" cy="44.2" r="1.05" />
          <circle cx="50" cy="44.2" r="1.05" />
        </g>
        {/* Reel connectors between beads */}
        <g stroke="rgba(245,220,175,0.14)" strokeWidth="0.4">
          <line x1="12" y1="44.2" x2="14.5" y2="44.2" />
          <line x1="18.5" y1="44.2" x2="21" y2="44.2" />
          <line x1="25" y1="44.2" x2="28" y2="44.2" />
          <line x1="32" y1="44.2" x2="35" y2="44.2" />
          <line x1="39" y1="44.2" x2="41.5" y2="44.2" />
          <line x1="45.5" y1="44.2" x2="48" y2="44.2" />
        </g>
        <line x1="5" y1="46.5" x2="55" y2="46.5" stroke="rgba(0,0,0,0.6)" strokeWidth="0.4" />

        {/* Necking — cylindrical block before the shaft */}
        <path d="M 6,47 L 54,47 L 52,62 L 8,62 Z" fill="url(#pillar-shaft)" />
        {/* Necking fluting matches shaft grooves for continuity */}
        <g stroke="rgba(0,0,0,0.85)" strokeWidth="1.4" vectorEffect="non-scaling-stroke">
          <line x1="14" y1="47.5" x2="14" y2="62" />
          <line x1="22" y1="47.5" x2="22" y2="62" />
          <line x1="30" y1="47.5" x2="30" y2="62" />
          <line x1="38" y1="47.5" x2="38" y2="62" />
          <line x1="46" y1="47.5" x2="46" y2="62" />
        </g>

        {/* Twin gold apophyge rings marking the top of the shaft */}
        <line x1="7" y1="62" x2="53" y2="62" stroke="rgba(230,180,90,0.55)" strokeWidth="0.5" />
        <line x1="7" y1="62.8" x2="53" y2="62.8" stroke="rgba(0,0,0,0.55)" strokeWidth="0.35" />

        {/* Top of shaft — blends cleanly with the fluted shaft below */}
        <rect x="8" y="63.5" width="44" height="32.5" fill="url(#pillar-shaft)" />
        <g stroke="rgba(0,0,0,0.9)" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
          <line x1="14" y1="63.5" x2="14" y2="96" />
          <line x1="22" y1="63.5" x2="22" y2="96" />
          <line x1="30" y1="63.5" x2="30" y2="96" />
          <line x1="38" y1="63.5" x2="38" y2="96" />
          <line x1="46" y1="63.5" x2="46" y2="96" />
        </g>
        <g stroke="rgba(245,220,175,0.2)" strokeWidth="0.7" vectorEffect="non-scaling-stroke">
          <line x1="15.4" y1="63.5" x2="15.4" y2="96" />
          <line x1="23.4" y1="63.5" x2="23.4" y2="96" />
          <line x1="31.4" y1="63.5" x2="31.4" y2="96" />
          <line x1="39.4" y1="63.5" x2="39.4" y2="96" />
          <line x1="47.4" y1="63.5" x2="47.4" y2="96" />
        </g>
        {/* Outer edges of the shaft top: warm lit rim + deep shadow */}
        <line x1="8.5" y1="63.5" x2="8.5" y2="96" stroke="rgba(245,220,175,0.24)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line x1="51.5" y1="63.5" x2="51.5" y2="96" stroke="rgba(0,0,0,0.95)" strokeWidth="1" vectorEffect="non-scaling-stroke" />

        {/* A hairline diagonal crack across the necking + top of shaft — weathering */}
        <path d="M 18,52 L 23,58 L 20,64 L 28,72" stroke="rgba(0,0,0,0.65)" strokeWidth="0.45" fill="none" strokeLinecap="round" />
        {/* Small pit chips on the capital / necking */}
        <g fill="rgba(0,0,0,0.55)">
          <circle cx="14" cy="9" r="0.55" />
          <circle cx="41" cy="10" r="0.5" />
          <circle cx="6" cy="55" r="0.5" />
          <circle cx="35" cy="70" r="0.6" />
          <circle cx="48" cy="88" r="0.55" />
        </g>
      </svg>

      {/* SHAFT — fills the middle, stretched vertically. */}
      <div className="w-full flex-1 relative">
        <svg
          viewBox="0 0 60 100"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          {/* Shaft body — cylindrical stone */}
          <rect x="8" y="0" width="44" height="100" fill="url(#pillar-shaft)" />

          {/* 5 deep vertical grooves */}
          <g stroke="rgba(0,0,0,0.9)" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
            <line x1="14" y1="0" x2="14" y2="100" />
            <line x1="22" y1="0" x2="22" y2="100" />
            <line x1="30" y1="0" x2="30" y2="100" />
            <line x1="38" y1="0" x2="38" y2="100" />
            <line x1="46" y1="0" x2="46" y2="100" />
          </g>

          {/* Warm fillet highlights beside each groove — torchlit rim */}
          <g stroke="rgba(245,220,175,0.22)" strokeWidth="0.7" vectorEffect="non-scaling-stroke">
            <line x1="15.4" y1="0" x2="15.4" y2="100" />
            <line x1="23.4" y1="0" x2="23.4" y2="100" />
            <line x1="31.4" y1="0" x2="31.4" y2="100" />
            <line x1="39.4" y1="0" x2="39.4" y2="100" />
            <line x1="47.4" y1="0" x2="47.4" y2="100" />
          </g>

          {/* Outer cylindrical edges — strong lit rim (left) + shadow (right) */}
          <line x1="8.5" y1="0" x2="8.5" y2="100" stroke="rgba(245,220,175,0.24)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          <line x1="51.5" y1="0" x2="51.5" y2="100" stroke="rgba(0,0,0,0.95)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />

          {/* Drum joints — subtle horizontal seams between stacked stone drums */}
          <line x1="8" y1="20" x2="52" y2="20" stroke="rgba(0,0,0,0.65)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="8" y1="20.5" x2="52" y2="20.5" stroke="rgba(245,220,175,0.1)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          <line x1="8" y1="42" x2="52" y2="42" stroke="rgba(0,0,0,0.65)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="8" y1="42.5" x2="52" y2="42.5" stroke="rgba(245,220,175,0.1)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          <line x1="8" y1="64" x2="52" y2="64" stroke="rgba(0,0,0,0.65)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="8" y1="64.5" x2="52" y2="64.5" stroke="rgba(245,220,175,0.1)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          <line x1="8" y1="86" x2="52" y2="86" stroke="rgba(0,0,0,0.65)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="8" y1="86.5" x2="52" y2="86.5" stroke="rgba(245,220,175,0.1)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />

          {/* Weathering streaks — near-vertical hairline runoff (stretch fine) */}
          <g stroke="rgba(0,0,0,0.55)" strokeWidth="0.5" fill="none" vectorEffect="non-scaling-stroke">
            <path d="M 18.5,6 L 18,22 L 18.7,42" />
            <path d="M 33.5,12 L 33,36 L 33.6,58" />
            <path d="M 44,50 L 44.5,72 L 44,90" />
          </g>
          {/* Small chip pits scattered across the shaft */}
          <g fill="rgba(0,0,0,0.6)">
            <circle cx="12" cy="10" r="0.7" />
            <circle cx="26" cy="18" r="0.55" />
            <circle cx="42" cy="30" r="0.65" />
            <circle cx="17" cy="48" r="0.55" />
            <circle cx="49" cy="56" r="0.6" />
            <circle cx="28" cy="72" r="0.7" />
            <circle cx="19" cy="82" r="0.55" />
            <circle cx="41" cy="93" r="0.6" />
          </g>
          {/* Highlight glints beside a couple of pits (as if a rim caught light) */}
          <g fill="rgba(245,220,175,0.16)">
            <circle cx="12.6" cy="9.6" r="0.35" />
            <circle cx="42.6" cy="29.6" r="0.35" />
            <circle cx="28.6" cy="71.6" r="0.35" />
          </g>
        </svg>
      </div>

      {/* BASE — Attic style with torus / scotia / torus / two-tier plinth. */}
      <svg
        viewBox="0 0 60 68"
        className="w-full h-auto shrink-0"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden
      >
        {/* Shaft continues into the base with visible final flutes */}
        <rect x="8" y="0" width="44" height="4" fill="url(#pillar-shaft)" />
        <g stroke="rgba(0,0,0,0.9)" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
          <line x1="14" y1="0" x2="14" y2="4" />
          <line x1="22" y1="0" x2="22" y2="4" />
          <line x1="30" y1="0" x2="30" y2="4" />
          <line x1="38" y1="0" x2="38" y2="4" />
          <line x1="46" y1="0" x2="46" y2="4" />
        </g>

        {/* Apophyge — gold twin ring where shaft meets base */}
        <line x1="6" y1="4.5" x2="54" y2="4.5" stroke="rgba(230,180,90,0.55)" strokeWidth="0.5" />
        <line x1="6" y1="5.2" x2="54" y2="5.2" stroke="rgba(0,0,0,0.6)" strokeWidth="0.35" />

        {/* Astragal bead ring at the top of the base */}
        <g fill="rgba(230,180,90,0.45)">
          <circle cx="10" cy="7.5" r="1" />
          <circle cx="16.5" cy="7.5" r="1" />
          <circle cx="23" cy="7.5" r="1" />
          <circle cx="30" cy="7.5" r="1" />
          <circle cx="37" cy="7.5" r="1" />
          <circle cx="43.5" cy="7.5" r="1" />
          <circle cx="50" cy="7.5" r="1" />
        </g>
        <line x1="6" y1="10" x2="54" y2="10" stroke="rgba(0,0,0,0.6)" strokeWidth="0.35" />

        {/* Upper torus — convex bead flaring outward */}
        <path d="M 6,11 L 54,11 Q 57,16 50,20 Q 30,23 10,20 Q 3,16 6,11 Z" fill="url(#pillar-stone)" />
        <path d="M 7,12 Q 10,16 30,17 Q 50,16 53,12" stroke="rgba(245,220,175,0.2)" strokeWidth="0.5" fill="none" />
        <path d="M 6,20.4 Q 30,23.5 54,20.4" stroke="rgba(0,0,0,0.6)" strokeWidth="0.4" fill="none" />

        {/* Scotia — deep concave groove between the two tori */}
        <path d="M 8,21 L 52,21 Q 50,25 30,26 Q 10,25 8,21 Z" fill="#050403" />
        <path d="M 8,21 Q 30,26 52,21" stroke="rgba(0,0,0,0.95)" strokeWidth="0.6" fill="none" />
        {/* Tiny highlight on the scotia's upper lip */}
        <path d="M 8,21.2 Q 30,24 52,21.2" stroke="rgba(245,220,175,0.1)" strokeWidth="0.3" fill="none" />

        {/* Lower torus — wider convex bead */}
        <path d="M 3,26 L 57,26 Q 60,32 50,36 Q 30,39 10,36 Q 0,32 3,26 Z" fill="url(#pillar-stone)" />
        <path d="M 5,27.5 Q 10,32 30,33 Q 50,32 55,27.5" stroke="rgba(245,220,175,0.22)" strokeWidth="0.55" fill="none" />
        <path d="M 3,36.5 L 57,36.5" stroke="rgba(0,0,0,0.7)" strokeWidth="0.4" fill="none" />

        {/* Upper plinth tier — narrow platform */}
        <rect x="2" y="37" width="56" height="9" fill="url(#pillar-stone)" />
        <line x1="2" y1="37" x2="58" y2="37" stroke="rgba(230,180,90,0.55)" strokeWidth="0.5" />
        <line x1="2" y1="46" x2="58" y2="46" stroke="rgba(0,0,0,0.65)" strokeWidth="0.4" />
        {/* Upper plinth edge highlights */}
        <line x1="2.5" y1="37" x2="2.5" y2="46" stroke="rgba(245,220,175,0.16)" strokeWidth="0.4" />
        <line x1="57.5" y1="37" x2="57.5" y2="46" stroke="rgba(0,0,0,0.7)" strokeWidth="0.4" />

        {/* Lower plinth tier — widest, extends past the shaft */}
        <rect x="0" y="46" width="60" height="20" fill="url(#pillar-stone)" />
        <line x1="0" y1="46" x2="60" y2="46" stroke="rgba(245,220,175,0.18)" strokeWidth="0.4" />
        <line x1="0" y1="66" x2="60" y2="66" stroke="rgba(0,0,0,0.75)" strokeWidth="0.55" />
        <line x1="0.6" y1="46" x2="0.6" y2="66" stroke="rgba(245,220,175,0.2)" strokeWidth="0.55" />
        <line x1="59.4" y1="46" x2="59.4" y2="66" stroke="rgba(0,0,0,0.85)" strokeWidth="0.55" />

        {/* Weathering: cracks across the plinth */}
        <g stroke="rgba(0,0,0,0.65)" strokeWidth="0.45" fill="none" strokeLinecap="round">
          <path d="M 8,48 L 12,54 L 10,60 L 15,66" />
          <path d="M 44,50 L 40,58 L 46,66" />
          <path d="M 28,54 L 30,60 L 27,66" />
        </g>
        {/* Chip pits on the plinth corners + torus */}
        <g fill="rgba(0,0,0,0.65)">
          <circle cx="4" cy="58" r="0.7" />
          <circle cx="55" cy="52" r="0.6" />
          <circle cx="34" cy="62" r="0.65" />
          <circle cx="20" cy="30" r="0.55" />
          <circle cx="42" cy="16" r="0.5" />
        </g>
        {/* Torchlit rim glints on a couple of the chip edges */}
        <g fill="rgba(245,220,175,0.18)">
          <circle cx="3.6" cy="57.6" r="0.35" />
          <circle cx="55.6" cy="51.6" r="0.3" />
          <circle cx="34.6" cy="61.6" r="0.3" />
        </g>
      </svg>

      {/* Warm brazier uplight glow spilling up from the floor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-52 bg-[radial-gradient(ellipse_at_bottom,rgba(230,180,90,0.32)_0%,rgba(201,162,75,0.06)_45%,transparent_78%)] blur-md pointer-events-none" />

      {/* Physical floor spotlight fixture at the pillar's foot */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-2 bg-gold/65 rounded-t-full shadow-[0_0_18px_rgba(230,180,90,0.85)] pointer-events-none" />
    </div>
  );
}

export default function SectionFourPillars() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activePillar = pillars[activeIdx];
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoFullscreen = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if ((el as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen)
      (el as HTMLVideoElement & { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
  };

  // Map each pillar index to the corresponding video asset
  const getPillarVideoPath = (idx: number) => {
    switch (idx) {
      case 0:
        return "/pillar videos/story-karmas-eye.mp4";
      case 1:
        return "/pillar videos/story-divine.mp4";
      case 2:
        return "/pillar videos/story-destiny.mp4";
      case 3:
        return "/pillar videos/story-hourglass.mp4";
      default:
        return "/pillar videos/story-karmas-eye.mp4";
    }
  };

  // Unique gold geometric vector paths for the sigils on doors
  const renderDoorSigil = (idx: number) => {
    switch (idx) {
      case 0: // Purpose (Eye/Triquetra)
        return (
          <svg className="w-9 h-9 text-gold/60 group-hover:text-gold transition-colors duration-500" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="50" cy="50" r="32" />
            <circle cx="50" cy="50" r="10" />
            <path d="M50 18L50 82M18 50L82 50" />
          </svg>
        );
      case 1: // Symbol (Hexagram / Geometry)
        return (
          <svg className="w-9 h-9 text-gold/60 group-hover:text-gold transition-colors duration-500" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
            <polygon points="50,15 80,70 20,70" />
            <polygon points="50,85 80,30 20,30" />
            <circle cx="50" cy="50" r="12" />
          </svg>
        );
      case 2: // Story (Spiral / Infinite Path)
        return (
          <svg className="w-9 h-9 text-gold/60 group-hover:text-gold transition-colors duration-500" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M50 50 A 10 10 0 1 0 60 60 A 20 20 0 1 0 40 30 A 30 30 0 1 0 80 50" />
            <circle cx="50" cy="50" r="3" fill="currentColor" />
          </svg>
        );
      case 3: // Unbound (Phoenix / Wings)
        return (
          <svg className="w-9 h-9 text-gold/60 group-hover:text-gold transition-colors duration-500" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M15 45C35 25 50 48 50 48C50 48 65 25 85 45" />
            <path d="M22 55C38 38 50 58 50 58C50 58 62 38 78 55" />
            <line x1="50" y1="35" x2="50" y2="75" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <SectionShell
      id="the-four-pillars"
      index="06"
      label="THE FOUR PILLARS"
      className="relative flex flex-col lg:flex-row items-stretch justify-between bg-neutral-950 overflow-hidden"
      maxWidthClassName="max-w-8xl"
    >
      {/* Gothic vignette backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000000_100%)] opacity-80 pointer-events-none z-0" />

      {/* Shared defs for pointed arch gradients + weathered stone pillars */}
      <svg className="absolute w-0 h-0" aria-hidden>
        <defs>
          <linearGradient id="inactive-door-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#100f0f" stopOpacity={0.75} />
            <stop offset="100%" stopColor="#060505" stopOpacity={0.95} />
          </linearGradient>
          <linearGradient id="active-door-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c1813" stopOpacity={0.85} />
            <stop offset="50%" stopColor="#12100d" stopOpacity={0.92} />
            <stop offset="100%" stopColor="#080706" stopOpacity={0.98} />
          </linearGradient>
          {/* Weathered torchlit sandstone — cylindrical shading: dark rim on each
              edge, warm gold-brown mid-tone peak just left of center where the
              off-camera brazier would strike a real cylindrical column. */}
          <linearGradient id="pillar-stone" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#060402" />
            <stop offset="12%" stopColor="#241c11" />
            <stop offset="30%" stopColor="#4d3d24" />
            <stop offset="45%" stopColor="#5a4830" />
            <stop offset="60%" stopColor="#463620" />
            <stop offset="80%" stopColor="#1e170d" />
            <stop offset="100%" stopColor="#040301" />
          </linearGradient>
          {/* Slightly darker + a hair cooler variant for the shaft body so it
              reads a touch darker than the crowning capital and base moldings. */}
          <linearGradient id="pillar-shaft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#040301" />
            <stop offset="12%" stopColor="#1e180f" />
            <stop offset="30%" stopColor="#3f3220" />
            <stop offset="45%" stopColor="#4a3b27" />
            <stop offset="60%" stopColor="#3a2e1d" />
            <stop offset="80%" stopColor="#1a140b" />
            <stop offset="100%" stopColor="#020100" />
          </linearGradient>
        </defs>
      </svg>

      {/* Left panel (2/3 width on desktop): 4 Arched Doors and Dividers */}
      <div className="w-full lg:w-[62%] flex flex-col justify-end p-6 sm:p-10 lg:p-12 z-10 pt-20 sm:pt-24">
        {/* Constrain row height on desktop; stacked naturally on mobile */}
        <div className="w-full flex flex-col sm:flex-row items-stretch gap-4 sm:gap-0 sm:h-[56vh]">

          {/* Leftmost Column (Start of arcade) */}
          <div className="hidden sm:flex flex-col justify-end relative w-8 md:w-12 lg:w-16 shrink-0">
            <PillarColumn />
          </div>

          {pillars.map((pillar, idx) => {
            const isActive = idx === activeIdx;
            return (
              <Fragment key={pillar.id}>
                {/* Pointed Arch Door Button */}
                <button
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Open Pillar ${ROMAN_NUMERALS[idx]} — ${pillar.title}`}
                  aria-pressed={isActive}
                  className={cn(
                    "group flex-1 relative flex flex-col justify-between items-center py-10 px-6 h-[290px] sm:h-auto overflow-visible cursor-pointer",
                    "transition-transform duration-500 ease-standard motion-reduce:transition-none",
                    "focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-ink-2",
                    isActive ? "scale-[1.02] z-20" : "z-10 hover:scale-[1.01] active:scale-[0.995]",
                  )}
                >
                  {/* Pointed Gothic Arch PNG background */}
                  <Image
                    src="/piller/Piller.png"
                    alt="Gothic Pillar Frame"
                    fill
                    priority
                    className={`object-fill transition-all duration-700 pointer-events-none select-none z-0 ${isActive
                      ? "brightness-100 opacity-100 contrast-[1.05] drop-shadow-[0_0_25px_rgba(201,162,75,0.12)]"
                      : "brightness-[0.45] opacity-75 group-hover:brightness-[0.7] group-hover:opacity-90 group-hover:scale-[1.01]"
                      }`}
                  />

                  {/* Pointed Gothic Arch SVG double border overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 200" fill="none" preserveAspectRatio="none">
                    {/* Outer pointed arch line */}
                    <path
                      d="M 2,200 L 2,50 C 2,38 18,12 50,2 C 82,12 98,38 98,50 L 98,200"
                      stroke={isActive ? "rgba(201,162,75,0.65)" : "rgba(237,230,211,0.1)"}
                      strokeWidth={isActive ? "1.5" : "1"}
                      className="transition-colors duration-700 group-hover:stroke-gold/40"
                    />

                    {/* Inner pointed arch line */}
                    <path
                      d="M 5,200 L 5,52 C 5,40 21,15 50,5 C 79,15 95,40 95,52 L 95,200"
                      stroke={isActive ? "rgba(201,162,75,0.35)" : "rgba(237,230,211,0.05)"}
                      strokeWidth="0.75"
                      className="transition-colors duration-700 group-hover:stroke-gold/25"
                    />
                  </svg>

                  {/* Active background glow overlay */}
                  <div
                    className={`absolute inset-0 bg-linear-to-t from-gold/0 via-gold/5 to-gold/0 opacity-0 transition-opacity duration-700 pointer-events-none ${isActive ? "opacity-100" : "group-hover:opacity-60"
                      }`}
                    style={{
                      clipPath: "path('M 2,200 L 2,50 C 2,38 18,12 50,2 C 82,12 98,38 98,50 L 98,200 Z')"
                    }}
                  />

                  {/* Top spacing to let the arch stonework breathe */}
                  <div className="h-10 sm:h-16" />

                  {/* Center layout: Numerals */}
                  <div className="my-auto py-2 sm:py-4 flex flex-col items-center gap-1.5 z-10">
                    <span className="text-[0.58rem] tracking-[0.3em] font-serif text-gold/45 group-hover:text-gold/75 transition-colors duration-500 uppercase">
                      PILLAR
                    </span>
                    <span className={`font-serif text-3xl sm:text-4xl tracking-widest font-light transition-all duration-700 ${isActive
                      ? "text-gold drop-shadow-[0_0_8px_rgba(201,162,75,0.45)] scale-105"
                      : "text-ivory-dim/60 group-hover:text-ivory"
                      }`}>
                      {ROMAN_NUMERALS[idx]}
                    </span>
                  </div>

                  {/* Bottom layout: Title & Enter Button */}
                  <div className="flex flex-col gap-3.5 items-center pb-4 sm:pb-6 z-10">
                    <span className={`font-serif text-[0.8rem] sm:text-[0.9rem] tracking-[0.2em] uppercase transition-colors duration-500 text-center ${isActive ? "text-gold" : "text-ivory-dim group-hover:text-ivory"
                      }`}>
                      {pillar.title}
                    </span>
                    <span className={`text-[0.58rem] tracking-[0.25em] border px-4 py-1.5 transition-all duration-500 uppercase ${isActive
                      ? "border-gold text-gold bg-gold/10 font-medium"
                      : "border-ivory/15 text-ivory-dim group-hover:border-gold/50 group-hover:text-gold group-hover:bg-gold/5"
                      }`}>
                      ENTER
                    </span>
                  </div>
                </button>

                {/* Column between/after doors */}
                <div className="hidden sm:flex flex-col justify-end relative w-8 md:w-12 lg:w-16 shrink-0">
                  <PillarColumn />
                </div>
              </Fragment>
            );
          })}

        </div>
      </div>

      {/* Right panel (1/3 width on desktop): Selected Pillar Video & Details */}
      <div className="w-full lg:w-[38%] bg-transparent flex flex-col justify-between p-8 sm:p-10 lg:p-12 z-10 min-h-[380px] lg:min-h-0 relative overflow-hidden">
        {/* Dynamic Pillar Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePillar.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col justify-center lg:justify-end gap-6"
          >
            {/* Pillar texts */}
            <div className="flex flex-col gap-3">
              <span className="text-[0.72rem] uppercase text-gold tracking-[0.24em] font-medium">
                {activePillar.numeral} / {activePillar.title}
              </span>
              <h4 className="font-serif text-2xl text-ivory font-light leading-snug">
                {activePillar.principle}
              </h4>
              <p className="font-serif text-base text-ivory-dim leading-relaxed font-light">
                {activePillar.body}
              </p>
            </div>

            {/* Visual Chamber - Embedded MP4 Loop inside Sacred Geometry frame */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Watch fullscreen"
              onClick={handleVideoFullscreen}
              onKeyDown={(e) => e.key === "Enter" && handleVideoFullscreen()}
              className="group relative w-full aspect-[4/3] rounded-2xl border border-gold/15 bg-neutral-950 shadow-[0_0_24px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {/* Loop Video */}
              <video
                ref={videoRef}
                key={getPillarVideoPath(activeIdx)}
                src={getPillarVideoPath(activeIdx)}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen transition-opacity duration-700"
              />
              {/* Fullscreen hint that appears on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-11 h-11 rounded-full bg-black/50 border border-gold/40 flex items-center justify-center backdrop-blur-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionShell>
  );
}

