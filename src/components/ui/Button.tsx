import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 whitespace-nowrap active:scale-[0.97]";
  const styles =
    variant === "primary"
      ? "bg-accent text-paper shadow-[0_0_0_0_rgba(61,99,255,0)] hover:bg-accent-dim hover:shadow-[0_10px_32px_-8px_rgba(61,99,255,0.6)]"
      : "border border-line text-paper hover:border-accent hover:text-accent";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
      <ArrowUpRight
        size={16}
        weight="bold"
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>
  );
}
