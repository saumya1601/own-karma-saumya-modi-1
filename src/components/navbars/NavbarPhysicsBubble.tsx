"use client";

import React, { useEffect, useRef } from "react";
import Matter from "matter-js";
import { Home, Scroll, Gem, Book, Mail } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home, color: "from-amber-300 to-amber-500" },
  { label: "Manifesto", href: "/#manifesto", icon: Scroll, color: "from-white to-slate-200" },
  { label: "Artifacts", href: "#", icon: Gem, color: "from-amber-500 to-amber-700" },
  { label: "Lexicon", href: "#", icon: Book, color: "from-slate-100 to-slate-300" },
  { label: "Contact", href: "#contact", icon: Mail, color: "from-amber-400 to-amber-600" },
];

export default function NavbarPhysicsBubble() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = 280;

    // Create physics engine with no gravity so items float around
    const engine = Engine.create({
      gravity: { y: 0, x: 0 },
    });

    // Create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Wall boundaries (colliders wrapping the container)
    const wallOptions = { isStatic: true };
    const radius = 45; // Bubble radius

    const ground = Bodies.rectangle(containerWidth / 2, containerHeight + 20, containerWidth, 40, wallOptions);
    const ceiling = Bodies.rectangle(containerWidth / 2, -20, containerWidth, 40, wallOptions);
    const leftWall = Bodies.rectangle(-20, containerHeight / 2, 40, containerHeight, wallOptions);
    const rightWall = Bodies.rectangle(containerWidth + 20, containerHeight / 2, 40, containerHeight, wallOptions);

    // Create physics circular bodies
    const physicsBodies = NAV_ITEMS.map((item, index) => {
      // Space them out horizontally initially
      const initialX = (containerWidth / (NAV_ITEMS.length + 1)) * (index + 1);
      const initialY = containerHeight / 2;

      return Bodies.circle(initialX, initialY, radius, {
        restitution: 0.8, // high bounciness
        frictionAir: 0.04, // slight air resistance so they slow down
        friction: 0.1,
      });
    });

    // Add all to the world
    Composite.add(engine.world, [ground, ceiling, leftWall, rightWall, ...physicsBodies]);

    // Setup mouse constraint so they can drag items on the transparent canvas
    const mouse = Mouse.create(canvasRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.15,
        render: { visible: false },
      },
    });

    Composite.add(engine.world, mouseConstraint);

    // Synchronize HTML element positions with Matter.js physics bodies on every update
    Events.on(engine, "afterUpdate", () => {
      physicsBodies.forEach((body, idx) => {
        const element = bubblesRef.current[idx];
        if (element) {
          // Translate the HTML div to match the center position of the physics circle body
          const x = body.position.x - radius;
          const y = body.position.y - radius;
          element.style.transform = `translate3d(${x}px, ${y}px, 0px) rotate(${body.angle}rad)`;
        }
      });
    });

    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const w = containerRef.current.clientWidth;
      
      // Update boundaries on resize
      Matter.Body.setPosition(ground, { x: w / 2, y: containerHeight + 20 });
      Matter.Body.setPosition(ceiling, { x: w / 2, y: -20 });
      Matter.Body.setPosition(rightWall, { x: w + 20, y: containerHeight / 2 });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      Engine.clear(engine);
      Runner.stop(runner);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl h-[280px] bg-slate-950/70 border border-amber-500/20 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl mt-6 select-none"
    >
      {/* Title */}
      <div className="absolute top-4 left-6 z-20 pointer-events-none font-mono text-[10px] text-amber-500/40 uppercase tracking-widest">
        Interact Engine // Grab & Throw Menu Circles
      </div>

      {/* HTML Render layer (Below interactive canvas) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              ref={(el) => {
                bubblesRef.current[index] = el;
              }}
              className="absolute w-[90px] h-[90px] rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 shadow-lg shadow-black/80"
              style={{
                willChange: "transform",
                transform: "translate3d(0px, 0px, 0px)",
              }}
            >
              <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${item.color} flex items-center justify-center text-slate-950 mb-1`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-amber-100/70">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Transparent Interactive Canvas (Above HTML bubbles) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10 cursor-grab active:cursor-grabbing"
        width={896}
        height={280}
      />
    </div>
  );
}
