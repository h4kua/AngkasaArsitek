"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { BOX_MAT, EDGE_MAT, flatBoxGeometry } from "./palette";

interface FlatBoxProps {
  size: readonly [number, number, number];
  position: readonly [number, number, number];
  color: string;
  rotation?: readonly [number, number, number];
  edges?: boolean;
}

/**
 * The single building block of the model: an unlit box whose shading is
 * baked into vertex colors, sharing one material (and one edge material)
 * with every other box in the scene.
 */
export default function FlatBox({ size, position, color, rotation, edges = true }: FlatBoxProps) {
  const [sx, sy, sz] = size;
  const geo = useMemo(() => {
    let seed = 7;
    for (let i = 0; i < color.length; i++) seed = (seed * 31 + color.charCodeAt(i)) | 0;
    seed = (seed + Math.floor(sx * 971 + sy * 577 + sz * 313)) | 0;
    return flatBoxGeometry(sx, sy, sz, color, seed);
  }, [sx, sy, sz, color]);
  const edgeGeo = useMemo(() => (edges ? new THREE.EdgesGeometry(geo) : null), [geo, edges]);

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geo} material={BOX_MAT} />
      {edgeGeo && <lineSegments geometry={edgeGeo} material={EDGE_MAT} />}
    </group>
  );
}
