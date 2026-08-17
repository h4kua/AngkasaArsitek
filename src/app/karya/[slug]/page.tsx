import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import ClosingCta from "@/components/ui/ClosingCta";
import ProjectCard from "@/components/ui/ProjectCard";
import ProjectImage from "@/components/ui/ProjectImage";
import Reveal from "@/components/ui/Reveal";
import { projects } from "@/lib/data";
import { getRelatedProjects } from "@/lib/related-projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Cycles large+small pairs with a full-width feature every third image, so
 * the gallery reads as an edited sequence rather than a uniform grid. Loops
 * regardless of how many images a project has.
 */
const GALLERY_PATTERN = [
  {
    span: "lg:col-span-7",
    aspect: "aspect-[4/3]",
    sizes: "(min-width: 1024px) 675px, calc(100vw - 48px)",
  },
  {
    span: "lg:col-span-5",
    aspect: "aspect-[4/3]",
    sizes: "(min-width: 1024px) 470px, calc(100vw - 48px)",
  },
  {
    span: "lg:col-span-12",
    aspect: "aspect-[21/9]",
    sizes: "(min-width: 1024px) 1170px, calc(100vw - 48px)",
  },
] as const;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) {
    return {
      title: "Page Not Found — Angkasa Architects",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `${project.name} — Angkasa Architects`,
    description: project.summary,
    alternates: { canonical: `/karya/${project.slug}` },
    openGraph: project.images[0]
      ? { images: [project.images[0]] }
      : undefined,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  const related = getRelatedProjects(project, projects);

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-6 pt-10 lg:px-10">
        <Link
          href="/karya"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-paper"
        >
          <ArrowLeft size={16} weight="bold" />
          Back to Projects
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
        <Reveal className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-line/70 bg-surface shadow-[0_24px_60px_-32px_rgba(42,37,32,0.4)]">
          <ProjectImage
            src={project.images[0]}
            alt={`${project.name}, ${project.category} in ${project.location}`}
            width={1600}
            height={900}
            sizes="(min-width: 1440px) 1360px, (min-width: 1024px) calc(100vw - 80px), calc(100vw - 48px)"
            priority
            className="h-full w-full"
          />
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-20 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <Reveal direction="left">
            <p className="max-w-[65ch] text-lg leading-relaxed text-paper">
              {project.description}
            </p>

            {project.strategies && project.strategies.length > 0 && (
              <div className="mt-10 border-t border-line/70 pt-8">
                <div className="flex items-center gap-3">
                  <span className="h-px w-9 bg-accent" aria-hidden />
                  <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                    Design Strategy
                  </h2>
                </div>
                <ul className="mt-6 max-w-[62ch] space-y-4">
                  {project.strategies.map((item, i) => (
                    <li key={item} className="flex gap-4">
                      <span
                        aria-hidden
                        className="mt-1 shrink-0 font-mono text-[11px] tabular-nums text-muted"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base leading-relaxed text-paper/85">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
          <Reveal direction="right" delay={0.1}>
            <dl className="grid grid-cols-2 gap-6 rounded-2xl border border-line/70 bg-surface-raised/70 p-6 lg:grid-cols-1">
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                  Category
                </dt>
                <dd className="mt-1.5 text-sm font-medium">{project.category}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                  Location
                </dt>
                <dd className="mt-1.5 text-sm font-medium">{project.location}</dd>
              </div>
              {project.year && (
                <div>
                  <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                    Year
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium">{project.year}</dd>
                </div>
              )}
              {project.status && (
                <div>
                  <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                    Status
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium capitalize">
                    {project.status}
                  </dd>
                </div>
              )}
              {project.landSize && (
                <div>
                  <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                    Site Area
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium tabular-nums">
                    {project.landSize.toLocaleString("en-US")} m²
                  </dd>
                </div>
              )}
              {project.buildingSize && (
                <div>
                  <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                    Floor Area
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium tabular-nums">
                    {project.buildingSize.toLocaleString("en-US")} m²
                  </dd>
                </div>
              )}
              {project.architectsInCharge &&
                project.architectsInCharge.length > 0 && (
                  <div className="col-span-2 lg:col-span-1">
                    <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                      Architect in Charge
                    </dt>
                    <dd className="mt-1.5 space-y-1 text-sm font-medium">
                      {project.architectsInCharge.map((a) => (
                        <span key={a} className="block">
                          {a}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
            </dl>
          </Reveal>
        </div>
      </section>

      {project.images.length > 1 && (
        <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {project.images.slice(1).map((src, i) => {
              const { span, aspect, sizes } =
                GALLERY_PATTERN[i % GALLERY_PATTERN.length];
              return (
                <Reveal
                  key={src}
                  delay={i * 0.06}
                  className={`group relative w-full overflow-hidden rounded-2xl border border-line/70 bg-surface shadow-[0_18px_40px_-26px_rgba(42,37,32,0.35)] ${aspect} ${span}`}
                >
                  <ProjectImage
                    src={src}
                    alt={`${project.name} — detail ${i + 1}`}
                    width={1400}
                    height={800}
                    sizes={sizes}
                    className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* Related projects */}
      {related.length > 0 && (
        <section className="border-t border-line/70 bg-surface">
          <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-24">
            <Reveal direction="left">
              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-accent" aria-hidden />
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                  Related Projects
                </p>
              </div>
              <h2 className="mt-4 max-w-[24ch] font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {related.every((p) => p.category === project.category)
                  ? `More ${project.category.toLowerCase()} work.`
                  : "More from Angkasa Architects."}
              </h2>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal
                  key={p.slug}
                  direction={i === 0 ? "left" : i === 2 ? "right" : "up"}
                  delay={i * 0.06}
                >
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <ClosingCta
        eyebrow="Similar vision?"
        title="Have a site and a similar idea?"
      />
    </>
  );
}
