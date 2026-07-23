import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import ClosingCta from "@/components/ui/ClosingCta";
import ProjectImage from "@/components/ui/ProjectImage";
import Reveal from "@/components/ui/Reveal";
import { projects } from "@/lib/data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — Angkasa Architects`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];

  if (!project) notFound();

  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-6 pt-10 lg:px-10">
        <Link
          href="/karya"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-paper"
        >
          <ArrowLeft size={16} weight="bold" />
          Kembali ke Karya
        </Link>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pt-8 pb-12 lg:px-10">
        <Reveal>
          <p className="font-mono text-sm text-muted">
            {project.category} · {project.location}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {project.name}
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-10">
        <Reveal className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
          <ProjectImage
            seed={project.imageSeed}
            alt={`${project.name}, ${project.category} di ${project.location}`}
            width={1600}
            height={900}
            priority
            className="h-full w-full"
          />
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-20 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
          <Reveal direction="left">
            <p className="max-w-[65ch] text-lg leading-relaxed text-paper">
              {project.description}
            </p>
          </Reveal>
          <Reveal direction="right" delay={0.1} className="lg:border-l lg:border-line lg:pl-10">
            <dl className="grid grid-cols-2 gap-6 lg:grid-cols-1">
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                  Kategori
                </dt>
                <dd className="mt-1.5 text-sm">{project.category}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                  Lokasi
                </dt>
                <dd className="mt-1.5 text-sm">{project.location}</dd>
              </div>
              {project.year && (
                <div>
                  <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                    Tahun
                  </dt>
                  <dd className="mt-1.5 text-sm">{project.year}</dd>
                </div>
              )}
            </dl>
          </Reveal>
        </div>
      </section>

      {project.gallerySeeds.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {project.gallerySeeds.map((seed, i) => (
              <Reveal
                key={seed}
                delay={i * 0.06}
                className="group relative aspect-[4/3] w-full overflow-hidden bg-surface"
              >
                <ProjectImage
                  seed={seed}
                  alt={`Detail ${project.name}`}
                  width={1000}
                  height={750}
                  className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Next project */}
      <section className="border-t border-line transition-colors duration-300 hover:bg-surface">
        <Link
          href={`/karya/${next.slug}`}
          className="group mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-14 lg:px-10"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              Karya selanjutnya
            </p>
            <p className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              {next.name}
            </p>
          </div>
          <ArrowUpRight
            size={28}
            weight="bold"
            className="shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
          />
        </Link>
      </section>

      <ClosingCta title="Punya lahan dan ide serupa?" />
    </>
  );
}
