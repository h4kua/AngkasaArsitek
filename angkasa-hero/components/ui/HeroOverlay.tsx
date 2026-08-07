"use client";

import { motion } from "framer-motion";

export default function HeroOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-10">
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="pointer-events-auto flex items-center justify-between text-stone"
      >
        <span className="font-display text-sm tracking-[0.25em] uppercase">
          Angkasa Architects
        </span>
        <div className="hidden gap-8 text-xs tracking-[0.2em] uppercase md:flex">
          <a href="#site-content" className="transition-opacity hover:opacity-70">
            Work
          </a>
          <a href="#site-content" className="transition-opacity hover:opacity-70">
            Studio
          </a>
          <a href="#site-content" className="transition-opacity hover:opacity-70">
            Contact
          </a>
        </div>
      </motion.nav>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }}
        className="max-w-md text-stone hero-overlay-fade"
      >
        <p className="mb-3 text-xs tracking-[0.3em] uppercase text-gold">
          Sky is the Limit
        </p>
        <h1 className="font-display text-4xl leading-[1.05] md:text-5xl">
          Modern tropical architecture, built around light.
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone/80">
          Angkasa Architects designs residential work in Pekanbaru shaped by
          natural light, premium materials, and calm, deliberate space.
        </p>
      </motion.div>
    </div>
  );
}
