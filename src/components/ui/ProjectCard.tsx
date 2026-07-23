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
      className="group relative block overflow-hidden"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        <ProjectImage
          seed={project.imageSeed}
          alt={`${project.name}, ${project.category} di ${project.location}`}
          width={1200}
          height={900}
          priority={priority}
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-ink/0" />
        <div className="absolute inset-0 bg-accent/0 mix-blend-screen transition-colors duration-500 group-hover:bg-accent/15" />
      </div>
      <div className="flex items-start justify-between gap-4 border-t border-line pt-4 mt-4">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight">
            {project.name}
          </p>
          <p className="mt-1 text-sm text-muted">{project.category}</p>
          <p className="text-sm text-muted">
            {project.location}
            {project.year ? ` · ${project.year}` : ""}
          </p>
        </div>
        <ArrowUpRight
          size={20}
          weight="bold"
          className="mt-1 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
        />
      </div>
    </Link>
  );
}
