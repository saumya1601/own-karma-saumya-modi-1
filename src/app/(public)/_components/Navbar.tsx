"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Navbar — fixed top-bar with the brand wordmark on the left and a menu
 * trigger on the right. Opening the trigger reveals a right-side "temple
 * sidebar" drawer with brand-styled navigation.
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const menuItems = [
    { roman: "I", label: "Manifesto", href: "/#manifesto" },
    { roman: "II", label: "Artifacts", href: "#" },
    { roman: "III", label: "The Lexicon", href: "#" },
    { roman: "IV", label: "About Mission", href: "/about" },
    { roman: "V", label: "Pricing", href: "/pricing" },
  ];

  const barClass =
    "absolute w-[4px] h-[26px] rounded-full transition-all duration-500 ease-out";

  return (
    <>
      {/* Outer transparent header */}
      <header className="fixed top-0 left-0 w-full z-50 h-20 flex items-center justify-between px-6 sm:px-10 md:px-14 pointer-events-none bg-transparent">
        {/* Brand wordmark */}
        <div className="pointer-events-auto">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 group"
          >
            <span className="font-monument text-gold group-hover:text-gold-bright uppercase tracking-[0.3em] text-sm transition-colors duration-500">
              Own · Karma
            </span>
          </Link>
        </div>

        {/* Menu trigger — three gold bars → gold-bright X on open */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
          className="pointer-events-auto w-12 h-12 flex items-center justify-center relative focus:outline-none cursor-pointer z-50 group"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div
              className={`${barClass} ${isOpen
                  ? "translate-x-0 rotate-[45deg] bg-gold-bright"
                  : "-translate-x-[9px] -rotate-[22deg] bg-gold group-hover:bg-gold-bright"
                }`}
            />
            <div
              className={`${barClass} ${isOpen
                  ? "opacity-0 scale-0"
                  : "translate-x-0 -rotate-[22deg] bg-gold group-hover:bg-gold-bright"
                }`}
            />
            <div
              className={`${barClass} ${isOpen
                  ? "translate-x-0 rotate-[-45deg] bg-gold-bright"
                  : "translate-x-[9px] -rotate-[22deg] bg-gold group-hover:bg-gold-bright"
                }`}
            />
          </div>
        </button>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop — void wash with faint blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 w-screen h-screen z-40 bg-void/85 backdrop-blur-sm cursor-pointer"
            />

            {/* Temple sidebar drawer */}
            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                closed: {
                  x: "100%",
                  transition: {
                    type: "tween",
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                    staggerChildren: 0.04,
                    staggerDirection: -1,
                  },
                },
                open: {
                  x: 0,
                  transition: {
                    type: "tween",
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                    staggerChildren: 0.07,
                    delayChildren: 0.18,
                  },
                },
              }}
              className="fixed top-0 right-0 h-screen w-full sm:w-[440px] md:w-[500px] z-40 bg-void border-l border-gold/20 flex flex-col overflow-hidden"
            >
              {/* ── Decorative backdrop layers ── */}

              {/* Radial nebula wash */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 100% 30%, rgba(35,35,67,0.55) 0%, transparent 65%)",
                }}
              />

              {/* Warm gold shaft descending from top-right */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "conic-gradient(from 200deg at 100% 0%, transparent 0deg, rgba(198,161,91,0.10) 30deg, transparent 70deg)",
                }}
              />

              {/* Concentric orbit rings anchored to the top-right corner */}
              <svg
                aria-hidden
                viewBox="-300 -300 600 600"
                className="pointer-events-none absolute top-[-160px] right-[-160px] w-[520px] h-[520px] stroke-gold opacity-25"
                strokeWidth="0.6"
                fill="none"
              >
                {[120, 180, 240, 300].map((r, i) => (
                  <circle key={r} cx={0} cy={0} r={r} strokeOpacity={0.5 - i * 0.1} />
                ))}
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i / 12) * Math.PI * 2;
                  const x1 = (Math.cos(a) * 240).toFixed(3);
                  const y1 = (Math.sin(a) * 240).toFixed(3);
                  const x2 = (Math.cos(a) * 260).toFixed(3);
                  const y2 = (Math.sin(a) * 260).toFixed(3);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity="0.5" />;
                })}
              </svg>

              {/* Film-grain overlay for texture */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                }}
              />

              {/* Gold hairline anchors at the corners */}
              <span aria-hidden className="pointer-events-none absolute top-0 left-0 h-px w-16 bg-linear-to-r from-gold/60 to-transparent" />
              <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-px w-16 bg-linear-to-r from-gold/40 to-transparent" />

              {/* Corner mandala at the top-right */}
              <SidebarCornerMandala className="absolute top-4 right-16 opacity-30" />
              <SidebarCornerMandala className="absolute bottom-4 right-4 opacity-30 -scale-y-100" />

              {/* ── Content ── */}
              <div className="relative z-10 flex flex-col justify-between h-full p-8 sm:p-12 md:p-14">
                {/* Top: chapter label */}
                <div className="pt-16">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-gold/60" />
                    <span className="utility-label text-gold">Navigate the Universe</span>
                  </div>
                </div>

                {/* Nav items — monument face, roman numeral prefix */}
                <nav className="flex flex-col gap-6 sm:gap-7 my-auto">
                  {menuItems.map((item) => (
                    <motion.div
                      key={item.label}
                      variants={{
                        closed: { opacity: 0, x: 30 },
                        open: { opacity: 1, x: 0 },
                      }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-baseline gap-5 w-fit"
                      >
                        <span className="font-utility text-[10px] tracking-[0.4em] text-gold/70 group-hover:text-gold-bright transition-colors duration-500 pt-2">
                          {item.roman}
                        </span>
                        <span className="relative inline-block">
                          <span className="font-monument text-marble group-hover:text-gold-bright uppercase tracking-[0.14em] text-3xl sm:text-4xl leading-none transition-colors duration-500">
                            {item.label}
                          </span>
                          {/* Gold underline that draws in on hover */}
                          <span
                            aria-hidden
                            className="absolute left-0 -bottom-2 h-px bg-gold-bright origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
                            style={{ width: "100%" }}
                          />
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Bottom: brand seal + tagline + copyright */}
                <motion.div
                  variants={{
                    closed: { opacity: 0, y: 15 },
                    open: { opacity: 1, y: 0 },
                  }}
                  transition={{ delay: 0.28, duration: 0.5 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center gap-4">
                    <SidebarSeal />
                    <div>
                      <p className="font-monument text-marble uppercase tracking-[0.28em] text-xs">
                        Own · Karma
                      </p>
                      <p className="font-editorial italic text-stone text-sm mt-1">
                        Every thread returns.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gold/10 flex items-center justify-between font-utility text-[9px] tracking-[0.28em] uppercase text-stone/70">
                    <span>© {new Date().getFullYear()} · Own Karma</span>
                    <span className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-gold rotate-45" />
                      Edition One
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ────────── Sidebar decorative sub-components ────────── */

function SidebarCornerMandala({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={`w-16 h-16 stroke-gold/50 fill-none pointer-events-none ${className}`}
      strokeWidth="0.6"
      aria-hidden
    >
      <path d="M2 40 Q2 2 40 2" />
      <path d="M10 40 Q10 10 40 10" />
      <path d="M18 40 Q18 18 40 18" />
      <path d="M2 40 L14 40" />
      <path d="M40 2 L40 14" />
      <circle cx="10" cy="10" r="1.2" fill="var(--color-gold)" stroke="none" />
      <path d="M14 14 L22 22" />
      <circle cx="22" cy="22" r="0.8" fill="var(--color-gold-bright)" stroke="none" />
    </svg>
  );
}

function SidebarSeal() {
  return (
    <svg
      viewBox="-30 -30 60 60"
      className="w-12 h-12 stroke-gold shrink-0"
      strokeWidth="0.9"
      fill="none"
    >
      <circle cx={0} cy={0} r={26} />
      <circle cx={0} cy={0} r={20} strokeDasharray="2 3" />
      <circle cx={0} cy={0} r={12} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const x1 = (Math.cos(a) * 20).toFixed(3);
        const y1 = (Math.sin(a) * 20).toFixed(3);
        const x2 = (Math.cos(a) * 26).toFixed(3);
        const y2 = (Math.sin(a) * 26).toFixed(3);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
      <text
        x="0"
        y="1"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-monument)"
        fontSize={8}
        letterSpacing={2}
        fill="var(--color-gold-bright)"
      >
        OK
      </text>
    </svg>
  );
}
