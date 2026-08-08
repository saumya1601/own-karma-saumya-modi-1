"use client";

import { MeshReflectorMaterial, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * ACT III — 3D Memories Sub-Components
 *
 * Soft round gold stars, translucent draped silk, reflective water,
 * stone pillars, golden sacred geometry, and SDF 3D text.
 */

// -----------------------------------------------------------------------------
// 1. Soft Round Star & Dust Particle Cloud
// -----------------------------------------------------------------------------
export function DustParticles({ count = 1200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Sharp 4-pointed star texture generated dynamically via canvas
  const starTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const cx = 64;
      const cy = 64;

      // 1. Sharp 4-point star (diamond needle star)
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      const outerR = 56;
      const innerR = 5;
      for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / 4;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      // 2. Central glow core
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.4, "rgba(248, 231, 161, 0.9)");
      grad.addColorStop(1, "rgba(201, 165, 90, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r1 = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      const r2 = Math.sin(i * 39.3461 + 11.135) * 43758.5453;
      const r3 = Math.sin(i * 73.1567 + 54.891) * 43758.5453;
      pos[i * 3] = (r1 - Math.floor(r1) - 0.5) * 16;     // X spread
      pos[i * 3 + 1] = (r2 - Math.floor(r2) - 0.5) * 10; // Y spread
      pos[i * 3 + 2] = 5 - (r3 - Math.floor(r3)) * 110;  // Z spread along corridor
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime() * 0.15;
    pointsRef.current.rotation.z = time * 0.05;
    pointsRef.current.position.y = Math.sin(time) * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        map={starTexture ?? undefined}
        color="#F8E7A1"
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// -----------------------------------------------------------------------------
// 2. Translucent Silk Fabric (Positioned along corridor wall)
// -----------------------------------------------------------------------------
export function FabricMemory({ position = [-5.0, 0.8, -25] }: { position?: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geoRef = useRef<THREE.PlaneGeometry>(null);

  // Generate a tighter radial gradient so the fabric is mostly solid, only fading at the very edges
  const alphaMap = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    // THREE.js alphaMap uses grayscale brightness. White = opaque, Black = transparent.
    gradient.addColorStop(0, "rgb(255, 255, 255)");
    gradient.addColorStop(0.7, "rgb(200, 200, 200)");
    gradient.addColorStop(1, "rgb(0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current || !geoRef.current) return;
    const t = clock.getElapsedTime() * 0.5;
    
    const posAttribute = geoRef.current.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
      const x = posAttribute.getX(i);
      const y = posAttribute.getY(i);
      
      // Deeper rolling waves for thick silk folds
      const z = Math.sin(x * 0.5 + t) * 2.0 + Math.cos(y * 0.4 + t * 0.8) * 1.5;
      posAttribute.setZ(i, z);
    }
    posAttribute.needsUpdate = true;
    geoRef.current.computeVertexNormals();
    
    meshRef.current.position.y = Math.sin(t * 0.2) * 1.0;
    meshRef.current.rotation.y = Math.sin(t * 0.1) * 0.1 + 0.5;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} rotation={[-0.2, 0.4, 0.1]}>
        <planeGeometry ref={geoRef} args={[35, 15, 64, 32]} />
        <meshPhysicalMaterial
          color="#3a2b10"
          emissive="#1f1604"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          sheen={1.0}
          sheenColor={new THREE.Color("#FFF2B2")}
          transparent
          opacity={0.85}
          alphaMap={alphaMap}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Intense directional light to cast high-contrast shadows on the silk folds */}
      <pointLight color="#FFDF73" intensity={8} distance={50} position={[0, 0, 8]} />
    </group>
  );
}

// -----------------------------------------------------------------------------
// 3. Dark Reflective Water Floor
// -----------------------------------------------------------------------------
export function WaterMemory() {
  return (
    <group>
      {/* The Reflective Water Surface */}
      <mesh position={[0, -1.8, -50]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 150]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={1.0}
          mixStrength={3.0}
          roughness={0.6}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#1a1408"
          metalness={0.8}
          mirror={0.8}
        />
      </mesh>
      
      {/* A subtle sacred-geometry grid on the water to make the floor visible in the void */}
      <gridHelper 
        args={[150, 60, "#C9A55A", "#C9A55A"]} 
        position={[0, -1.79, -50]} 
        material-transparent 
        material-opacity={0.15} 
      />
    </group>
  );
}

// -----------------------------------------------------------------------------
// 4. Monolithic Architectural Stone Pillars
// -----------------------------------------------------------------------------
export function StoneMemory() {
  return (
    <group>
      {/* Distant Left Monolith (Jagged Obsidian Shard) */}
      <group position={[-12, -2, -55]} rotation={[0.1, Math.PI / 4, 0.1]}>
        <mesh scale={[1, 2, 1]}>
          <dodecahedronGeometry args={[2, 0]} />
          <meshStandardMaterial 
            color="#050505" 
            roughness={1.0} 
            metalness={0.0} 
            flatShading 
          />
        </mesh>
        <pointLight color="#C9A55A" intensity={15} distance={15} position={[3, 1, 3]} />
      </group>
      
      {/* Distant Right Monolith, deeper in the fog */}
      <group position={[14, -4, -85]} rotation={[-0.1, -Math.PI / 6, -0.1]}>
        <mesh scale={[1, 3, 1]}>
          <icosahedronGeometry args={[2.5, 0]} />
          <meshStandardMaterial 
            color="#020202" 
            roughness={1.0} 
            metalness={0.0} 
            flatShading 
          />
        </mesh>
        <pointLight color="#a3b4c9" intensity={10} distance={20} position={[-4, 2, 4]} />
      </group>
    </group>
  );
}

// -----------------------------------------------------------------------------
// 5. Solid Golden Sacred Geometry
// -----------------------------------------------------------------------------
export function SacredGeometryMemory({ position = [6, 1.5, -70] }: { position?: [number, number, number] }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (outerRef.current) {
      outerRef.current.rotation.x = t * 0.15;
      outerRef.current.rotation.y = t * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.3;
      innerRef.current.rotation.z = t * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* A proper 3D floating object, catching light */}
      <mesh ref={outerRef}>
        <octahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial 
          color="#C9A55A" 
          roughness={0.2} 
          metalness={1.0} 
          flatShading
        />
      </mesh>
      
      {/* Inner glowing core */}
      <mesh ref={innerRef} scale={[0.6, 0.6, 0.6]}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Light emanating from the geometry */}
      <pointLight color="#C9A55A" intensity={15} distance={15} />
    </group>
  );
}

// -----------------------------------------------------------------------------
// 6. Fragments of Handwritten Philosophy
// -----------------------------------------------------------------------------
export function PhilosophyMemory() {
  return (
    <group>
      <Text
        position={[-4, 2, -45]}
        rotation={[0, 0.2, -0.05]}
        fontSize={0.3}
        color="#C9A55A"
        fillOpacity={0.4}
        anchorX="center"
        anchorY="middle"
      >
        Every creation begins in silence...
      </Text>

      <Text
        position={[5, 0, -65]}
        rotation={[0, -0.15, 0.05]}
        fontSize={0.25}
        color="#F4F0E8"
        fillOpacity={0.3}
        anchorX="center"
        anchorY="middle"
      >
        What remains when status disappears?
      </Text>

      <Text
        position={[-3, 3, -90]}
        rotation={[0, 0.1, 0]}
        fontSize={0.35}
        color="#C9A55A"
        fillOpacity={0.3}
        anchorX="center"
        anchorY="middle"
      >
        Everything fades.
      </Text>
    </group>
  );
}

// -----------------------------------------------------------------------------
// 6. SDF 3D Typography Philosophy Fragments
// -----------------------------------------------------------------------------
export interface PhilosophyFragmentProps {
  text: string;
  position: [number, number, number];
}

export function PhilosophyFragment({ text, position }: PhilosophyFragmentProps) {
  return (
    <Text
      position={position}
      fontSize={0.55}
      letterSpacing={0.08}
      color="#F4F0E8"
      font="https://cdn.jsdelivr.net/fontsource/fonts/cormorant-garamond@latest/latin-300-italic.woff"
      anchorX="center"
      anchorY="middle"
    >
      {text}
      <meshBasicMaterial color="#F4F0E8" blending={THREE.AdditiveBlending} transparent opacity={0.9} />
    </Text>
  );
}
