"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

interface CountUpProps {
  value: string;
}

export default function CountUp({ value }: CountUpProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(spanRef, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const numeric = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    if (!spanRef.current) return;
    if (Number.isNaN(numeric) || reduce || !inView) {
      spanRef.current.textContent = value;
      return;
    }
    const controls = animate(0, numeric, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (spanRef.current) spanRef.current.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, numeric, reduce, suffix, value]);

  return <span ref={spanRef}>{reduce ? value : "0"}</span>;
}
