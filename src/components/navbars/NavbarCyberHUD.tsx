"use client";

import React, { useState, useEffect, useRef } from "react";
import { animate } from "animejs";
import CountUp from "react-countup";

const NAVIGATION = [
  { roman: "I", label: "Home", chapter: 0, href: "/" },
  { roman: "II", label: "Manifesto", chapter: 100, href: "/#manifesto" },
  { roman: "III", label: "Artifacts", chapter: 200, href: "#" },
  { roman: "IV", label: "The Lexicon", chapter: 300, href: "#" },
  { roman: "V", label: "Contact", chapter: 400, href: "#contact" },
];

export default function NavbarCyberHUD() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rectRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    if (isOpen && rectRef.current) {
      // Add a 50px buffer to the length to guarantee the loop closes completely
      const length = rectRef.current.getTotalLength() + 50;
      rectRef.current.style.strokeDasharray = `${length}`;
      rectRef.current.style.strokeDashoffset = `${length}`;

      // Draw SVG frame dynamically using Anime.js v4
      animate(rectRef.current, {
        strokeDashoffset: 0,
        ease: "out-cubic",
        duration: 1200,
      });
    }
  }, [isOpen]);

  return (
    <div className="relative z-10 text-amber-400 py-4 flex flex-col items-center">
      {/* HUD Trigger Button (Larger & Premium) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 flex flex-col items-center justify-center border border-amber-500/30 rounded-xl bg-slate-950/80 hover:border-amber-500/80 hover:bg-slate-900 transition-all duration-300 cursor-pointer shadow-lg shadow-black/40 group active:scale-95"
      >
        <span className="font-mono text-[10px] tracking-wider text-amber-500/60 group-hover:text-amber-400 transition-colors uppercase">
          {isOpen ? "Close" : "Menu"}
        </span>
        <span className="font-mono text-xs font-bold text-amber-300 mt-0.5">
          {isOpen ? "X" : "HUD"}
        </span>
      </button>

      {/* Expanded Menu Panel (Wider, more padding, clean text layout) */}
      {isOpen && (
        <div className="absolute top-20 right-0 w-[360px] p-8 bg-slate-950/95 border border-amber-500/30 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/90 overflow-hidden">
          {/* Decorative Corner Borders (SVG draw-in directly on the border) */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full" fill="none" strokeWidth="1.5">
              <rect
                ref={rectRef}
                x="0.75"
                y="0.75"
                rx="16"
                ry="16"
                className="stroke-amber-400"
                style={{ width: "calc(100% - 1.5px)", height: "calc(100% - 1.5px)" }}
              />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col gap-8 font-mono">
            {/* Header info bar */}
            <div className="border-b border-amber-500/20 pb-4 flex justify-between items-center text-xs">
              <span className="text-[10px] tracking-[0.25em] uppercase text-amber-500/50">
                SYSTEM INVENTORY
              </span>
              <span className="text-amber-300 font-bold tracking-widest">
                SEC_INIT // <CountUp end={100} duration={1.5} />%
              </span>
            </div>

            {/* Menu Links List (Larger fonts, better spacing, smooth hover transitions) */}
            <nav className="flex flex-col gap-6">
              {NAVIGATION.map((item, idx) => (
                <div key={item.label} className="group flex justify-between items-center py-1.5 border-b border-transparent hover:border-amber-500/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] w-6 ${activeIndex === idx ? "text-amber-400 font-bold" : "text-amber-500/30"}`}>
                      {item.roman}
                    </span>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveIndex(idx);
                      }}
                      className="py-1"
                    >
                      <span
                        className={`text-base tracking-widest transition-all duration-300 uppercase ${
                          activeIndex === idx
                            ? "text-amber-300 font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] pl-1"
                            : "text-slate-400 group-hover:text-amber-100 group-hover:pl-0.5"
                        }`}
                      >
                        {item.label}
                      </span>
                    </a>
                  </div>
                  <span className={`text-[11px] transition-colors duration-300 ${activeIndex === idx ? "text-amber-300/80 font-bold" : "text-amber-500/40"}`}>
                    CH_0{item.chapter}
                  </span>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
