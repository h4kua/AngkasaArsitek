"use client";

import { useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Drives a 0-1 progress ref off the scroll position of `containerRef`.
 *
 * Deliberately does NOT use GSAP's `pin: true`. Pinning is handled by plain
 * CSS `position: sticky` on the inner viewport (see HeroExperience) — that
 * avoids the layout-thrash / Lenis-transform conflicts that JS-driven
 * pinning can introduce, at the cost of one extra wrapper div. ScrollTrigger
 * here is used purely as a scroll-progress oracle.
 *
 * Progress is written to a ref, not React state, so a 60fps scroll doesn't
 * trigger 60fps of React re-renders. Consumers read `progressRef.current`
 * inside `useFrame`.
 */
export function useScrollTimeline(
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean
): RefObject<number> {
  const progressRef = useRef(0);

  useGSAP(
    () => {
      if (!enabled || !containerRef.current) return;

      const lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
      });

      const raf = (time: number) => lenis.raf(time);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      lenis.on("scroll", ScrollTrigger.update);

      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.2,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          // Cheap CSS hook for DOM-side (non-Canvas) scroll reactions —
          // see HeroOverlay, which reads this instead of re-rendering.
          document.documentElement.style.setProperty(
            "--scroll-progress",
            self.progress.toFixed(4)
          );
        },
      });

      return () => {
        trigger.kill();
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    },
    { dependencies: [enabled], scope: containerRef as RefObject<HTMLElement> }
  );

  return progressRef;
}
