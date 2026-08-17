import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Project } from "@/lib/types";
import ProjectImage from "./ProjectImage";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export default function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <Link
      href={`/karya/${project.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line/70 bg-surface-raised/70 shadow-[0_18px_40px_-26px_rgba(42,37,32,0.35)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_28px_56px_-24px_rgba(42,37,32,0.4)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        <ProjectImage
          src={project.images[0]}
          alt={`${project.name}, ${project.category} in ${project.location}`}
          width={1200}
          height={900}
          sizes="(min-width: 1024px) 440px, (min-width: 640px) 45vw, 100vw"
          priority={priority}
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-paper/70 via-paper/0 to-paper/0" />
        <div className="absolute inset-0 bg-accent/0 mix-blend-multiply transition-colors duration-500 group-hover:bg-accent/10" />

        <span className="absolute left-4 top-4 rounded-full border border-line/60 bg-surface-raised/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper backdrop-blur-sm">
          {project.category}
        </span>

        <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised/90 text-paper opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100 group-hover:bg-accent group-hover:text-on-accent">
          <ArrowUpRight size={16} weight="bold" />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-5 pb-5 pt-4">
        <p className="font-display text-xl font-semibold tracking-tight">
          {project.name}
        </p>
        <p className="text-sm text-muted">
          {project.location}
          {project.year ? ` · ${project.year}` : ""}
        </p>
        <div className="mt-3 flex -translate-x-1 items-center gap-1.5 text-sm font-medium text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          View project
          <ArrowUpRight size={14} weight="bold" />
        </div>
      </div>
    </Link>
  );
}
