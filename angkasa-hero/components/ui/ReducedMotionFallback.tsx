import { PALETTE } from "../hero/constants";

export default function ReducedMotionFallback({
  animated,
}: {
  /** Only true for full-tier users, while the Canvas is mounting. Actual
   * reduced-motion-preference users always get the fully static version,
   * regardless of this prop. */
  animated: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 ${animated ? "hero-fallback-animated" : ""}`}
      style={{
        background: `radial-gradient(ellipse 120% 80% at 70% 20%, ${PALETTE.skyDawn} 0%, ${PALETTE.skyDeep} 55%, ${PALETTE.ink} 100%)`,
      }}
    />
  );
}
