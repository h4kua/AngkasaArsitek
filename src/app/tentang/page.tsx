import type { Metadata } from "next";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import ClosingCta from "@/components/ui/ClosingCta";
import ProjectImage from "@/components/ui/ProjectImage";
import Reveal from "@/components/ui/Reveal";
import {
  achievements,
  clients,
  company,
  founders,
  milestones,
  team,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us — Angkasa Architects",
  description:
    "Angkasa Architects was founded by Jeffri Angkasa and Indri Sisilia in 2015 in Pekanbaru, with a vision to design without boundaries.",
};

export default function TentangPage() {
  return (
    <>
      <section className="mx-auto max-w-2xl px-6 pt-14 pb-16 text-center lg:px-10 lg:pt-20">
        <Reveal>
          <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            A name that means to soar to the highest.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted">
            The meaning behind Angkasa is to soar to the highest. That is the
            fundamental of our vision and mission — to become the foremost and
            best in every aspect, with no boundaries in designing, like an
            artist with a blank canvas where the sky is the limit.
          </p>
          <p className="mx-auto mt-4 font-mono text-xs uppercase tracking-[0.24em] text-accent">
            {company.hashtag}
          </p>
        </Reveal>
      </section>

      {/* Founders */}
      {founders.map((founder, i) => {
        const flipped = i % 2 === 1;
        return (
          <section
            key={founder.name}
            className="mx-auto max-w-[1400px] px-6 pb-20 lg:px-10"
          >
            <div
              className={`grid grid-cols-1 items-center gap-10 border-t border-line/70 pt-16 lg:grid-cols-2 lg:gap-16 ${
                flipped ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <Reveal
                direction={flipped ? "right" : "left"}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line/70 bg-surface shadow-[0_24px_60px_-32px_rgba(42,37,32,0.4)]"
              >
                <ProjectImage
                  src={founder.image}
                  alt={founder.name}
                  width={800}
                  height={1000}
                  sizes="(min-width: 1024px) 660px, calc(100vw - 48px)"
                  className="h-full w-full"
                />
              </Reveal>
              <Reveal
                direction={flipped ? "left" : "right"}
                delay={0.1}
                className="flex flex-col justify-center text-center lg:text-left"
              >
                <div className="flex items-center justify-center gap-3 lg:justify-start">
                  <span className="h-px w-9 bg-accent" aria-hidden />
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                    {founder.role}
                  </p>
                </div>
                <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  {founder.name}
                </h2>
                <p className="mx-auto mt-5 max-w-[55ch] text-base leading-relaxed text-muted lg:mx-0">
                  {founder.bio}
                </p>
                <a
                  href={`https://www.instagram.com/${founder.instagram.replace("@", "")}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mx-auto mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted transition-colors duration-200 hover:bg-surface-raised hover:text-accent lg:mx-0 lg:-ml-3"
                >
                  <InstagramLogo size={17} />
                  {founder.instagram}
                </a>
              </Reveal>
            </div>
          </section>
        );
      })}

      {/* Milestones */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10">
        <Reveal direction="left">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-9 bg-accent" aria-hidden />
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
              History
            </p>
            <span className="h-px w-9 bg-accent" aria-hidden />
          </div>
          <h2 className="mt-4 text-center font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            From 2015 to today.
          </h2>
        </Reveal>

        {/* <li> must be the direct child of <ol> -- Reveal renders a <div>,
            so wrapping each item in it would both produce invalid list markup
            and break `group-last` (every item would be its wrapper's last
            child, hiding every connector). Reveal sits inside the <li>. */}
        <ol className="mx-auto mt-12 max-w-3xl">
          {milestones.map((m, i) => (
            <li
              key={m.year}
              className="group grid grid-cols-[3.25rem_1.25rem_1fr] gap-x-4 pb-10 sm:grid-cols-[5.5rem_1.25rem_1fr] sm:gap-x-6"
            >
              <span className="pt-1 text-right font-mono text-sm tabular-nums text-accent sm:pt-0.5 sm:text-lg">
                {m.year}
              </span>

              {/* Rail: the dot self-centres in a fixed-width column and the
                  connector hangs from it, so no calc() alignment to drift. */}
              <span aria-hidden className="relative flex justify-center">
                <span className="mt-2 h-2.5 w-2.5 rounded-full border border-accent bg-ink" />
                <span className="absolute bottom-[-2.5rem] top-6 w-px bg-line/70 group-last:hidden" />
              </span>

              <Reveal delay={Math.min(i, 5) * 0.05}>
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {m.title}
                </h3>
                <p className="mt-2 max-w-[58ch] text-base leading-relaxed text-muted">
                  {m.text}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Team, clients and achievements — all published on the studio's own
          About page and previously missing from this site entirely. */}
      <section className="border-y border-line/70 bg-surface">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-6 py-20 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:px-10">
          <Reveal direction="left">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-accent" aria-hidden />
              <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                Our Team
              </h2>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3">
              {team.map((member) => (
                <li key={member.name}>
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-line/70 bg-surface-raised">
                    <ProjectImage
                      src={member.image}
                      alt={member.name}
                      width={1024}
                      height={1024}
                      sizes="(min-width: 1024px) 200px, (min-width: 640px) 22vw, 42vw"
                      className="h-full w-full"
                    />
                  </div>
                  <p className="mt-3 font-display text-sm font-semibold leading-snug tracking-tight">
                    {member.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    {member.role}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-12 flex items-center gap-3">
              <span className="h-px w-9 bg-accent" aria-hidden />
              <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                Achievements
              </h2>
            </div>
            <ul className="mt-6 space-y-4">
              {achievements.map((item) => (
                <li key={item} className="flex gap-4">
                  <span
                    aria-hidden
                    className="mt-2.5 h-px w-4 shrink-0 bg-accent"
                  />
                  <span className="max-w-[46ch] text-sm leading-relaxed text-muted">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal direction="right" delay={0.08}>
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-accent" aria-hidden />
              <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                Our Clients
              </h2>
            </div>
            <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-muted">
              We have built nationwide, from Pekanbaru to Jakarta, Bali,
              Surabaya and Medan — for private owners, developers and public
              figures alike.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {clients.map((client) => (
                <li
                  key={client}
                  className="rounded-full border border-line/70 bg-surface-raised px-4 py-2 text-sm text-paper"
                >
                  {client}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <ClosingCta title="Want to talk through your project?" />
    </>
  );
}
