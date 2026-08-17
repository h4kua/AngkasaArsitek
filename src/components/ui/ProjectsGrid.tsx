"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { Project, ProjectCategory } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";

interface ProjectsGridProps {
  projects: Project[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const categories = useMemo(() => {
    const set = new Set<ProjectCategory>(projects.map((p) => p.category));
    return Array.from(set);
  }, [projects]);

  const [active, setActive] = useState<ProjectCategory | "All">("All");

  const filtered =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div className="flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
        {(["All", ...categories] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            aria-pressed={active === cat}
            onClick={() => setActive(cat)}
            className={`relative shrink-0 overflow-hidden border px-4 py-2 text-sm font-medium transition-colors duration-200 active:scale-[0.97] ${
              active === cat
                ? "border-accent text-paper"
                : "border-line text-muted hover:border-paper hover:text-paper"
            }`}
          >
            {active === cat && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 bg-accent"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, i) => {
          const col = i % 3;
          const direction = col === 0 ? "left" : col === 2 ? "right" : "up";
          return (
            <Reveal key={project.slug} direction={direction} delay={Math.floor(i / 3) * 0.08}>
              <ProjectCard project={project} priority={i === 0} />
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
