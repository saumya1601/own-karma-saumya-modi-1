# Concept 2: Cybernetic HUD Compass

A high-tech Heads-Up Display (HUD) style menu. Clicking the menu button triggers geometric borders to "draw-in" dynamically while links animate with retro typing effects and section coordinate counters.

## Design Aesthetic
* **Thin Lines**: 1px gold borders wrapping components.
* **SVG Animation**: Outlines draw-in from start to end points dynamically.
* **Typographic**: Interactive typewriter text reveals paired with running number tickers.

## Library Stack Integration
* **`animejs`**: For the SVG border draw-in strokes.
* **`typed.js` / `react-typed`**: To create typewriter reveals for link text.
* **`react-countup`**: Ticking numbers indicating page locations.

## Implementation Example

Create `src/components/NavbarCyberHUD.tsx`:

```tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";
import CountUp from "react-countup";
import { ReactTyped } from "react-typed";

const NAVIGATION = [
  { roman: "I", label: "Manifesto", chapter: 100 },
  { roman: "II", label: "Artifacts", chapter: 200 },
  { roman: "III", label: "The Lexicon", chapter: 300 },
];

export default function NavbarCyberHUD() {
  const [isOpen, setIsOpen] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (isOpen && pathRef.current) {
      // Draw SVG frame dynamically using Anime.js
      anime({
        targets: pathRef.current,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: "cubicBezier(0.22, 1, 0.36, 1)",
        duration: 1200,
      });
    }
  }, [isOpen]);

  return (
    <div className="fixed top-6 right-6 z-50 text-gold-bright">
      {/* HUD Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 flex items-center justify-center border border-amber-500/30 rounded bg-slate-950/80 hover:border-amber-500/80 transition-colors"
      >
        <span className="font-mono text-xs">{isOpen ? "X" : "HUD"}</span>
      </button>

      {/* Expanded Menu Panel */}
      {isOpen && (
        <div className="absolute top-14 right-0 w-80 p-6 bg-slate-950/95 border border-amber-500/30 backdrop-blur-md rounded shadow-2xl overflow-hidden">
          {/* Decorative Corner Borders (SVG draw-in) */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full stroke-amber-500/50" fill="none" strokeWidth="1">
              <path
                ref={pathRef}
                d="M 10,10 L 290,10 L 290,240 L 10,240 Z"
                className="stroke-amber-400"
              />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col gap-6 font-mono text-sm">
            <div className="border-b border-amber-500/20 pb-3 flex justify-between items-center">
              <span className="text-[10px] tracking-[0.2em] uppercase text-amber-500/60">
                SYSTEM INVENTORY
              </span>
              <span className="text-xs text-amber-400">
                SEC_INIT // <CountUp end={100} duration={1.5} />%
              </span>
            </div>

            <nav className="flex flex-col gap-4">
              {NAVIGATION.map((item, idx) => (
                <div key={item.label} className="group flex justify-between items-center py-1">
                  <div className="flex items-center gap-3">
                    <span className="text-amber-500/40 text-[10px]">{item.roman}</span>
                    <a href="#" className="hover:text-white transition-colors">
                      <ReactTyped
                        strings={[item.label]}
                        typeSpeed={40}
                        showCursor={false}
                      />
                    </a>
                  </div>
                  <span className="text-[11px] text-amber-500/50">
                    CH_0<CountUp end={item.chapter} duration={2} />
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
```
