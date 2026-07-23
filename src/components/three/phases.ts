// Construction phase windows mapped over overall scroll progress (0-1).
// Windows overlap slightly so the build reads as one continuous act.
export const PHASES = {
  blueprint: [0.02, 0.125],
  foundation: [0.105, 0.215],
  structure: [0.195, 0.315],
  walls: [0.29, 0.415],
  roof: [0.395, 0.515],
  glass: [0.49, 0.6],
  cladding: [0.575, 0.69],
  interior: [0.665, 0.785],
  landscape: [0.755, 0.9],
  atmosphere: [0.865, 0.985],
} as const;

export type PhaseName = keyof typeof PHASES;

export function phaseT(progress: number, [start, end]: readonly [number, number]) {
  const t = (progress - start) / (end - start);
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

// Calm, editorial easing curves. No overshoot, no bounce.
export function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

export function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

export function easeInOutExpo(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
}

// Splits a phase's 0-1 value into per-item staggered values.
export function stagger(t: number, index: number, count: number, overlap = 0.7) {
  if (count <= 1) return t;
  const itemDur = 1 / (1 + (count - 1) * (1 - overlap));
  const start = index * (1 - overlap) * itemDur;
  const v = (t - start) / itemDur;
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
