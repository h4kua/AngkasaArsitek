import type { ReactNode } from "react";

interface SectionIntroProps {
  title: string;
  body?: string;
  action?: ReactNode;
  className?: string;
  align?: "left" | "center";
  label?: string;
}

export default function SectionIntro({
  title,
  body,
  action,
  className = "",
  align = "center",
  label,
}: SectionIntroProps) {
  const isLeft = align === "left";
  return (
    <div className={`${isLeft ? "" : "mx-auto max-w-2xl text-center"} ${className}`}>
      {label && (
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-accent">
          {label}
        </p>
      )}
      <h2
        className={`font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl ${
          isLeft ? "max-w-2xl" : ""
        }`}
      >
        {title}
      </h2>
      {body && (
        <p
          className={`mt-5 text-base leading-relaxed text-muted ${
            isLeft ? "max-w-[60ch]" : "mx-auto max-w-[60ch]"
          }`}
        >
          {body}
        </p>
      )}
      {action && (
        <div className={`mt-6 flex ${isLeft ? "" : "justify-center"}`}>
          {action}
        </div>
      )}
    </div>
  );
}
