"use client";

import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Home, Scroll, Book, Mail, Plus, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", icon: Home, offset: -210 },
  { label: "Manifesto", icon: Scroll, offset: -105 },
  { label: "Lexicon", icon: Book, offset: 105 },
  { label: "Contact", icon: Mail, offset: 210 },
];

export default function NavbarLiquidGooey() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Rotate the trigger icon when expanded
  const { rotation } = useSpring({
    rotation: isOpen ? 135 : 0,
    config: { mass: 1, tension: 300, friction: 15 },
  });

  return (
    <div 
      className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center select-none"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* SVG Gooey filter definition */}
      <svg className="absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="liquid-gooey-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Liquid Gooey Morphing Wrapper */}
      <div 
        className="relative flex items-center justify-center h-24 w-[500px]"
        style={{ filter: "url(#liquid-gooey-filter)" }}
      >
        {/* Central Core Bubble (Underlying trigger base) */}
        <div className="absolute w-14 h-14 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]" />

        {/* Budding Child Bubbles */}
        {NAV_ITEMS.map((item, index) => (
          <GooeyChild
            key={item.label}
            label={item.label}
            icon={item.icon}
            offset={item.offset}
            isOpen={isOpen}
            isActive={activeIndex === index}
            onClick={() => setActiveIndex(index)}
          />
        ))}

        {/* Dynamic Trigger Core Button */}
        <animated.button
          onClick={() => setIsOpen(!isOpen)}
          style={{ transform: rotation.to((r) => `rotate(${r}deg)`) }}
          className="absolute z-30 w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg border border-amber-300 cursor-pointer hover:bg-amber-300 transition-colors"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </animated.button>
      </div>

      {/* Helper text below */}
      <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500 mt-2 pointer-events-none">
        {isOpen ? "Fluid Budding Active" : "Hover to Liquid Expand"}
      </span>
    </div>
  );
}

interface GooeyChildProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  offset: number;
  isOpen: boolean;
  isActive: boolean;
  onClick: () => void;
}

function GooeyChild({ label, icon: Icon, offset, isOpen, isActive, onClick }: GooeyChildProps) {
  const [hovered, setHovered] = useState(false);

  // Animate the child bubble budding outward along X axis
  const springProps = useSpring({
    x: isOpen ? offset : 0,
    scale: isOpen ? 1 : 0.4,
    opacity: isOpen ? 1 : 0,
    config: { mass: 1.2, tension: 200, friction: 14 },
  });

  return (
    <animated.a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: springProps.x.to((val) => `translate3d(${val}px, 0, 0)`),
        scale: springProps.scale,
        opacity: springProps.opacity,
      }}
      className={`absolute z-10 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 ${
        isActive
          ? "bg-amber-300 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
          : "bg-amber-500 text-slate-950 hover:bg-amber-400"
      }`}
    >
      <Icon className="w-5 h-5 stroke-[2]" />
      
      {/* Tooltip visible only when expanded and hovered */}
      {hovered && isOpen && (
        <span className="absolute -bottom-8 font-mono text-[8px] uppercase tracking-widest text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-amber-500/25 whitespace-nowrap pointer-events-none">
          {label}
        </span>
      )}
    </animated.a>
  );
}
