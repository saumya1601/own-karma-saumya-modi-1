"use client";

import React, { useRef, useState, useEffect } from "react";
import Tilt from "react-parallax-tilt";
import { useSpring, animated } from "@react-spring/web";
import gsap from "gsap";
import { Home, Scroll, Gem, Book, Mail } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Manifesto", href: "/#manifesto", icon: Scroll },
  { label: "Artifacts", href: "#", icon: Gem },
  { label: "Lexicon", href: "#", icon: Book },
  { label: "Contact", href: "#contact", icon: Mail },
];

export default function NavbarParallaxDock() {
  const [activeIndex, setActiveIndex] = useState(0);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // Animate the active indicator background capsule using GSAP
  useEffect(() => {
    const activeItem = itemsRef.current[activeIndex];
    if (activeItem && indicatorRef.current) {
      gsap.to(indicatorRef.current, {
        x: activeItem.offsetLeft,
        width: activeItem.offsetWidth,
        duration: 0.45,
        ease: "power2.out",
      });
    }
  }, [activeIndex]);

  return (
    <div className="relative z-10 py-4 flex justify-center">
      <Tilt
        perspective={800}
        glareEnable={true}
        glareMaxOpacity={0.15}
        glareColor="#E9CD8B"
        scale={1.02}
        className="rounded-full bg-slate-950/70 border border-amber-500/20 shadow-xl shadow-black/60 backdrop-blur-md p-2.5 flex items-center gap-1.5 cursor-pointer transition-colors hover:border-amber-500/45"
      >
        <div className="relative flex items-center gap-1">
          {/* Active Sliding Indicator */}
          <div
            ref={indicatorRef}
            className="absolute top-0 bottom-0 rounded-full bg-amber-500/10 border border-amber-500/30"
            style={{ pointerEvents: "none" }}
          />

          {NAV_ITEMS.map((item, index) => (
            <DockItem
              key={item.label}
              label={item.label}
              href={item.href}
              index={index}
              icon={item.icon}
              isActive={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
            />
          ))}
        </div>
      </Tilt>
    </div>
  );
}

interface DockItemProps {
  label: string;
  href: string;
  index: number;
  isActive: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
}

const DockItem = React.forwardRef<HTMLAnchorElement, DockItemProps>(
  ({ label, href, isActive, onClick, icon: Icon }, ref) => {
    const [hovered, setHovered] = useState(false);

    // Spring scaling for elastic hover feel
    const { scale } = useSpring({
      scale: hovered ? 1.08 : 1,
      config: { mass: 1, tension: 350, friction: 15 },
    });

    return (
      <animated.a
        ref={ref}
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ scale }}
        className={`relative z-10 px-4 py-2.5 text-sm font-medium tracking-wide uppercase transition-colors duration-300 rounded-full flex items-center gap-2 ${
          isActive ? "text-amber-200" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <Icon className="w-4.5 h-4.5" />
        <span className="hidden sm:inline">{label}</span>
      </animated.a>
    );
  }
);

DockItem.displayName = "DockItem";
