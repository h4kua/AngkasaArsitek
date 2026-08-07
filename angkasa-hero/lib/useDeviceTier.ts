"use client";

import { useSyncExternalStore } from "react";

export type DeviceTier = "full" | "reduced";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function computeTier(): DeviceTier {
  const prefersReduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
  const isNarrowViewport = window.matchMedia("(max-width: 640px)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const lowCoreCount =
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency > 0 &&
    navigator.hardwareConcurrency <= 4;

  // Mobile + low core count is a rough, conservative proxy for "this GPU
  // will not hold 45fps with bloom + reflections + instanced foliage."
  // Intentionally conservative: a false positive costs a nicer gradient
  // fallback, a false negative costs a janky hero.
  const isLowTierMobile = isNarrowViewport && coarsePointer && lowCoreCount;

  return prefersReduced || isLowTierMobile ? "reduced" : "full";
}

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * Resolves to null on the server and until the client store is read once,
 * then to "full" or "reduced". Consumers must treat `null` as "not decided"
 * and avoid mounting the WebGL canvas until this settles — that's what
 * keeps reduced-motion and low-end users from ever paying for a Canvas
 * that gets torn down a frame later.
 *
 * Built on useSyncExternalStore (React's sanctioned pattern for reading
 * external browser state) rather than useState+useEffect, so it re-derives
 * automatically if the OS-level reduced-motion setting changes mid-session.
 */
export function useDeviceTier(): DeviceTier | null {
  return useSyncExternalStore(subscribe, computeTier, () => null);
}
