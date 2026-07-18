"use client";

import React, { useState } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Manifesto", href: "/#manifesto" },
  { label: "Artifacts", href: "#" },
  { label: "Lexicon", href: "#" },
  { label: "Contact", href: "#contact" },
];

export default function NavbarConstellation() {
  const [activeIndex, setActiveIndex] = useState(0);

  const initParticles = async (engine: Engine) => {
    await loadSlim(engine);
  };

  return (
    <ParticlesProvider init={initParticles}>
      <div className="absolute inset-x-0 top-0 h-20 z-50 overflow-hidden select-none pointer-events-auto">
        {/* Interactive Constellation Particle Grid Background */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <Particles
            id="tsparticles-nav"
            options={{
              fullScreen: { enable: false },
              background: { color: "transparent" },
              fpsLimit: 120,
              interactivity: {
                events: {
                  onHover: { enable: true, mode: "grab" },
                },
                modes: {
                  grab: { distance: 160, links: { opacity: 0.85 } },
                },
              },
              particles: {
                color: { value: "#e9cd8b" },
                links: { color: "#e9cd8b", distance: 100, enable: true, opacity: 0.25, width: 1 },
                move: { enable: true, speed: 1.5 },
                number: { density: { enable: true }, value: 65 },
                opacity: { value: 0.5 },
                size: { value: { min: 1, max: 3 } },
              },
            }}
          />
        </div>

        {/* Structured Vector System Header Panel */}
        <div className="absolute inset-0 z-10 flex items-center justify-between px-8 border-b border-amber-500/20 bg-slate-950/80 backdrop-blur-md">
          {/* Left: System Diagnostics & Coordinates */}
          <div className="flex items-center gap-4 font-mono text-[10px] text-amber-500/40">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <div className="flex flex-col gap-0.5">
              <div className="text-amber-300 font-bold tracking-wider">NAV_CORE // v2.4</div>
              <div>COORD // [0x77A // 58.12]</div>
            </div>
          </div>

          {/* Center: Constellation Vector Crosshair Menu Links */}
          <nav className="flex items-center h-full">
            {NAV_ITEMS.map((item, index) => (
              <div key={item.label} className="relative flex items-center h-full px-6 border-r border-amber-500/10 last:border-r-0">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveIndex(index);
                  }}
                  className={`relative z-10 font-mono text-xs uppercase tracking-[0.3em] py-2 transition-all duration-300 ${
                    activeIndex === index
                      ? "text-amber-300 font-bold scale-105"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {item.label}

                  {/* Scientific Crosshair Corner Marks on active index */}
                  {activeIndex === index && (
                    <>
                      {/* Top-Left Corner */}
                      <span className="absolute -top-1 -left-2.5 w-1.5 h-1.5 border-t border-l border-amber-400" />
                      {/* Top-Right Corner */}
                      <span className="absolute -top-1 -right-2.5 w-1.5 h-1.5 border-t border-r border-amber-400" />
                      {/* Bottom-Left Corner */}
                      <span className="absolute -bottom-1 -left-2.5 w-1.5 h-1.5 border-b border-l border-amber-400" />
                      {/* Bottom-Right Corner */}
                      <span className="absolute -bottom-1 -right-2.5 w-1.5 h-1.5 border-b border-r border-amber-400" />
                    </>
                  )}
                </a>
              </div>
            ))}
          </nav>

          {/* Right: Flight Direction specs */}
          <div className="flex items-center gap-6 font-mono text-[10px] text-amber-500/40 text-right">
            <div className="flex flex-col gap-0.5">
              <div>BEARING // 248.6°</div>
              <div className="text-amber-400">STAR_LOCK // ACTIVE</div>
            </div>
          </div>
        </div>
      </div>
    </ParticlesProvider>
  );
}
