"use client";

import React from "react";
import Preloader from "./_components/Preloader";
import VegvisirProgress from "./_components/VegvisirProgress";
import HeroEclipse from "./_components/HeroEclipse";
import PrimordialManuscript from "./_components/PrimordialManuscript";
import Manifesto from "./_components/Manifesto";
import ChapterThreads from "./_components/ChapterThreads";
import ChapterLabyrinth from "./_components/ChapterLabyrinth";
import ChapterCathedral from "./_components/ChapterCathedral";
import ChapterGeometry from "./_components/ChapterGeometry";
import KarmicLoop from "./_components/KarmicLoop";
import SymbolLexicon from "./_components/SymbolLexicon";

/**
 * OWN KARMA — Landing Page
 *
 * A universe, not a store. The visitor arrives through a ritual, descends
 * through a manifesto and a sequence of mythological chapters, discovers
 * three sacred artifacts framed as objects of reverence, and closes at an
 * ouroboros that echoes the opening eclipse.
 *
 * Structure — ten chapters, one path:
 *   0 · Preloader (Flower of Life ritual)
 *   I · Hero Eclipse (Arrival)
 *   II · Primordial Manuscript (Ādi Svarūpa — the state before karma)
 *   III · Manifesto (Voice)
 *   IV · Threads (Indian + Norse — chakra + Yggdrasil)
 *   V · Labyrinth (Greek + Egyptian — meander + Eye of Horus + pyramid)
 *   VI · Cathedral (Gothic + Ancient — arch + rose window + column)
 *   VII · Sacred Geometry (Fibonacci + Seed of Life + φ)
 *   VIII · Karmic Loop (Philosophy — ouroboros + ∞)
 *   IX · Symbol Lexicon (all nine pillars named)
 *   X · Constellation Footer — rendered by the shared PublicLayout, not here.
 *
 * The Vegvísir progress compass fixes to the bottom-right corner and
 * updates live as the visitor descends through the chapters.
 */
export default function HomePage() {
  return (
    <div className="relative w-full bg-void text-marble font-utility film-grain">
      {/* Ritual of entry — dissolves after ~4s and never returns. */}
      <Preloader />

      {/* Fixed scroll-progress sigil (bottom-right, desktop only). */}
      <VegvisirProgress />

      {/* The chapters. The constellation Footer is rendered site-wide by
          (public)/layout.tsx so it appears on every route. */}
      <HeroEclipse />
      <PrimordialManuscript />
      <Manifesto />
      <ChapterThreads />
      <ChapterLabyrinth />
      <ChapterCathedral />
      <ChapterGeometry />
      <KarmicLoop />
      <SymbolLexicon />
    </div>
  );
}
