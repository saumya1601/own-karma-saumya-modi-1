# Concept 3: Physics-Based Bubble Dock

A playful, interactive physics bubble menu. Menu icons float around inside a canvas under physical rules (gravity, collisions, boundaries). Users can grab, drag, and fling the bubbles.

## Design Aesthetic
* **Organic Motion**: Menu items float like liquid or bubbles, bouncing off boundaries.
* **Interactiveness**: Full mouse-drag interactions where bubbles react to momentum and collisions.

## Library Stack Integration
* **`matter-js`**: For the physical 2D collision engine, gravity vectors, and mouse constraints.
* **`@use-gesture/react`**: To capture drag events and translate them into physical impulses/forces.
* **`framer-motion`**: For expanding the bubble into page layouts when clicked.

## Implementation Example

Create `src/components/NavbarPhysicsBubble.tsx`:

```tsx
"use client";

import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

export default function NavbarPhysicsBubble() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // Matter.js Module aliases
    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;

    // Create engine
    const engine = Engine.create({
      gravity: { y: 0, x: 0 }, // Zero gravity so items float freely
    });

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = 240;

    // Create renderer
    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: containerWidth,
        height: containerHeight,
        background: "transparent",
        wireframes: false,
      },
    });

    Render.run(render);

    // Create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Boundaries (colliders wrapping the container)
    const wallOptions = { isStatic: true, render: { visible: false } };
    const ground = Bodies.rectangle(containerWidth / 2, containerHeight + 20, containerWidth, 40, wallOptions);
    const ceiling = Bodies.rectangle(containerWidth / 2, -20, containerWidth, 40, wallOptions);
    const leftWall = Bodies.rectangle(-20, containerHeight / 2, 40, containerHeight, wallOptions);
    const rightWall = Bodies.rectangle(containerWidth + 20, containerHeight / 2, 40, containerHeight, wallOptions);

    // Bubble nodes (Menu Items)
    const items = [
      { x: containerWidth * 0.25, y: 120, label: "Home", color: "#C6A15B" },
      { x: containerWidth * 0.5, y: 120, label: "Manifesto", color: "#E9CD8B" },
      { x: containerWidth * 0.75, y: 120, label: "Artifacts", color: "#8E8E9A" },
    ];

    const bubbles = items.map((item) => {
      const bubble = Bodies.circle(item.x, item.y, 45, {
        restitution: 0.8, // Bounciness
        frictionAir: 0.05,
        render: {
          fillStyle: item.color,
        },
      });
      // Attach metadata for identification
      (bubble as any).label = item.label;
      return bubble;
    });

    // Add all bodies to the world
    Composite.add(engine.world, [ground, ceiling, leftWall, rightWall, ...bubbles]);

    // Mouse constraint for drag controls
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(engine.world, mouseConstraint);

    // Keep the canvas size responsive
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const w = containerRef.current.clientWidth;
      render.options.width = w;
      canvasRef.current.width = w;
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      Engine.clear(engine);
      Render.stop(render);
      Runner.stop(runner);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[240px] bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden mt-6">
      <div className="absolute top-4 left-6 z-10 pointer-events-none font-mono text-[10px] text-slate-500 uppercase tracking-widest">
        Interact Engine // Grab & Throw Menu Circles
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
```
