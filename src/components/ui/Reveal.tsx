"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealDirection = "up" | "left" | "right";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: RevealDirection;
  className?: string;
}

const OFFSETS: Record<RevealDirection, { x?: number; y?: number }> = {
  up: { y: 28 },
  left: { x: -56 },
  right: { x: 56 },
};

export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: RevealProps) {
  const reduce = useReducedMotion();
  const offset = OFFSETS[direction];

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
