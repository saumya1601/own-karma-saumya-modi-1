"use client";

import { motion } from "framer-motion";
import { SectionShell } from "../_components/section-shell";
import { EyebrowLabel, DisplayHeading } from "../_components/typography";
import { PrimaryButton, OutlinedButton } from "../_components/buttons";
import { finalQuestion, footerCopy, brand, cta } from "@/content/sections";
import { fadeUp } from "@/lib/motion/variants";

export default function SectionFinalQuestion() {
  return (
    <SectionShell
      id="the-final-question"
      index="10"
      label="THE FINAL QUESTION"
      className="relative flex flex-col justify-between bg-ink-warmer pt-24 pb-8"
      as="footer"
      minHeight="auto"
      maxWidthClassName="max-w-8xl"
    >

      {/* Background crescent moon/crescent shape & particle ember effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft gold glow */}
        <div className="absolute top-[40%] right-[-10%] w-[380px] h-[380px] rounded-full bg-gold/5 blur-[90px]" />

        {/* Faint crescent shape */}
        <svg className="absolute bottom-[10%] right-[2%] w-[300px] h-[300px] text-gold/10 opacity-35" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50,10 A40,40 0 1,0 90,50 A35,35 0 1,1 50,10 Z" />
        </svg>
      </div>

      {/* Main 3-Column Layout */}
      <div className="relative z-10 w-full max-w-8xl mx-auto px-6 md:px-14 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-center flex-1 my-auto">

        {/* Left Column: Reflective question */}
        <div className="text-left flex flex-col gap-3">
          <h2 className="font-serif font-extralight leading-snug tracking-wide text-ivory text-xl sm:text-2xl md:text-3xl">
            {finalQuestion.question.map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h2>
        </div>

        {/* Center Column: Core philosophy words */}
        <div className="text-left md:text-center flex flex-col gap-2 md:items-center">
          <div className="flex flex-col gap-1 font-serif text-sm sm:text-base text-ivory-dim leading-relaxed font-light">
            {finalQuestion.lines.map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </div>
          <span className="font-serif text-base sm:text-lg text-gold font-normal mt-2 block shadow-[0_0_12px_rgba(201,162,75,0.1)]">
            {finalQuestion.gold}
          </span>
        </div>

        {/* Right Column: Logo & Final CTAs */}
        <div className="text-left md:text-right flex flex-col gap-6 md:items-end">
          <div className="flex flex-col gap-1">
            <h4 className="font-serif text-base font-light text-ivory tracking-[0.16em]">
              {brand.name}
            </h4>
            <EyebrowLabel className="text-gold tracking-[0.24em] font-semibold text-[0.6rem]">
              {brand.tagline}
            </EyebrowLabel>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3.5 w-full sm:w-auto md:w-full items-stretch sm:items-center md:items-end">
            <PrimaryButton href={cta.enterCollection.href} className="w-full sm:w-auto text-center justify-center">
              {cta.enterCollection.label}
            </PrimaryButton>
            <OutlinedButton href={cta.exploreUniverse.href} className="w-full sm:w-auto text-center justify-center">
              {cta.exploreUniverse.label}
            </OutlinedButton>
          </div>
        </div>

      </div>

      {/* Footer bar */}
      <div className="relative z-10 w-full text-center border-t border-ivory/5 pt-6 mt-12 flex flex-col items-center gap-1">
        <span className="text-[0.62rem] tracking-[0.2em] text-gold/60 uppercase block mb-1">
          {footerCopy.mark}
        </span>
        <span className="text-[0.62rem] tracking-[0.16em] text-ivory-mute uppercase font-medium">
          {footerCopy.text}
        </span>
      </div>

    </SectionShell>
  );
}
