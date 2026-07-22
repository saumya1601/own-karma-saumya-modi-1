"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

export default function GlobalStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isReduced = useReducedMotion();
  const isReducedRef = useRef(isReduced);
  isReducedRef.current = isReduced;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const sizeToViewport = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    };

    let { w: width, h: height } = sizeToViewport();

    interface IParticle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      phase: number;
      twinkleSpeed: number;
      color: string;
      angle: number;
      radius: number;
      speed: number;
      arm: number;
      update: () => void;
      draw: () => void;
    }

    const particles: IParticle[] = [];
    // Tighter spacing and larger count to increase star density (quantity)
    const particleCount = Math.min(520, Math.floor((width * height) / 3800));

    const mouse = { x: -1000, y: -1000, radius: 150 };

    class Particle implements IParticle {
      x: number = 0;
      y: number = 0;
      size: number;
      vx: number = 0;
      vy: number = 0;
      alpha: number = 0;
      phase: number;
      twinkleSpeed: number;
      color: string;
      angle: number;
      radius: number;
      speed: number;
      arm: number = 0;

      constructor() {
        // Wider size variety to support deep space backdrop layers
        this.size = Math.random() * 1.6 + 0.35;
        this.x = Math.random() * width;
        this.y = Math.random() * height;

        this.speed = Math.random() * 0.16 + 0.04;
        this.angle = Math.random() * Math.PI * 2;

        this.radius = 0;
        this.arm = 0;

        // Oscillating sine phase for perfect smooth twinkling transitions (no linear sharp bounce)
        this.phase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.015 + 0.005;

        const colorRand = Math.random();
        this.color = colorRand < 0.72
          ? "201, 162, 75" // gold
          : colorRand < 0.94
            ? "231, 199, 122" // gold-hi
            : "237, 230, 211"; // rare ivory star
      }

      update() {
        const speedScale = isReducedRef.current ? 0.2 : 1;

        this.x += Math.cos(this.angle) * this.speed * speedScale;
        this.y += Math.sin(this.angle) * this.speed * speedScale;

        // Wrap around viewport edges
        if (this.x < -10) this.x = width + 10;
        else if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        else if (this.y > height + 10) this.y = -10;

        // Mouse magnetic push interaction (using client viewport coords)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= (dx / distance) * force * 2.5;
          this.y -= (dy / distance) * force * 2.5;
        }

        // Increment sine phase and calculate opacity
        this.phase += this.twinkleSpeed * speedScale;
        this.alpha = Math.sin(this.phase) * 0.35 + 0.5; // range: 0.15 - 0.85
      }

      draw() {
        if (!ctx) return;
        const currentAlpha = Math.max(0.01, this.alpha);

        // High fidelity star rendering: radial glow halo for medium/large stars
        if (this.size > 0.9) {
          const glowRadius = this.size * 3.2;
          const grad = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, glowRadius
          );
          grad.addColorStop(0, `rgba(${this.color}, ${currentAlpha * 0.95})`);
          grad.addColorStop(0.2, `rgba(${this.color}, ${currentAlpha * 0.35})`);
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.beginPath();
          ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Core star shape
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${currentAlpha})`;
        ctx.fill();

        // Premium cross flare overlay for major stars
        if (this.size > 1.35) {
          ctx.strokeStyle = `rgba(${this.color}, ${currentAlpha * 0.22})`;
          ctx.lineWidth = 0.5;

          // Horizontal line
          ctx.beginPath();
          ctx.moveTo(this.x - this.size * 3.5, this.y);
          ctx.lineTo(this.x + this.size * 3.5, this.y);
          ctx.stroke();

          // Vertical line
          ctx.beginPath();
          ctx.moveTo(this.x, this.y - this.size * 3.5);
          ctx.lineTo(this.x, this.y + this.size * 3.5);
          ctx.stroke();
        }
      }
    }

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      const { w, h } = sizeToViewport();
      width = w;
      height = h;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    init();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.shadowBlur = 0;
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20 h-full w-full opacity-90"
    />
  );
}
