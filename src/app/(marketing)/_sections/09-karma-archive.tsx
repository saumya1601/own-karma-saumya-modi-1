"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionShell } from "../_components/section-shell";
import { EyebrowLabel } from "../_components/typography";
import { OutlinedButton } from "../_components/buttons";
import { featuredArchive } from "@/content/archive";
import { fadeUp } from "@/lib/motion/variants";

export default function SectionKarmaArchive() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [scrollRange, setScrollRange] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

  useEffect(() => {
    const calculateRange = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (track && viewport) {
        const range = track.scrollWidth - viewport.offsetWidth;
        setScrollRange(range > 0 ? range : 0);
      }
    };

    calculateRange();

    const resizeObserver = new ResizeObserver(() => {
      calculateRange();
    });

    if (trackRef.current) resizeObserver.observe(trackRef.current);
    if (viewportRef.current) resizeObserver.observe(viewportRef.current);

    window.addEventListener("resize", calculateRange);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", calculateRange);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[150vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center bg-ink-warm">
        <SectionShell
          id="the-karma-archive"
          index="09"
          label="THE KARMA ARCHIVE"
          className="w-full h-full flex flex-col lg:flex-row items-center justify-between bg-transparent px-6 md:px-14 pt-32 pb-24"
          minHeight="auto"
          maxWidthClassName="max-w-8xl"
        >
          {/* Left Column: Archive identity card */}
          <div className="relative z-10 w-full lg:w-[35%] text-left flex flex-col gap-6 lg:gap-8 mb-12 lg:mb-0">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.4 }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.15 } }
              }}
              className="flex flex-col gap-4"
            >
              <motion.div variants={fadeUp}>
                <EyebrowLabel className="text-gold tracking-[0.24em] font-semibold">
                  THE ARCHIVE
                </EyebrowLabel>
              </motion.div>

              <motion.div variants={fadeUp}>
                <h3 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-wider text-ivory lining-nums">
                  {featuredArchive.code}
                </h3>
              </motion.div>

              <motion.h4
                variants={fadeUp}
                className="font-serif text-2xl sm:text-3xl md:text-4xl text-gold font-light tracking-wide uppercase mt-1"
              >
                {featuredArchive.title}
              </motion.h4>

              <motion.div variants={fadeUp} className="mt-2">
                <OutlinedButton href="#collection">
                  EXPLORE
                </OutlinedButton>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Horizontal scroll row of tiles */}
          <div
            ref={viewportRef}
            className="relative z-10 w-full lg:w-[60%] overflow-hidden pb-6 pt-2"
          >
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex gap-6 will-change-transform"
            >
              {featuredArchive.facets.map((facet, idx) => (
                <motion.div
                  key={facet.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex-shrink-0 w-[240px] sm:w-[280px] aspect-[4/5] rounded-2xl overflow-hidden border border-ivory/10 hover:border-gold/40 bg-ink shadow-[0_15px_40px_rgba(0,0,0,0.55)] hover:shadow-[0_20px_50px_rgba(201,162,75,0.12)] transition-[border-color,box-shadow] duration-500 ease-out motion-reduce:transition-none"
                >
                  {/* Hero image — fills the whole card, gently zooms on hover */}
                  <Image
                    src={facet.image}
                    alt={facet.label}
                    fill
                    sizes="(max-width: 640px) 240px, 280px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100"
                  />

                  {/* Warm ink wash so the type stays legible against any frame */}
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/85 via-black/25 to-black/40"
                  />

                  {/* Subtle gold accent that awakens on hover */}
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-t from-gold/12 via-transparent to-transparent"
                  />

                  {/* Content layer */}
                  <div className="relative z-10 h-full w-full flex flex-col justify-between p-6 sm:p-7">
                    {/* Top row — archive index counter */}
                    <div className="flex items-center justify-between">
                      <span className="text-[0.6rem] sm:text-[0.65rem] tracking-[0.28em] font-medium text-ivory/75 group-hover:text-gold uppercase transition-colors duration-500">
                        {featuredArchive.code} / 0{idx + 1}
                      </span>
                      <span
                        aria-hidden
                        className="w-1.5 h-1.5 rounded-full bg-gold/50 group-hover:bg-gold shadow-[0_0_8px_rgba(201,162,75,0.6)] transition-colors duration-500"
                      />
                    </div>

                    {/* Bottom — label + archived module tag */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <span className="font-serif text-lg sm:text-xl text-ivory group-hover:text-gold tracking-[0.14em] font-light uppercase transition-colors duration-500">
                        {facet.label}
                      </span>
                      <span className="text-[0.58rem] sm:text-[0.62rem] tracking-[0.28em] text-ivory/50 uppercase font-medium">
                        ARCHIVED MODULE
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </SectionShell>
      </div>
    </section>
  );
}
