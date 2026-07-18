# Concept 1: Floating 3D Parallax Dock

A glassmorphic, floating navigation bar that tilts in 3D space in response to cursor moves, featuring spring-based hover states and a sliding indicator.

## Design Aesthetic
* **Glassmorphism**: Backdrop blur with a semi-transparent dark slate backdrop and thin gold border.
* **Cursor Tilt**: The entire container tilts as the cursor moves over it, creating a physical 3D card effect.
* **Sliding Gold Indicator**: A soft gold capsule sits behind the active link, gliding smoothly on click.

## Library Stack Integration
* **`react-parallax-tilt`**: For the responsive mouse-tilt effect.
* **`gsap`**: To animate the sliding background indicator.
* **`@react-spring/web`**: For smooth, physics-based scaling of individual menu icons/text.

## Implementation Example

Create `src/components/NavbarParallaxDock.tsx`:

```tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Tilt from "react-parallax-tilt";
import { useSpring, animated } from "@react-spring/web";
import gsap from "gsap";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Manifesto", href: "/#manifesto" },
  { label: "Artifacts", href: "#" },
  { label: "Lexicon", href: "#" },
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
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
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
}

const DockItem = React.forwardRef<HTMLAnchorElement, DockItemProps>(
  ({ label, href, isActive, onClick }, ref) => {
    const [hovered, setHovered] = useState(false);

    // Spring scaling for elastic hover feel
    const { scale } = useSpring({
      scale: hovered ? 1.08 : 1,
      config: { mass: 1, tension: 350, friction: 15 },
    });

    return (
      <animated.a
        ref={ref}
        href={href}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ scale }}
        className={`relative z-10 px-5 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-300 rounded-full ${
          isActive ? "text-amber-200" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        {label}
      </animated.a>
    );
  }
);

DockItem.displayName = "DockItem";
```
