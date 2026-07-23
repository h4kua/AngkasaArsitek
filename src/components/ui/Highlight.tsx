"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export default function Highlight({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <span className="relative inline-block text-accent">
      {children}
      <motion.span
        aria-hidden
        className="absolute -bottom-2 left-0 h-[3px] bg-accent/70 sm:-bottom-3"
        initial={reduce ? false : { width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
    </span>
  );
}
