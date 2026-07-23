"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

interface StackSectionProps {
  children: ReactNode;
  className?: string;
}

/**
 * A full-screen sticky panel that the next StackSection physically slides
 * over as the page scrolls, dimming and receding under it -- so the seam
 * between sections reads as a layered, cinematic cut instead of a flat
 * scroll-past. Stack two or more in DOM order; later ones cover earlier ones.
 */
export default function StackSection({ children, className = "" }: StackSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.45]);
  const brightness = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  return (
    <section
      ref={ref}
      className={`sticky top-0 flex min-h-dvh flex-col justify-center overflow-hidden ${className}`}
    >
      <motion.div style={reduce ? undefined : { scale, opacity, filter }}>
        {children}
      </motion.div>
    </section>
  );
}
