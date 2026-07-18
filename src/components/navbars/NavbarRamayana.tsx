"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Home, Scroll, Gem, Book, Mail, Orbit } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", icon: Home },
  { label: "Manifesto", icon: Scroll },
  { label: "Artifacts", icon: Gem },
  { label: "Lexicon", icon: Book },
  { label: "Contact", icon: Mail },
];

export default function NavbarRamayana() {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Shooting state
  const [isShooting, setIsShooting] = useState(false);
  const [strikeIndex, setStrikeIndex] = useState<number | null>(null);

  // References for viewport calculations
  const sectionRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const bowRef = useRef<HTMLDivElement>(null);
  const arrowWrapperRef = useRef<HTMLDivElement>(null);
  
  // String nock point Y in SVG coordinates (React state so it survives re-renders)
  const [nockY, setNockY] = useState(64);
  // Proxy object for GSAP to tween — onUpdate pushes value into React state
  const nockProxy = useRef({ y: 64 });
  
  const [arrowAngle, setArrowAngle] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update arrow trajectory angle dynamically
  const updateTargetAngle = (targetIdx: number) => {
    const button = buttonRefs.current[targetIdx];
    const section = sectionRef.current;
    const bow = bowRef.current;
    if (!button || !section || !bow) return 0;

    const buttonRect = button.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const bowRect = bow.getBoundingClientRect();

    // Get center coordinates relative to the Section 9 wrapper
    const targetX = buttonRect.left - sectionRect.left + buttonRect.width / 2;
    const targetY = buttonRect.top - sectionRect.top + buttonRect.height / 2;

    const bowX = bowRect.left - sectionRect.left + bowRect.width / 2;
    const bowY = bowRect.top - sectionRect.top + bowRect.height / 2;

    // Direct math trajectory angle calculation
    const dx = targetX - bowX;
    const dy = targetY - bowY;
    const angleRad = Math.atan2(dy, dx);
    const rotationDeg = angleRad * (180 / Math.PI) + 90; // Add 90 offset for vertical SVG arrow

    setArrowAngle(rotationDeg);
    return { targetX, targetY, bowX, bowY };
  };

  // Follow mouse movement to dynamically aim the bow in real time
  useEffect(() => {
    const currentIdx = hoveredIndex !== null ? hoveredIndex : activeIndex;
    updateTargetAngle(currentIdx);
  }, [hoveredIndex, activeIndex]);

  const handleItemClick = (index: number) => {
    if (isShooting) return;
    setIsShooting(true);
    setActiveIndex(index);

    // Calculate exact coordinates of the clicked button
    const coords = updateTargetAngle(index);
    if (!coords || !arrowWrapperRef.current) {
      setIsShooting(false);
      return;
    }

    const { targetX, targetY, bowX, bowY } = coords;

    // Calculate trajectory vector from bow to target
    const dx = targetX - bowX;
    const dy = targetY - bowY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize the direction vector
    const nx = dx / distance;
    const ny = dy / distance;

    // Pull-back is the OPPOSITE direction of the trajectory, scaled for dramatic effect
    const pullBackDistance = Math.min(35, distance * 0.08);
    const pullX = -nx * pullBackDistance;
    const pullY = -ny * pullBackDistance;

    // GSAP Arrow Flight timeline
    gsap.killTweensOf(arrowWrapperRef.current);
    gsap.killTweensOf(nockProxy.current);
    
    // Set arrow starting location back to bow center
    gsap.set(arrowWrapperRef.current, {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
    });
    nockProxy.current.y = 64;
    setNockY(64);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsShooting(false);
        // Play button impact particle splash
        setStrikeIndex(index);
        setTimeout(() => setStrikeIndex(null), 700);
      }
    });

    // Phase 1: Smooth pull-back + string stretch simultaneously
    tl.to(arrowWrapperRef.current, {
      x: pullX,
      y: pullY,
      scale: 0.9,
      duration: 0.35,
      ease: "power2.out",
    })
    .to(nockProxy.current, {
      y: 100,
      duration: 0.35,
      ease: "power2.out",
      onUpdate: () => setNockY(nockProxy.current.y),
    }, "<")
    // Phase 2: Hold at full tension (anticipation beat)
    .to(arrowWrapperRef.current, {
      x: pullX * 1.05,
      y: pullY * 1.05,
      duration: 0.08,
      ease: "none",
    })
    .to(nockProxy.current, {
      y: 102,
      duration: 0.08,
      ease: "none",
      onUpdate: () => setNockY(nockProxy.current.y),
    }, "<")
    // Phase 3: Release — accelerate along trajectory
    .to(arrowWrapperRef.current, {
      x: dx,
      y: dy,
      scale: 1.15,
      duration: 0.38,
      ease: "power3.in",
    })
    // String snaps back fast on release
    .to(nockProxy.current, {
      y: 64,
      duration: 0.2,
      ease: "elastic.out(1.2, 0.4)",
      onUpdate: () => setNockY(nockProxy.current.y),
    }, "<")
    // Phase 4: Fade on impact
    .to(arrowWrapperRef.current, {
      opacity: 0,
      scale: 0.5,
      duration: 0.1,
      ease: "power1.out",
    }, "-=0.06");
  };

  if (!mounted) return null;

  return (
    <div ref={sectionRef} className="absolute inset-0 z-50 pointer-events-none">
      
      {/* Tall vertical Navbar Panel on the Right Side - Slightly larger width */}
      <div 
        className="absolute top-6 right-6 z-50 w-48 flex flex-col justify-between p-5 bg-slate-950/85 border border-amber-500/25 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-md pointer-events-auto hover:border-amber-400/50 transition-colors"
      >
        {/* Sky glow */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        
        {/* Navigation Info header */}
        <div className="relative z-10 w-full flex flex-col items-center gap-1 border-b border-amber-500/15 pb-2.5 text-[9px] text-slate-500 font-mono tracking-[0.2em] uppercase text-center">
          <span>Kodanda Tactical Node</span>
          <span className="text-amber-500/70 font-bold">SYSTEM // STANDBY</span>
        </div>

        {/* Links list - Vertically stacked, slightly larger icons/text */}
        <nav className="relative z-10 w-full flex flex-col gap-3.5 py-3">
          {NAV_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeIndex === index;
            return (
              <a
                key={item.label}
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(index);
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex items-center gap-3 transition-all duration-300 relative py-2 px-3.5 rounded-lg border-l-2 ${
                  isActive 
                    ? "text-amber-300 font-bold bg-amber-500/10 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.1)]" 
                    : "text-slate-500 hover:text-amber-100 hover:bg-slate-900/50 border-transparent"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]" : ""}`} />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] whitespace-nowrap">
                  {item.label}
                </span>

                {/* Strike Particle Explosion Splash - Heavy cinematic feedback */}
                {strikeIndex === index && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Shockwave expanding ring */}
                    <span className="absolute w-6 h-6 rounded-full border-2 border-amber-400/80 animate-impact-shockwave" />
                    
                    {/* Dynamic Gold Spark Particles - 8 directional vector lines */}
                    <span className="absolute w-1.5 h-1.5 bg-amber-300 rounded-full animate-spark-1" />
                    <span className="absolute w-1.5 h-1.5 bg-amber-400 rounded-full animate-spark-2" />
                    <span className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full animate-spark-3" />
                    <span className="absolute w-1.5 h-1.5 bg-amber-500 rounded-full animate-spark-4" />
                    <span className="absolute w-1.5 h-1.5 bg-amber-200 rounded-full animate-spark-5" />
                    <span className="absolute w-1.5 h-1.5 bg-orange-400 rounded-full animate-spark-6" />
                    <span className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full animate-spark-7" />
                    <span className="absolute w-1.5 h-1.5 bg-amber-600 rounded-full animate-spark-8" />
                    
                    {/* Heavy impact flash layer */}
                    <div className="absolute inset-0 bg-amber-400/25 rounded-lg animate-flash-strike" />
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        {/* Technical Footer */}
        <div className="relative z-10 w-full flex justify-between items-center text-[7.5px] text-slate-600 font-mono tracking-widest border-t border-amber-500/15 pt-2.5">
          <span>SYS // OK</span>
          <span>SEC // 09</span>
        </div>
      </div>

      {/* Bow Launcher assembly positioned at the Bottom-Left Corner - Slightly Larger */}
      <div 
        ref={bowRef}
        className="absolute bottom-8 left-8 w-28 h-28 flex items-center justify-center pointer-events-auto cursor-pointer"
      >
        <svg 
          className="absolute w-full h-full text-amber-400/55 drop-shadow-[0_0_10px_rgba(245,158,11,0.35)]" 
          viewBox="0 0 100 100"
          style={{
            transform: `rotate(${arrowAngle}deg)`,
            transition: "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {/* Main Bow Arc */}
          <path 
            d="M 20,62 A 30,30 0 0,1 80,62" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          {/* Bow String - V-shape from bow tips to nock point, driven by React state */}
          <line x1="20" y1="62" x2="50" y2={nockY} stroke="currentColor" strokeWidth="1.5" />
          <line x1="80" y1="62" x2="50" y2={nockY} stroke="currentColor" strokeWidth="1.5" />
        </svg>

        {/* Small branding tags beside the bow */}
        <div className="absolute top-1/2 left-32 -translate-y-1/2 font-mono text-[8px] tracking-[0.2em] text-slate-500 uppercase flex flex-col gap-0.5 whitespace-nowrap">
          <span className="text-amber-500 font-bold">Kodanda Launcher</span>
          <span>Aim angle: {Math.round(arrowAngle)}°</span>
        </div>
      </div>

      {/* Projectile Arrow wrapper (Starts at bow center and translates to clicked button) - Slightly Larger */}
      <div
        ref={arrowWrapperRef}
        className="absolute bottom-8 left-8 w-28 h-28 flex items-center justify-center pointer-events-none opacity-0"
      >
        {/* Inner rotating arrow to align vector direction along trajectory */}
        <div
          style={{
            transform: `rotate(${arrowAngle}deg)`,
          }}
          className="w-full h-full flex items-center justify-center"
        >
          <svg 
            className="w-12 h-12 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]" 
            viewBox="0 0 100 100"
          >
            {/* Arrow Shaft */}
            <line x1="50" y1="85" x2="50" y2="15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Arrow Head */}
            <path 
              d="M 45,25 L 50,15 L 55,25" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Feather Fletching */}
            <path 
              d="M 46,78 L 50,83 L 54,78 M 46,82 L 50,85 L 54,82" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.2" 
              strokeLinecap="round" 
            />
          </svg>
        </div>
      </div>

      {/* Particle animation classes for high-velocity sparks and shockwaves */}
      <style jsx global>{`
        @keyframes spark-out-1 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-45px, -45px) scale(0); opacity: 0; }
        }
        @keyframes spark-out-2 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(45px, -45px) scale(0); opacity: 0; }
        }
        @keyframes spark-out-3 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(45px, 45px) scale(0); opacity: 0; }
        }
        @keyframes spark-out-4 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-45px, 45px) scale(0); opacity: 0; }
        }
        @keyframes spark-out-5 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(0, -60px) scale(0); opacity: 0; }
        }
        @keyframes spark-out-6 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(60px, 0) scale(0); opacity: 0; }
        }
        @keyframes spark-out-7 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(0, 60px) scale(0); opacity: 0; }
        }
        @keyframes spark-out-8 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-60px, 0) scale(0); opacity: 0; }
        }

        @keyframes shockwave-out {
          0% { transform: scale(0.4); opacity: 1; filter: blur(0px); }
          100% { transform: scale(3.2); opacity: 0; filter: blur(2.5px); }
        }

        @keyframes flash-strike-anim {
          0% { opacity: 0; }
          15% { opacity: 1; }
          100% { opacity: 0; }
        }

        .animate-spark-1 { animation: spark-out-1 0.55s cubic-bezier(0.1, 0.8, 0.3, 1) forwards; }
        .animate-spark-2 { animation: spark-out-2 0.55s cubic-bezier(0.1, 0.8, 0.3, 1) forwards; }
        .animate-spark-3 { animation: spark-out-3 0.55s cubic-bezier(0.1, 0.8, 0.3, 1) forwards; }
        .animate-spark-4 { animation: spark-out-4 0.55s cubic-bezier(0.1, 0.8, 0.3, 1) forwards; }
        .animate-spark-5 { animation: spark-out-5 0.55s cubic-bezier(0.1, 0.8, 0.3, 1) forwards; }
        .animate-spark-6 { animation: spark-out-6 0.55s cubic-bezier(0.1, 0.8, 0.3, 1) forwards; }
        .animate-spark-7 { animation: spark-out-7 0.55s cubic-bezier(0.1, 0.8, 0.3, 1) forwards; }
        .animate-spark-8 { animation: spark-out-8 0.55s cubic-bezier(0.1, 0.8, 0.3, 1) forwards; }

        .animate-impact-shockwave { animation: shockwave-out 0.5s ease-out forwards; }
        .animate-flash-strike { animation: flash-strike-anim 0.35s ease-out forwards; }
      `}</style>
    </div>
  );
}
