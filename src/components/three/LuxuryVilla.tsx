"use client";

import { type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { phaseT, smoothstep } from "./phases";
import { tuneEdges } from "./palette";
import House from "./House";
import Landscape from "./Landscape";

interface LuxuryVillaProps {
  smoothRef: MutableRefObject<number>;
}

/**
 * The complete presentation model: building plus landscape, sharing one
 * smoothed scroll progress. The only cross-cutting concern handled here is
 * the shared edge linework, which relaxes from blueprint blue to a quiet
 * model gray as construction completes.
 */
export default function LuxuryVilla({ smoothRef }: LuxuryVillaProps) {
  useFrame(() => {
    tuneEdges(smoothstep(phaseT(smoothRef.current, [0.62, 0.9])));
  });

  return (
    <group>
      <House smoothRef={smoothRef} />
      <Landscape smoothRef={smoothRef} />
    </group>
  );
}
