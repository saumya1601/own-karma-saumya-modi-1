"use client";

import React, { useState, useRef } from "react";
import { Home, Scroll, Gem, Book, Mail, Orbit } from "lucide-react";

const NAV_ITEMS = [
  { 
    label: "Home", 
    icon: Home, 
    color: "border-amber-400/50 shadow-amber-500/10", 
    highlightClass: "border-solid border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.25)] bg-amber-500/[0.02]",
    spinDuration: "25s" 
  },
  { 
    label: "Manifesto", 
    icon: Scroll, 
    color: "border-slate-300/50 shadow-slate-400/10", 
    highlightClass: "border-solid border-slate-300/60 shadow-[0_0_20px_rgba(255,255,255,0.2)] bg-white/[0.01]",
    spinDuration: "35s" 
  },
  { 
    label: "Artifacts", 
    icon: Gem, 
    color: "border-amber-500/50 shadow-amber-600/10", 
    highlightClass: "border-solid border-amber-500/60 shadow-[0_0_20px_rgba(217,119,6,0.2)] bg-amber-600/[0.02]",
    spinDuration: "45s" 
  },
  { 
    label: "Lexicon", 
    icon: Book, 
    color: "border-slate-100/50 shadow-slate-200/10", 
    highlightClass: "border-solid border-slate-200/60 shadow-[0_0_20px_rgba(255,255,255,0.25)] bg-white/[0.02]",
    spinDuration: "55s" 
  },
  { 
    label: "Contact", 
    icon: Mail, 
    color: "border-amber-300/50 shadow-amber-400/10", 
    highlightClass: "border-solid border-amber-300/60 shadow-[0_0_20px_rgba(251,191,36,0.2)] bg-amber-400/[0.02]",
    spinDuration: "65s" 
  },
];

export default function NavbarUniverse() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Drag state management using React 19 safe Pointer Events
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragDistance = useRef(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return; // Only drag with left/primary click
    setIsDragging(true);
    dragDistance.current = 0;
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    
    // Accumulate dragging distance
    const dx = newX - position.x;
    const dy = newY - position.y;
    dragDistance.current += Math.sqrt(dx * dx + dy * dy);

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    // Click threshold check: if moved less than 6px total, trigger expansion toggle
    if (dragDistance.current < 6) {
      setIsOpen(!isOpen);
    }
  };

  const isOrbitHighlighted = (index: number) => {
    return (activeIndex === index || hoveredIndex === index) && isOpen;
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none select-none">
      
      {/* 3D Gravitational System Viewport (Translated dynamically on drag) */}
      <div 
        className="relative flex items-center justify-center w-[600px] h-[600px] origin-center transition-shadow"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      >
        
        {/* Concentric Dotted Orbital Rings & Planets */}
        
        {/* Orbit 1: Home */}
        <div
          className={`absolute rounded-full border transition-all duration-700 ease-out ${
            isOpen ? "w-[180px] h-[180px] opacity-100 scale-100" : "w-0 h-0 opacity-0 scale-0"
          } ${
            isOrbitHighlighted(0) 
              ? NAV_ITEMS[0].highlightClass 
              : "border-dashed border-amber-500/10"
          }`}
          style={{
            animation: isOpen ? `spin ${NAV_ITEMS[0].spinDuration} linear infinite` : "none",
            transformOrigin: "center",
          }}
        >
          <PlanetNode
            item={NAV_ITEMS[0]}
            index={0}
            isActive={activeIndex === 0}
            isOpen={isOpen}
            onClick={() => setActiveIndex(0)}
            onMouseEnter={() => setHoveredIndex(0)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        </div>

        {/* Orbit 2: Manifesto */}
        <div
          className={`absolute rounded-full border transition-all duration-700 ease-out delay-75 ${
            isOpen ? "w-[270px] h-[270px] opacity-100 scale-100" : "w-0 h-0 opacity-0 scale-0"
          } ${
            isOrbitHighlighted(1) 
              ? NAV_ITEMS[1].highlightClass 
              : "border-dashed border-amber-500/10"
          }`}
          style={{
            animation: isOpen ? `spin ${NAV_ITEMS[1].spinDuration} linear infinite` : "none",
            transformOrigin: "center",
          }}
        >
          <PlanetNode
            item={NAV_ITEMS[1]}
            index={1}
            isActive={activeIndex === 1}
            isOpen={isOpen}
            onClick={() => setActiveIndex(1)}
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        </div>

        {/* Orbit 3: Artifacts */}
        <div
          className={`absolute rounded-full border transition-all duration-700 ease-out delay-150 ${
            isOpen ? "w-[360px] h-[360px] opacity-100 scale-100" : "w-0 h-0 opacity-0 scale-0"
          } ${
            isOrbitHighlighted(2) 
              ? NAV_ITEMS[2].highlightClass 
              : "border-dashed border-amber-500/10"
          }`}
          style={{
            animation: isOpen ? `spin ${NAV_ITEMS[2].spinDuration} linear infinite` : "none",
            transformOrigin: "center",
          }}
        >
          <PlanetNode
            item={NAV_ITEMS[2]}
            index={2}
            isActive={activeIndex === 2}
            isOpen={isOpen}
            onClick={() => setActiveIndex(2)}
            onMouseEnter={() => setHoveredIndex(2)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        </div>

        {/* Orbit 4: Lexicon */}
        <div
          className={`absolute rounded-full border transition-all duration-700 ease-out delay-220 ${
            isOpen ? "w-[450px] h-[450px] opacity-100 scale-100" : "w-0 h-0 opacity-0 scale-0"
          } ${
            isOrbitHighlighted(3) 
              ? NAV_ITEMS[3].highlightClass 
              : "border-dashed border-amber-500/10"
          }`}
          style={{
            animation: isOpen ? `spin ${NAV_ITEMS[3].spinDuration} linear infinite` : "none",
            transformOrigin: "center",
          }}
        >
          <PlanetNode
            item={NAV_ITEMS[3]}
            index={3}
            isActive={activeIndex === 3}
            isOpen={isOpen}
            onClick={() => setActiveIndex(3)}
            onMouseEnter={() => setHoveredIndex(3)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        </div>

        {/* Orbit 5: Contact */}
        <div
          className={`absolute rounded-full border transition-all duration-700 ease-out delay-300 ${
            isOpen ? "w-[540px] h-[540px] opacity-100 scale-100" : "w-0 h-0 opacity-0 scale-0"
          } ${
            isOrbitHighlighted(4) 
              ? NAV_ITEMS[4].highlightClass 
              : "border-dashed border-amber-500/10"
          }`}
          style={{
            animation: isOpen ? `spin ${NAV_ITEMS[4].spinDuration} linear infinite` : "none",
            transformOrigin: "center",
          }}
        >
          <PlanetNode
            item={NAV_ITEMS[4]}
            index={4}
            isActive={activeIndex === 4}
            isOpen={isOpen}
            onClick={() => setActiveIndex(4)}
            onMouseEnter={() => setHoveredIndex(4)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        </div>

        {/* Central Draggable Solar Core Handle */}
        <button
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`relative z-20 w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex flex-col items-center justify-center cursor-move shadow-[0_0_40px_rgba(245,158,11,0.6)] border border-amber-300 transition-all duration-300 hover:scale-105 active:scale-95 pointer-events-auto select-none touch-none ${
            isOpen ? "bg-amber-300 shadow-[0_0_50px_rgba(245,158,11,0.85)]" : ""
          }`}
        >
          <Orbit className={`w-7 h-7 stroke-[2.5] transition-transform duration-700 ${isOpen ? "animate-pulse" : ""}`} />
          <span className="text-[6px] font-bold font-mono tracking-widest mt-0.5 uppercase">
            {isDragging ? "active" : "drag"}
          </span>
        </button>

        {/* Central Core Aura rings */}
        <div className={`absolute w-20 h-20 rounded-full border border-amber-500/10 animate-ping pointer-events-none duration-[2000ms] ${isOpen ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute w-24 h-24 rounded-full border border-amber-500/5 animate-pulse pointer-events-none ${isOpen ? "opacity-100" : "opacity-0"}`} />
      </div>

      {/* Orbit keyframe animation helper inline style */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

    </div>
  );
}

interface PlanetNodeProps {
  item: typeof NAV_ITEMS[number];
  index: number;
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function PlanetNode({ item, index, isActive, isOpen, onClick, onMouseEnter, onMouseLeave }: PlanetNodeProps) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  const handleMouseEnter = () => {
    setHovered(true);
    onMouseEnter();
  };

  const handleMouseLeave = () => {
    setHovered(false);
    onMouseLeave();
  };

  return (
    <div 
      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        // Counteract the parent spin so icons stay vertically upright!
        animation: isOpen ? `spin ${item.spinDuration} linear infinite reverse` : "none",
        transformOrigin: "center",
      }}
    >
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className={`w-11 h-11 rounded-full flex items-center justify-center border-2 cursor-pointer shadow-lg transition-all duration-300 relative ${
          isActive
            ? "bg-amber-400 border-amber-300 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.6)]"
            : `bg-slate-950 text-slate-400 hover:text-amber-100 hover:scale-110 hover:border-amber-400/80 ${item.color}`
        }`}
      >
        <Icon className="w-5 h-5 stroke-[2]" />
        
        {/* Floating tooltip indicating section name */}
        {(hovered || isActive) && (
          <span className="absolute -bottom-8 font-mono text-[8px] uppercase tracking-widest text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-amber-500/25 whitespace-nowrap shadow-md pointer-events-none">
            {item.label}
          </span>
        )}
      </a>
    </div>
  );
}
