"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionShell } from "../_components/section-shell";
import { philosophyStages, philosophyCaption } from "@/content/sections";
import { fadeUp } from "@/lib/motion/variants";

export default function SectionPhilosophyToGarment() {
  return (
    <SectionShell
      id="philosophy-to-garment"
      index="07"
      label="FROM PHILOSOPHY TO GARMENT"
      className="relative flex flex-col items-center justify-between bg-ink-warm-soft py-20 min-h-screen"
      maxWidthClassName="max-w-8xl"
    >
      <div className="z-10 w-full max-w-8xl px-6 md:px-14 flex flex-col items-center gap-14 my-auto pt-16 sm:pt-20">
        {/* 5-Stage row — all visible at once per mock */}
        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.18, delayChildren: 0.15 } },
          }}
          className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12 items-start"
        >
          {philosophyStages.map((stage, idx) => (
            <motion.li
              key={stage.index}
              variants={fadeUp}
              className="group relative flex flex-col items-center gap-6 text-center"
            >
              {/* Numeric index + label above the visual */}
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[0.62rem] tracking-[0.24em] font-medium text-ivory-mute group-hover:text-gold/70 transition-colors duration-500">
                  {stage.index}
                </span>
                <span className="text-[0.7rem] sm:text-[0.75rem] tracking-brand font-medium text-ivory/70 group-hover:text-ivory transition-colors duration-500 uppercase">
                  {stage.label}
                </span>
              </div>

              {/* Stage visual: Sliced transparent WebP image */}
              <div className="relative w-full h-[160px] sm:h-[180px] md:h-[220px] flex items-center justify-center overflow-visible">
                <Image
                  src={`/section-7-images/stage-${idx}.webp`}
                  alt={stage.label}
                  fill
                  sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 15vw"
                  className="object-contain transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:drop-shadow-[0_0_25px_rgba(201,162,75,0.22)]"
                  priority={idx < 2}
                />

                {/* Arrow separator to next stage (desktop only, not last) */}
                {idx < philosophyStages.length - 1 && (
                  <svg
                    className="hidden lg:block absolute top-1/2 -translate-y-1/2 -right-8 lg:-right-10 w-8 h-8 text-gold/55 select-none pointer-events-none"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    aria-hidden
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </motion.li>
          ))}
        </motion.ol>

        {/* Caption below the row */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ delay: 0.5, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-lg sm:text-xl lg:text-2xl font-light text-ivory-dim leading-relaxed max-w-3xl text-center px-4"
        >
          {philosophyCaption.line1}
          <br className="hidden sm:inline" />
          {philosophyCaption.line2Prefix}
          <span className="text-gold font-normal">{philosophyCaption.line2Gold}</span>
          {philosophyCaption.line2Suffix}
        </motion.p>
      </div>
    </SectionShell>
  );
}

