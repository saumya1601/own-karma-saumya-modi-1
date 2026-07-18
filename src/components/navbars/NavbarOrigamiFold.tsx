"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Manifesto", href: "/#manifesto" },
  { label: "Artifacts", href: "#" },
  { label: "Lexicon", href: "#" },
  { label: "Contact", href: "#contact" },
];

export default function NavbarOrigamiFold() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);
  const panel3Ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Trigger true 3D Z-fold paper unfolding animation after mounting
  useEffect(() => {
    if (isOpen && panel1Ref.current && panel2Ref.current && panel3Ref.current) {
      gsap.killTweensOf([panel1Ref.current, panel2Ref.current, panel3Ref.current, contentRef.current]);
      
      // Set initial accordion folded state (Z-fold layers folded on top of each other)
      gsap.set(panel1Ref.current, { rotationY: -90, opacity: 0 });
      gsap.set(panel2Ref.current, { rotationY: 180, opacity: 0 });
      gsap.set(panel3Ref.current, { rotationY: -180, opacity: 0 });
      gsap.set(contentRef.current, { opacity: 0, y: 30 });

      // Unfold timeline: panel 1 swings open -> panel 2 swings open -> panel 3 swings open
      const tl = gsap.timeline();
      tl.to(panel1Ref.current, {
        rotationY: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power2.out",
      })
      .to(panel2Ref.current, {
        rotationY: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power2.out",
      }, "-=0.5")
      .to(panel3Ref.current, {
        rotationY: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power2.out",
      }, "-=0.5")
      .to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
      }, "-=0.3");
    }
  }, [isOpen]);

  const toggleMenu = () => {
    if (!isOpen) {
      setIsOpen(true);
    } else {
      // Fold timeline: panel 3 folds back -> panel 2 folds back -> panel 1 folds back
      gsap.killTweensOf([panel1Ref.current, panel2Ref.current, panel3Ref.current, contentRef.current]);
      
      const tl = gsap.timeline({
        onComplete: () => setIsOpen(false)
      });
      tl.to(contentRef.current, {
        opacity: 0,
        y: -15,
        duration: 0.3,
        ease: "power2.in",
      })
      .to(panel3Ref.current, {
        rotationY: -180,
        opacity: 0,
        duration: 0.55,
        ease: "power2.inOut",
      }, "-=0.15")
      .to(panel2Ref.current, {
        rotationY: 180,
        opacity: 0,
        duration: 0.55,
        ease: "power2.inOut",
      }, "-=0.4")
      .to(panel1Ref.current, {
        rotationY: -90,
        opacity: 0,
        duration: 0.55,
        ease: "power2.inOut",
      }, "-=0.4");
    }
  };

  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      {/* Menu Trigger Button */}
      <button
        onClick={toggleMenu}
        className="absolute top-6 right-6 z-50 px-5 py-2.5 font-mono text-xs uppercase tracking-widest border border-amber-500/20 rounded bg-slate-950/80 hover:border-amber-500/60 transition-colors cursor-pointer text-amber-400 pointer-events-auto"
      >
        {isOpen ? "Close // Fold" : "Menu // Unfold"}
      </button>

      {/* Origami Fullscreen Backdrop Panels */}
      {isOpen && (
        <div className="absolute inset-0 z-40 flex overflow-hidden pointer-events-none select-none" style={{ perspective: 1200 }}>
          {/* Panel 1 (Swing Pivot: origin-left) */}
          <div
            ref={panel1Ref}
            className="absolute top-0 left-0 w-1/3 h-full bg-slate-900 border-r border-slate-800/20 shadow-2xl origin-left"
            style={{ transformStyle: "preserve-3d", willChange: "transform, opacity" }}
          >
            {/* Panel 2 (Nested: Swing Pivot: origin-left relative to Panel 1's right edge) */}
            <div
              ref={panel2Ref}
              className="absolute top-0 left-full w-full h-full bg-slate-950 border-r border-slate-800/20 shadow-2xl origin-left flex flex-col items-center justify-center p-8 md:p-16 pointer-events-auto"
              style={{ transformStyle: "preserve-3d", willChange: "transform, opacity" }}
            >
              {/* Sci-Fi Gold Corner Accents on the entire face of Panel 2 */}
              <span className="absolute top-4 left-4 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400/80" />
              <span className="absolute top-4 right-4 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400/80" />
              <span className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400/80" />
              <span className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400/80" />

              <div 
                ref={contentRef} 
                className="w-full h-full flex flex-col justify-between"
              >
                {/* Technical Header */}
                <div className="flex flex-col items-center gap-1.5 border-b border-amber-500/10 pb-4 text-center mt-12">
                  <span className="text-[11px] font-mono tracking-[0.35em] uppercase text-amber-300 font-bold">
                    SYS_PORTAL // NAVIGATION
                  </span>
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                    3D ACCORDION HINGE MATRIX // Z_FOLD
                  </span>
                </div>
                
                {/* Technical Catalog Menu List - Stretches to fill Panel 2's width */}
                <nav className="flex flex-col gap-4 w-full font-mono my-auto">
                  {NAV_ITEMS.map((item, idx) => (
                    <a
                      key={item.label}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveIndex(idx);
                        setTimeout(toggleMenu, 400); // Slight delay to show selected flash
                      }}
                      className={`group flex items-center justify-between py-3.5 px-6 rounded border transition-all duration-300 ${
                        activeIndex === idx
                          ? "bg-amber-400/10 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)] pl-8 font-bold"
                          : "text-slate-400 hover:text-amber-100 hover:bg-slate-900/60 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold transition-colors ${activeIndex === idx ? "text-amber-400" : "text-slate-600"}`}>
                          [0{idx + 1}]
                        </span>
                        <span className="text-xs uppercase tracking-[0.25em]">{item.label}</span>
                      </div>
                      <span className={`text-[8px] transition-colors duration-300 ${activeIndex === idx ? "text-amber-400/80" : "text-slate-600"}`}>
                        CAT // 0{idx + 1}
                      </span>
                    </a>
                  ))}
                </nav>

                {/* Technical Footer Readouts */}
                <div className="border-t border-amber-500/10 pt-4 pb-12 w-full flex justify-between items-center text-[8px] text-slate-500 font-mono tracking-widest">
                  <span>SECT_NUM // 07</span>
                  <span>COORD // [48.11 // OK]</span>
                </div>
              </div>

              {/* Panel 3 (Nested: Swing Pivot: origin-left relative to Panel 2's right edge) */}
              <div
                ref={panel3Ref}
                className="absolute top-0 left-full w-full h-full bg-slate-900 shadow-2xl origin-left pointer-events-none"
                style={{ willChange: "transform, opacity" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
