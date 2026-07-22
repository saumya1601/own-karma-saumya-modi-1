"use client";

import { motion } from "framer-motion";
import { SectionShell } from "../_components/section-shell";
import { DisplayHeading, EyebrowLabel } from "../_components/typography";
import { whatIsCopy } from "@/content/sections";
import { fadeUp } from "@/lib/motion/variants";

export default function SectionWhatIs() {
  return (
    <SectionShell
      id="what-is-own-karma"
      index="03"
      label="WHAT IS OWN KARMA?"
      className="relative flex flex-col md:flex-row items-center justify-between bg-ink px-6 md:px-14 py-20"
      maxWidthClassName="max-w-8xl"
    >
      {/* Background radial accent */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_25%_45%,_var(--color-ink-2)_0%,_transparent_65%)]" />

      {/* Left Column: Stacked Serif Typography */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.05 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
        }}
        className="relative z-10 w-full md:w-1/2 flex flex-col items-start gap-4 mb-12 md:mb-0 leading-none"
      >
        {["OWN", "YOUR", "KARMA"].map((word) => (
          <motion.div key={word} variants={fadeUp}>
            <DisplayHeading className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-light tracking-wide text-ivory">
              {word}
            </DisplayHeading>
          </motion.div>
        ))}

        <motion.div variants={fadeUp} className="mt-6">
          {/* Gold rule from the mock — sits between KARMA and the eyebrow */}
          <span aria-hidden className="mb-4 block h-px w-14 bg-gold" />
          <EyebrowLabel className="text-ivory-dim text-xs sm:text-sm font-semibold tracking-[0.32em]">
            {whatIsCopy.eyebrow}
          </EyebrowLabel>
        </motion.div>
      </motion.div>

      {/* Right Column: Editorial Paragraphs */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.05 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.22, delayChildren: 0.3 } },
        }}
        className="relative z-10 w-full md:w-5/12 text-left flex flex-col gap-6 md:gap-8"
      >
        {whatIsCopy.paragraphs.map((p, i) => (
          <motion.p
            key={i}
            variants={fadeUp}
            className="font-serif text-lg sm:text-xl lg:text-2xl leading-relaxed text-ivory-dim font-light"
          >
            {p.plain}
            {p.gold && (
              <>
                <span className="text-gold font-normal mx-1 shadow-[0_0_12px_rgba(201,162,75,0.1)]">
                  {p.gold}
                </span>
                {p.trail || ""}
              </>
            )}
          </motion.p>
        ))}
      </motion.div>
    </SectionShell>
  );
}
