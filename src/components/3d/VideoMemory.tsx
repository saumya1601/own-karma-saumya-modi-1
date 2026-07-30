"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export interface VideoMemoryProps {
  src: string;
  position: [number, number, number];
  scale?: [number, number];
  rotation?: [number, number, number];
  opacity?: number;
}

/**
 * 3D Video Memory Mesh Component for WebGL Canvas
 * Renders an HTML5 video as a physical 3D plane texture inside the WebGL scene.
 */
export function VideoMemory({
  src,
  position,
  scale = [8, 4.5],
  rotation = [0, 0, 0],
  opacity = 0.85,
}: VideoMemoryProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const video = document.createElement("video");
    video.src = src;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;

    video.play().catch(() => {
      // Autoplay fallback: retry on first interaction
      const playOnUserGesture = () => {
        video.play();
        window.removeEventListener("click", playOnUserGesture);
      };
      window.addEventListener("click", playOnUserGesture);
    });

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;

    setVideoTexture(texture);

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.3;
    meshRef.current.position.y = position[1] + Math.sin(t) * 0.15;
  });

  if (!videoTexture) return null;

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={scale} />
      <meshBasicMaterial
        map={videoTexture}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
