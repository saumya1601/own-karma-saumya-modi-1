# Concept 4: Celestial Wheel / Astrolabe (3D)

A fully 3D interactive menu styled like a celestial map or mechanical astrolabe. The wheel is integrated into a Three.js Canvas and rotates dynamically in response to scroll positions, highlighting symbols for each active chapter.

## Design Aesthetic
* **Sacred Geometrical**: Concentric rings rotating in contrary directions.
* **3D Depth**: Realistic metal textures (brass/gold) catch ambient lights.
* **Scroll-Locked Rotation**: Scrolling down the page drives the wheel's rotation.

## Library Stack Integration
* **`three` & `@react-three/fiber`**: To render the 3D Canvas, geometries, and lighting.
* **`@react-three/drei`**: Loaded via `<OrbitControls />` and `<Center />` to structure camera paths.
* **`lenis`**: Captures smooth mouse scrolls to map directly to model coordinates.
* **`gsap`**: To interpolate the rotation smoothly between sections.

## Implementation Example

Create `src/components/NavbarCelestialWheel.tsx`:

```tsx
"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Center, Ring } from "@react-three/drei";
import * as THREE from "three";
import Lenis from "lenis";
import gsap from "gsap";

function AstrolabeModel() {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  // Bind smooth scroll tracking
  useEffect(() => {
    const lenis = new Lenis();

    const handleScroll = (e: any) => {
      const progress = e.progress; // value between 0 and 1
      
      // Animate rotation based on scroll progress
      if (outerRingRef.current && innerRingRef.current) {
        gsap.to(outerRingRef.current.rotation, {
          z: progress * Math.PI * 2,
          duration: 0.8,
          ease: "power1.out",
        });
        gsap.to(innerRingRef.current.rotation, {
          z: -progress * Math.PI * 4, // contrary rotation
          duration: 0.8,
          ease: "power1.out",
        });
      }
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

  return (
    <group rotation={[Math.PI / 4, Math.PI / 6, 0]}>
      {/* Outer Astrolabe Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[2, 0.08, 16, 100]} />
        <meshStandardMaterial color="#C6A15B" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Inner Astrolabe Ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.5, 0.06, 16, 100]} />
        <meshStandardMaterial color="#E9CD8B" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Center Core Node */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#EDE7D8" emissive="#C6A15B" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

export default function NavbarCelestialWheel() {
  return (
    <div className="fixed top-6 right-6 w-36 h-36 z-50 border border-amber-500/10 rounded-full bg-slate-950/40 backdrop-blur-sm shadow-2xl">
      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
        <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-amber-500/40 mt-16">
          WHEEL // ROTATE
        </span>
      </div>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <AstrolabeModel />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
```
