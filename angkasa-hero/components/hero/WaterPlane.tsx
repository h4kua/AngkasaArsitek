"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { BREAKPOINTS, mapRange, PALETTE } from "./constants";

export default function WaterPlane({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const p = progressRef.current;
    const reveal = mapRange(p, BREAKPOINTS.landscapeReveal, BREAKPOINTS.structuralGrid);
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.Material & { opacity: number };
      mat.opacity = reveal;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[2.5, 0.01, 2.5]}>
      <planeGeometry args={[8.5, 3.6]} />
      <MeshReflectorMaterial
        resolution={512}
        mirror={0.55}
        blur={[150, 50]}
        mixBlur={8}
        mixStrength={1.2}
        roughness={0.6}
        depthScale={0.4}
        minDepthThreshold={0.85}
        maxDepthThreshold={1.2}
        color={PALETTE.mist}
        metalness={0.15}
        transparent
        opacity={0}
      />
    </mesh>
  );
}
