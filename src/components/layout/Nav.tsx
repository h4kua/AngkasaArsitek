"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { List, X } from "@phosphor-icons/react/dist/ssr";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang" },
  { href: "/layanan", label: "Layanan" },
  { href: "/karya", label: "Karya" },
  { href: "/kontak", label: "Kontak" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open
          ? "border-line bg-ink/90 backdrop-blur-sm"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-display text-lg font-extrabold tracking-tight"
        >
          ANGKASA
          <span className="text-accent">.</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-full after:origin-left after:bg-accent after:transition-transform after:duration-300 ${
                  active
                    ? "text-paper after:scale-x-100"
                    : "text-muted after:scale-x-0 hover:text-paper hover:after:scale-x-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/kontak"
            className="border border-line px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:border-accent hover:text-accent active:scale-[0.97]"
          >
            Hubungi Kami
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          onClick={() => setOpen((v) => !v)}
          className="relative z-10 text-paper lg:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "open"}
              initial={reduce ? false : { opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={reduce ? undefined : { opacity: 0, rotate: 45 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              {open ? <X size={26} /> : <List size={26} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line lg:hidden"
          >
            <ul className="flex flex-col gap-5 px-6 py-6">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={reduce ? false : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`text-lg font-medium ${
                      pathname === link.href ? "text-paper" : "text-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={reduce ? false : { opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: links.length * 0.04 }}
              >
                <Link
                  href="/kontak"
                  onClick={() => setOpen(false)}
                  className="inline-block border border-line px-5 py-2.5 text-sm font-medium"
                >
                  Hubungi Kami
                </Link>
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
