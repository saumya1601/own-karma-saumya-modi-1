"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

interface LoadingKarmaWheelProps {
  onComplete?: () => void;
}

export default function LoadingKarmaWheel({ onComplete }: LoadingKarmaWheelProps) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Reference array for the 12 wedge panels
  const wedgeRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 12 spokes points calculation helper
  const totalSpokes = 12;
  const radius = 75;
  const cx = 100;
  const cy = 100;

  const spokeEnds = Array.from({ length: totalSpokes }).map((_, i) => {
    const angleRad = ((i * 30 - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(angleRad),
      y: cy + radius * Math.sin(angleRad),
    };
  });

  // Calculate sacred geometry inner lines
  const innerLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < totalSpokes; i++) {
    const targetIdx = (i + 4) % totalSpokes;
    if (i < targetIdx || (i >= 8 && targetIdx < 4)) {
      innerLines.push({
        x1: spokeEnds[i].x,
        y1: spokeEnds[i].y,
        x2: spokeEnds[targetIdx].x,
        y2: spokeEnds[targetIdx].y,
      });
    }
  }

  // Simulate progress loading sequence smoothly via GSAP 60fps ticker
  useEffect(() => {
    const progressVal = { value: 0 };
    
    const tween = gsap.to(progressVal, {
      value: 100,
      duration: 12.0,
      ease: "power2.out",
      onUpdate: () => {
        setProgress(progressVal.value);
      },
      onComplete: () => {
        setIsLoaded(true);
      }
    });

    return () => {
      tween.kill();
    };
  }, []);

  // Handle entry transition: switch to split wedges and shatter them outward
  const handleEnterClick = () => {
    setIsExiting(true);
    
    setTimeout(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });

      // Animate each of the 12 wedges outward along its bisector angle with a slight stagger
      wedgeRefs.current.forEach((el, idx) => {
        if (!el) return;
        // Bisector angle of wedge idx is in the middle of idx * 30 and (idx + 1) * 30
        const angleRad = ((idx * 30 + 15 - 90) * Math.PI) / 180;
        const dx = Math.cos(angleRad);
        const dy = Math.sin(angleRad);
        
        // Shatter distance - projected outward diagonally
        const distance = 450;

        tl.to(el, {
          x: dx * distance,
          y: dy * distance,
          opacity: 0,
          duration: 1.8,
          ease: "power3.out",
        }, idx * 0.035); // 35ms stagger for organic fracture ripple
      });
    }, 16);
  };

  // Fade in Enter Button once loading hits 100%
  useEffect(() => {
    if (isLoaded) {
      gsap.timeline()
        .to(subtitleRef.current, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          ease: "power2.in",
        })
        .fromTo(buttonRef.current, 
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );
    }
  }, [isLoaded]);

  // Segment-by-segment synchronized draw calculations
  const getSpokeOffset = (i: number) => {
    const startProgress = i * (100 / 12);
    const midProgress = startProgress + (100 / 12) * 0.5;
    
    if (progress <= startProgress) return 75;
    if (progress >= midProgress) return 0;
    
    const ratio = (progress - startProgress) / (midProgress - startProgress);
    return 75 * (1 - ratio);
  };

  const getArcOffset = (i: number) => {
    const midProgress = i * (100 / 12) + (100 / 12) * 0.5;
    const endProgress = (i + 1) * (100 / 12);
    
    if (progress <= midProgress) return 40;
    if (progress >= endProgress) return 0;
    
    const ratio = (progress - midProgress) / (endProgress - midProgress);
    return 40 * (1 - ratio);
  };

  const getArcD = (i: number) => {
    const angleA = ((i * 30 - 90) * Math.PI) / 180;
    const angleB = (((i + 1) * 30 - 90) * Math.PI) / 180;
    
    const startX = cx + radius * Math.cos(angleA);
    const startY = cy + radius * Math.sin(angleA);
    const endX = cx + radius * Math.cos(angleB);
    const endY = cy + radius * Math.sin(angleB);
    
    return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
  };

  const innerGeometryOpacity = progress > 50 ? Math.min(0.25, (progress - 50) / 50 * 0.25) : 0;

  // Unified SVG and Typography Node
  const renderContent = () => (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Mandala Wheel - Centered exactly in the viewport */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <defs>
            <filter id="gold-filament-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Inner Sacred Geometry Triangles */}
          <g style={{ opacity: innerGeometryOpacity, transition: "opacity 0.2s ease" }}>
            {innerLines.map((line, idx) => (
              <line
                key={idx}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="#F59E0B"
                strokeWidth="0.5"
                opacity="0.6"
              />
            ))}
          </g>

          {/* Radial Spokes */}
          {spokeEnds.map((end, idx) => {
            const offset = getSpokeOffset(idx);
            return (
              <line
                key={`spoke-${idx}`}
                x1={cx}
                y1={cy}
                x2={end.x}
                y2={end.y}
                stroke="#D4AF37"
                strokeWidth="1.2"
                strokeDasharray="75"
                strokeDashoffset={offset}
                className="drop-shadow-[0_0_2px_rgba(212,175,55,0.4)]"
              />
            );
          })}

          {/* Central Pulsing Dot */}
          <circle 
            cx={cx} 
            cy={cy} 
            r="3" 
            fill="#D4AF37" 
            className="animate-pulse drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]"
          />

          {/* Circular Progress Arc */}
          {Array.from({ length: totalSpokes }).map((_, idx) => {
            const offset = getArcOffset(idx);
            return (
              <path
                key={`arc-${idx}`}
                d={getArcD(idx)}
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.8"
                strokeDasharray="40"
                strokeDashoffset={offset}
                filter="url(#gold-filament-glow)"
              />
            );
          })}
        </svg>
      </div>

      {/* Brand & Loading Info text - Positioned absolutely at the bottom to prevent shifting the wheel center */}
      <div ref={textRef} className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-center select-none">
        <h1 className="text-xl md:text-2xl font-light tracking-[0.4em] text-slate-200 uppercase font-sans">
          OWN KARMA
        </h1>
        
        {/* Subtitle counter changing to CTA button at 100% */}
        <div className="h-12 mt-3 flex items-center justify-center overflow-visible">
          {!isLoaded ? (
            <div 
              ref={subtitleRef} 
              className="text-[9px] font-mono tracking-[0.25em] text-slate-400/90 uppercase flex items-center gap-2"
            >
              <span>Assembling Geometry</span>
              <span className="text-amber-400 font-bold w-12 text-left">{Math.round(progress)}%</span>
            </div>
          ) : (
            <button
              ref={buttonRef}
              onClick={handleEnterClick}
              disabled={isExiting}
              className="px-6 py-2 bg-transparent border border-amber-400 text-amber-300 text-[10px] font-mono uppercase tracking-[0.25em] rounded-full hover:bg-amber-400 hover:text-slate-950 transition-all duration-500 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto"
            >
              Enter The Universe
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // If not exiting, render as a single unified container to ensure 100% perfect alignment
  if (!isExiting) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-950 pointer-events-auto overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />
        {renderContent()}
      </div>
    );
  }

  // Once exiting is triggered, switch to the 12 wedge pie panels to shatter them apart
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none select-none">
      {Array.from({ length: 12 }).map((_, idx) => {
        // Compute the polygon coordinates representing this specific 30° pie slice of the viewport
        const startAngle = ((idx * 30 - 90) * Math.PI) / 180;
        const endAngle = (((idx + 1) * 30 - 90) * Math.PI) / 180;
        
        // Project outer points far past screen borders (300%) to prevent clipping
        const x1 = 50 + 300 * Math.cos(startAngle);
        const y1 = 50 + 300 * Math.sin(startAngle);
        const x2 = 50 + 300 * Math.cos(endAngle);
        const y2 = 50 + 300 * Math.sin(endAngle);
        
        const clipPathString = `polygon(50% 50%, ${x1}% ${y1}%, ${x2}% ${y2}%)`;

        return (
          <div
            key={idx}
            ref={(el) => {
              wedgeRefs.current[idx] = el;
            }}
            style={{ clipPath: clipPathString }}
            className="absolute inset-0 bg-slate-950 overflow-hidden pointer-events-auto"
          >
            {/* The wedge contains a duplicate of the full screen, clipped, so it looks unified */}
            <div className="absolute inset-0 w-screen h-screen">
              {renderContent()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
