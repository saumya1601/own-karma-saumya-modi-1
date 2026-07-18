"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Lenis from "lenis";
import gsap from "gsap";

const SECTIONS = [
  { id: "home", label: "Home", angle: 0 },
  { id: "manifesto", label: "Manifesto", angle: (Math.PI * 2) / 5 },
  { id: "artifacts", label: "Artifacts", angle: ((Math.PI * 2) / 5) * 2 },
  { id: "lexicon", label: "Lexicon", angle: ((Math.PI * 2) / 5) * 3 },
  { id: "contact", label: "Contact", angle: ((Math.PI * 2) / 5) * 4 },
];

// Tick marks for outer ring (Astrolabe scale)
const TICK_COUNT = 36;
const ticks = Array.from({ length: TICK_COUNT }).map((_, i) => {
  const angle = (i / TICK_COUNT) * Math.PI * 2;
  const isMajor = i % 6 === 0;
  return {
    angle,
    length: isMajor ? 0.15 : 0.08,
    thickness: isMajor ? 0.03 : 0.015,
  };
});

// Particle stars array
const particleStars = Array.from({ length: 45 }).map(() => ({
  pos: [
    (Math.random() - 0.5) * 7,
    (Math.random() - 0.5) * 7,
    (Math.random() - 0.5) * 7,
  ] as [number, number, number],
  size: Math.random() * 0.02 + 0.01,
  speed: Math.random() * 0.02 + 0.005,
}));

function AstrolabeModel({ scrollProgress }: { scrollProgress: number }) {
  const outerRingRef = useRef<THREE.Group>(null);
  const midRingRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const starsRef = useRef<THREE.Group>(null);

  // Slow ambient rotation + scroll sync
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    // Constant slow float
    if (outerRingRef.current) outerRingRef.current.rotation.y = elapsed * 0.05;
    if (midRingRef.current) midRingRef.current.rotation.x = elapsed * 0.08;
    if (innerRingRef.current) innerRingRef.current.rotation.y = -elapsed * 0.1;

    // Star drift
    if (starsRef.current) {
      starsRef.current.rotation.z = elapsed * 0.02;
    }
  });

  // Apply smooth rotations based on scrollProgress
  useEffect(() => {
    if (
      outerRingRef.current &&
      midRingRef.current &&
      innerRingRef.current &&
      coreRef.current
    ) {
      // Rotate nested gyroscope rings in alternate directions based on scroll
      gsap.to(outerRingRef.current.rotation, {
        z: scrollProgress * Math.PI * 2,
        duration: 0.8,
        ease: "power2.out",
      });
      gsap.to(midRingRef.current.rotation, {
        z: -scrollProgress * Math.PI * 3,
        duration: 0.8,
        ease: "power2.out",
      });
      gsap.to(innerRingRef.current.rotation, {
        z: scrollProgress * Math.PI * 4,
        duration: 0.8,
        ease: "power2.out",
      });
      gsap.to(coreRef.current.scale, {
        x: 1 + scrollProgress * 0.25,
        y: 1 + scrollProgress * 0.25,
        z: 1 + scrollProgress * 0.25,
        duration: 0.4,
        ease: "back.out(2)",
      });
    }
  }, [scrollProgress]);

  return (
    <group rotation={[Math.PI / 5, Math.PI / 8, 0]}>
      {/* Floating Dust / Stars Background */}
      <group ref={starsRef}>
        {particleStars.map((star, i) => (
          <mesh key={i} position={star.pos}>
            <boxGeometry args={[star.size, star.size, star.size]} />
            <meshBasicMaterial color="#E9CD8B" transparent opacity={0.4} />
          </mesh>
        ))}
      </group>

      {/* Ring 1: Outer Astrolabe Dial - Bright Gold */}
      <group ref={outerRingRef}>
        <mesh>
          <torusGeometry args={[2, 0.06, 16, 100]} />
          <meshStandardMaterial
            color="#ffd700"
            metalness={1.0}
            roughness={0.15}
            envMapIntensity={2}
          />
        </mesh>
        {/* Dial Scale Tick Marks */}
        {ticks.map((tick, idx) => {
          const x = Math.cos(tick.angle) * 2;
          const y = Math.sin(tick.angle) * 2;
          return (
            <mesh
              key={idx}
              position={[x, y, 0]}
              rotation={[0, 0, tick.angle]}
            >
              <boxGeometry args={[tick.thickness, tick.length, 0.06]} />
              <meshStandardMaterial
                color="#e5c158"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          );
        })}
      </group>

      {/* Ring 2: Medium Gyroscope Ring - Tilted Antique Bronze */}
      <group ref={midRingRef} rotation={[Math.PI / 4, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.65, 0.04, 16, 100]} />
          <meshStandardMaterial
            color="#C6A15B"
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
        {/* Diagonal Cross bars for astrolabe retic look */}
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[3.2, 0.02, 0.02]} />
          <meshStandardMaterial color="#C6A15B" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[3.2, 0.02, 0.02]} />
          <meshStandardMaterial color="#C6A15B" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Ring 3: Inner Constellation Path Ring - Copper */}
      <group ref={innerRingRef} rotation={[0, Math.PI / 4, 0]}>
        <mesh>
          <torusGeometry args={[1.3, 0.03, 16, 100]} />
          <meshStandardMaterial
            color="#b87333"
            metalness={0.98}
            roughness={0.08}
          />
        </mesh>
        {/* Orbital nodes tracking the inner circle */}
        {SECTIONS.map((sec, idx) => {
          const x = Math.cos(sec.angle) * 1.3;
          const y = Math.sin(sec.angle) * 1.3;
          return (
            <group key={sec.id} position={[x, y, 0]}>
              <mesh>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial
                  color="#ffd700"
                  emissive="#ffd700"
                  emissiveIntensity={0.6}
                />
              </mesh>
              {/* Outer ring for target markers */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.15, 0.015, 8, 32]} />
                <meshBasicMaterial color="#C6A15B" />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Glowing Star Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial
          color="#EDE7D8"
          emissive="#ffbb44"
          emissiveIntensity={1.2}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

export default function NavbarCelestialWheel() {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    setMounted(true);
    const lenis = new Lenis();

    const handleScroll = (e: any) => {
      const progress = e.progress || 0;
      setScrollProgress(progress);

      const sectionCount = SECTIONS.length;
      const index = Math.min(
        Math.floor(progress * sectionCount),
        sectionCount - 1
      );
      setActiveSection(SECTIONS[index].id);
    };

    lenis.on("scroll", handleScroll);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const idx = SECTIONS.findIndex((s) => s.id === id);
    if (idx !== -1) {
      const targetProgress = idx / (SECTIONS.length - 1);
      gsap.to({ val: scrollProgress }, {
        val: targetProgress,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: function () {
          setScrollProgress(this.targets()[0].val);
        },
      });
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* 3D HUD Viewport (Top Right) - Expanded to w-72 h-72 */}
      <div className="absolute top-6 right-6 w-72 h-72 z-50 border border-amber-500/20 rounded-full bg-slate-950/80 backdrop-blur-md shadow-2xl shadow-black/80 overflow-hidden">
        <Canvas camera={{ position: [0, 0, 4.8], fov: 60 }} gl={{ antialias: true }}>
          {/* Ambient Lighting */}
          <ambientLight intensity={0.4} />
          
          {/* Cinematic Three-Point Lighting for Metallic Reflections */}
          <pointLight position={[10, 10, 10]} intensity={3.5} color="#fff1cc" />
          <pointLight position={[-10, -10, 10]} intensity={2.0} color="#66ccff" />
          <pointLight position={[0, 0, -10]} intensity={1.5} color="#ffaa66" />
          
          <AstrolabeModel scrollProgress={scrollProgress} />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* Astrolabe Section HUD Pointers List - Positioned to the left of the expanded circle */}
      <div className="absolute top-16 right-[336px] z-50 flex flex-col items-end gap-5 font-mono">
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            className={`text-base tracking-[0.25em] uppercase transition-all duration-300 border-b pb-1 cursor-pointer flex items-center gap-2.5 ${
              activeSection === sec.id
                ? "text-amber-300 border-amber-400/80 font-bold translate-x-[-16px]"
                : "text-slate-500 border-transparent hover:text-slate-300"
            }`}
          >
            {activeSection === sec.id && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
            {sec.label}
          </button>
        ))}
        
        {/* Expanded Tech Specs footer */}
        <div className="text-[10px] text-amber-500/40 uppercase tracking-[0.3em] mt-6 flex flex-col items-end gap-1.5 border-t border-amber-500/10 pt-4 w-full">
          <div>ASTRO_SYS // V_01</div>
          <div>ROTATION // {(scrollProgress * 360).toFixed(0)}°</div>
        </div>
      </div>
    </>
  );
}
