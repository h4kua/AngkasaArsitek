import Link from "next/link";
import {
  ArrowUp,
  InstagramLogo,
  EnvelopeSimple,
  Phone,
} from "@phosphor-icons/react/dist/ssr";
import { company, services } from "@/lib/data";

function ColumnLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
      {children}
    </p>
  );
}

const columns = [
  {
    title: "Navigation",
    links: [
      { href: "/", label: "Home" },
      { href: "/tentang", label: "About" },
      { href: "/layanan", label: "Services" },
      { href: "/karya", label: "Projects" },
    ],
  },
  {
    // Derived from the service list so the anchors cannot point at slugs that
    // no longer exist -- they previously still referenced the old taxonomy.
    title: "Services",
    links: services.slice(0, 4).map((s) => ({
      href: `/layanan#${s.slug}`,
      label: s.name,
    })),
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line/70 bg-ink">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
          <div>
            <p className="font-display text-2xl font-extrabold tracking-tight">
              ANGKASA<span className="text-accent">.</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {company.motto} An architecture studio from Pekanbaru, building
              since {company.founded}.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <ColumnLabel>{col.title}</ColumnLabel>
              <ul className="mt-5 flex flex-col gap-3 [@media(pointer:coarse)]:gap-0">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {/* The enlarged hit area is gated to coarse pointers so
                        touch gets a 44px target while the desktop footer keeps
                        its tighter, more composed spacing. The underline moves
                        to an inner span so padding can grow without dragging
                        the rule away from the text. */}
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-sm text-paper transition-colors duration-200 hover:text-accent [@media(pointer:coarse)]:min-h-11"
                    >
                      <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <ColumnLabel>Contact</ColumnLabel>
            <ul className="mt-5 flex flex-col gap-3.5 text-sm">
              <li className="text-muted">{company.address}</li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="group inline-flex items-center gap-2.5 transition-colors duration-200 hover:text-accent"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line/70 transition-colors duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                    <EnvelopeSimple size={15} />
                  </span>
                  {company.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${company.phones[0].replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 transition-colors duration-200 hover:text-accent"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line/70 transition-colors duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                    <Phone size={15} />
                  </span>
                  {company.phones[0]}
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/angkasaarchitects/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 transition-colors duration-200 hover:text-accent"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line/70 transition-colors duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                    <InstagramLogo size={15} />
                  </span>
                  {company.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line/70 pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {company.name}. All rights
            reserved.
          </p>
          <a
            href="#top"
            className="group inline-flex items-center gap-1.5 font-medium text-muted transition-colors duration-200 hover:text-accent"
          >
            Back to top
            <ArrowUp
              size={13}
              weight="bold"
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
