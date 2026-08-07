"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useDeviceTier } from "@/lib/useDeviceTier";
import { useScrollTimeline } from "./useScrollTimeline";
import CameraRig from "./CameraRig";
import SkyLayer from "./SkyLayer";
import Landscape from "./Landscape";
import WaterPlane from "./WaterPlane";
import ArchitectureSequence from "./ArchitectureSequence";
import PostFX from "./PostFX";
import HeroOverlay from "../ui/HeroOverlay";
import ReducedMotionFallback from "../ui/ReducedMotionFallback";

// Total scroll distance driving the 0→1 timeline. 700vh gives ~7 screens
// of scroll to spread the 9 beats across without any single beat feeling
// rushed on a fast trackpad flick.
const SCROLL_HEIGHT_VH = 700;

export default function HeroExperience() {
  const tier = useDeviceTier();
  const containerRef = useRef<HTMLDivElement>(null);
  const isFull = tier === "full";
  const progressRef = useScrollTimeline(containerRef, isFull);

  return (
    <section
      ref={containerRef}
      className="relative bg-ink"
      style={{ height: tier === null ? "100vh" : `${SCROLL_HEIGHT_VH}vh` }}
    >
      <a
        href="#site-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-stone focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip intro animation
      </a>

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ReducedMotionFallback animated={isFull} />

        {isFull && (
          <Canvas
            shadows
            dpr={[1, 1.4]}
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.05,
            }}
            camera={{ fov: 32, near: 0.1, far: 200, position: [0, 6.5, 34] }}
            aria-hidden="true"
            className="absolute inset-0"
          >
            <CameraRig progressRef={progressRef} />
            <SkyLayer progressRef={progressRef} />
            <Landscape progressRef={progressRef} />
            <WaterPlane progressRef={progressRef} />
            <ArchitectureSequence progressRef={progressRef} />
            <PostFX />
          </Canvas>
        )}

        <HeroOverlay />
      </div>
    </section>
  );
}
