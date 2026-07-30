"use client";

import { MeshReflectorMaterial, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/**
 * ACT IV — Spatial Theater Rooms (Pure Obsidian Reflective Water Mirror Edition)
 *
 * All text fragments and 3D design objects removed as requested.
 * Retains pure obsidian dark reflective water floor and golden light ambience.
 */

/** Helper: smooth interpolation curve (0 -> 1 -> 0) for room cross-fading */
function calculateRoomOpacity(offset: number, start: number, fadeInEnd: number, fadeOutStart: number, end: number): number {
  if (offset < start || offset > end) return 0;
  if (offset >= fadeInEnd && offset <= fadeOutStart) return 1;
  if (offset < fadeInEnd) return (offset - start) / (fadeInEnd - start);
  return (end - offset) / (end - fadeOutStart);
}

// -----------------------------------------------------------------------------
// 1. ROOM ONE — Silence (Obsidian Reflective Water Mirror)
// -----------------------------------------------------------------------------
export function RoomSilence() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const rippleRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const offset = scroll.offset; // 0 -> 1

    const opacity = calculateRoomOpacity(offset, 0, 0, 0.16, 0.23);
    groupRef.current.visible = opacity > 0.005;
    groupRef.current.position.y = (1 - opacity) * 0.4;

    const t = clock.getElapsedTime();
    if (rippleRef.current) {
      const mat = rippleRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = (Math.sin(t * 1.5) * 0.25 + 0.35) * opacity;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Obsidian Reflective Floor */}
      <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={0.8}
          mixStrength={1.5}
          roughness={0.15}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.85}
          mirror={0.6}
        />
      </mesh>

      {/* Subtle Gold Ripple Ring on Water Surface */}
      <mesh ref={rippleRef} position={[0, -2.78, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 1.2, 64]} />
        <meshBasicMaterial color="#C9A55A" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      <pointLight color="#C9A55A" intensity={2.5} distance={10} position={[0, 1, 2]} />
    </group>
  );
}

// -----------------------------------------------------------------------------
// 2. ROOM TWO — Time
// -----------------------------------------------------------------------------
export function RoomTime() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const offset = scroll.offset;

    const opacity = calculateRoomOpacity(offset, 0.25, 0.28, 0.43, 0.48);
    groupRef.current.visible = opacity > 0.005;
    groupRef.current.position.y = (1 - opacity) * (offset < 0.35 ? -0.4 : 0.4);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Obsidian Reflective Floor */}
      <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={0.8}
          mixStrength={1.5}
          roughness={0.15}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.85}
          mirror={0.6}
        />
      </mesh>

      <pointLight color="#C9A55A" intensity={3.0} distance={10} position={[0, 1, 2]} />
    </group>
  );
}

// -----------------------------------------------------------------------------
// 3. ROOM THREE — Purpose
// -----------------------------------------------------------------------------
export function RoomPurpose() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const offset = scroll.offset;

    const opacity = calculateRoomOpacity(offset, 0.50, 0.53, 0.68, 0.73);
    groupRef.current.visible = opacity > 0.005;
    groupRef.current.position.y = (1 - opacity) * (offset < 0.60 ? -0.4 : 0.4);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Obsidian Reflective Floor */}
      <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={0.8}
          mixStrength={1.5}
          roughness={0.15}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.85}
          mirror={0.6}
        />
      </mesh>

      <pointLight color="#C9A55A" intensity={3.0} distance={10} position={[0, 1, 2]} />
    </group>
  );
}

// -----------------------------------------------------------------------------
// 4. ROOM FOUR — Legacy (Resolving to "The Single Ember")
// -----------------------------------------------------------------------------
export function RoomLegacy({ onComplete }: { onComplete?: () => void }) {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const singleEmberRef = useRef<THREE.Mesh>(null);
  const handoffRef = useRef(false);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const offset = scroll.offset;

    const opacity = calculateRoomOpacity(offset, 0.75, 0.78, 1.0, 1.0);
    groupRef.current.visible = opacity > 0.005;

    const isEmberPhase = offset >= 0.95;

    const t = clock.getElapsedTime();
    if (singleEmberRef.current) {
      singleEmberRef.current.scale.setScalar(1.0 + Math.sin(t * 3) * 0.15);
      singleEmberRef.current.visible = isEmberPhase;
    }

    // Trigger Single Ember handoff callback
    if (offset >= 0.98 && !handoffRef.current) {
      handoffRef.current = true;
      setTimeout(() => {
        onComplete?.();
      }, 1500);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Obsidian Reflective Floor */}
      <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={0.8}
          mixStrength={1.5}
          roughness={0.15}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.85}
          mirror={0.6}
        />
      </mesh>

      {/* THE SINGLE EMBER — Dead center in pure black WebGL void */}
      <mesh ref={singleEmberRef} position={[0, 0, 0]} visible={false}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#E8C87A" blending={THREE.AdditiveBlending} />
        <pointLight color="#C9A55A" intensity={3.5} distance={6} />
      </mesh>

      <pointLight color="#C9A55A" intensity={2.5} distance={10} position={[0, 1, 2]} />
    </group>
  );
}
