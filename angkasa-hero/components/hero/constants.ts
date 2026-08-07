// Single source of truth for the hero's scroll choreography.
// Percentages match the brief's scroll timeline exactly (0/10/20/35/50/65/80/90/100).

export const BREAKPOINTS = {
  skyOnly: 0.0,
  cloudMovement: 0.1,
  landscapeReveal: 0.2,
  structuralGrid: 0.35,
  architectureVolume: 0.5,
  materialsTransition: 0.65,
  vegetationAnimation: 0.8,
  interiorLighting: 0.9,
  finalHero: 1.0,
} as const;

// Warm, brand-specific palette. Deliberately not the generic AI-default
// cream+terracotta pairing — gold reads as sunlight/brass rather than clay,
// and the deep charcoal carries over the ink tone used in earlier brand work.
export const PALETTE = {
  ink: "#14171A", // near-black charcoal — text on light, dark section bg
  stone: "#EDE7DA", // warm travertine/cream — light neutral
  gold: "#C9A468", // muted brass/gold accent — sunrise + structure lines
  clay: "#8C7A66", // warm concrete/travertine mid-tone for solid volumes
  sage: "#45543F", // deep muted green — vegetation
  mist: "#B9C4CC", // cool pale blue-grey — glass, water highlights
  skyDawn: "#F4CFA0", // sky gradient — horizon
  skyDeep: "#5D7396", // sky gradient — zenith
} as const;

/** Clamped linear remap of `value` from [inMin, inMax] to [0, 1]. */
export function mapRange(value: number, inMin: number, inMax: number): number {
  if (inMax === inMin) return value >= inMax ? 1 : 0;
  const t = (value - inMin) / (inMax - inMin);
  return Math.min(1, Math.max(0, t));
}

export interface CameraKeyframe {
  t: number;
  position: [number, number, number];
  lookAt: [number, number, number];
}

// Slow dolly-in with a tiny crane down, ending on a low, pool-deck-height
// view across the water toward the villa — matching the reference image's
// composition (architecture right, sky/pool open on the left). Recalibrated
// against the wider, two-story massing in ArchitectureSequence.tsx.
// PLACEHOLDER framing — recalibrate again once a real photo/model defines
// the actual camera angle to match.
export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  { t: 0.0, position: [0, 8, 36], lookAt: [0, 7, 0] }, // sky only
  { t: 0.1, position: [-1, 7, 31], lookAt: [0.5, 6, -0.5] }, // cloud movement
  { t: 0.2, position: [-2, 5.2, 25], lookAt: [1, 4, -0.5] }, // landscape reveal
  { t: 0.35, position: [-2.5, 3.6, 19], lookAt: [2, 2.8, -0.8] }, // structural grid
  { t: 0.5, position: [-3, 2.5, 15], lookAt: [2.8, 2.1, -0.9] }, // architecture volume
  { t: 0.65, position: [-3, 1.85, 12], lookAt: [3.2, 1.65, -1] }, // materials
  { t: 0.8, position: [-3, 1.5, 9.5], lookAt: [3.4, 1.5, -1] }, // vegetation
  { t: 0.9, position: [-3, 1.35, 8], lookAt: [3.5, 1.35, -1] }, // interior light
  { t: 1.0, position: [-3, 1.3, 7], lookAt: [3.5, 1.3, -1] }, // final hero
];
