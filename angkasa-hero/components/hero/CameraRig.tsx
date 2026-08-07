"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CAMERA_KEYFRAMES } from "./constants";

export default function CameraRig({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  const { camera } = useThree();
  const smoothed = useRef(0);

  const positionCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        CAMERA_KEYFRAMES.map((k) => new THREE.Vector3(...k.position)),
        false,
        "catmullrom",
        0.15
      ),
    []
  );

  const lookAtCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        CAMERA_KEYFRAMES.map((k) => new THREE.Vector3(...k.lookAt)),
        false,
        "catmullrom",
        0.15
      ),
    []
  );

  useFrame((_, delta) => {
    // A second, gentler easing layer on top of Lenis/ScrollTrigger's own
    // scrub smoothing — this is what removes the last bit of "stepping"
    // from a spline evaluated at a scrub-smoothed but still discretely
    // sampled progress value. Frame-rate independent via delta.
    const followSpeed = 1 - Math.pow(0.001, delta);
    smoothed.current += (progressRef.current - smoothed.current) * followSpeed;

    const t = THREE.MathUtils.clamp(smoothed.current, 0, 1);
    camera.position.copy(positionCurve.getPoint(t));
    camera.lookAt(lookAtCurve.getPoint(t));
  });

  return null;
}
