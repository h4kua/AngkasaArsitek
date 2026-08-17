import type { Metadata } from "next";
import Link from "next/link";
import { EnvelopeSimple, InstagramLogo, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import ContactForm from "@/components/ui/ContactForm";
import Reveal from "@/components/ui/Reveal";
import { company, services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact — Angkasa Architects",
  description:
    "Contact Angkasa Architects in Pekanbaru to discuss your private house, commercial or public building project.",
  alternates: { canonical: "/kontak" },
};

const whatsappNumber = company.phones[0].replace(/[^0-9]/g, "");
const mapQuery = encodeURIComponent(company.address);

export default function KontakPage() {
  return (
    <>
      <section className="mx-auto max-w-2xl px-6 pt-14 pb-16 text-center lg:px-10 lg:pt-20">
        <Reveal>
          <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Let us start a conversation.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted">
            Fill in the form below or reach us directly. We usually reply within
            one working day.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1fr]">
          <Reveal direction="left">
            <ContactForm
              whatsappNumber={whatsappNumber}
              serviceOptions={services.map((s) => s.name)}
            />
          </Reveal>

          <Reveal direction="right" delay={0.1} className="flex flex-col gap-8">
            <div className="rounded-2xl border border-line/70 bg-surface-raised/70 p-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-accent" aria-hidden />
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                  Direct Contact
                </p>
              </div>
              <ul className="mt-5 flex flex-col gap-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-accent" />
                  {company.address}
                </li>
                <li>
                  <a
                    href={`mailto:${company.email}`}
                    className="flex items-center gap-3 transition-colors duration-200 hover:text-accent"
                  >
                    <EnvelopeSimple size={18} className="shrink-0 text-accent" />
                    {company.email}
                  </a>
                </li>
                {company.phones.map((phone, i) => (
                  <li key={phone}>
                    <a
                      href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 transition-colors duration-200 hover:text-accent"
                    >
                      <Phone
                        size={18}
                        className={`shrink-0 text-accent ${i > 0 ? "opacity-0" : ""}`}
                        aria-hidden={i > 0}
                      />
                      {phone}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="https://www.instagram.com/angkasaarchitects/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 transition-colors duration-200 hover:text-accent"
                  >
                    <InstagramLogo size={18} className="shrink-0 text-accent" />
                    {company.instagram}
                  </a>
                </li>
              </ul>
            </div>

            <div className="group aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line/70 shadow-[0_18px_40px_-26px_rgba(42,37,32,0.35)]">
              <iframe
                title="Angkasa Architects location"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="h-full w-full grayscale transition-all duration-500 group-hover:grayscale-0"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Preparation + coverage. Both are derived from what the process and
          the city list already commit to -- no new promises about response
          time, fees, or schedule are made here. */}
      <section className="border-t border-line/70 bg-surface">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-20">
          <Reveal direction="left">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-accent" aria-hidden />
              <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                Before You Reach Out
              </h2>
            </div>
            <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-muted">
              None of this is required, but these four make the first consultation
              far more productive — we can get straight to design possibilities
              rather than gathering basics.
            </p>
            <ul className="mt-7 space-y-4">
              {[
                {
                  t: "Site location and area",
                  d: "An address or map pin, plus approximate dimensions. A certificate or survey drawing if you have one.",
                },
                {
                  t: "Spatial requirements",
                  d: "How many rooms, who will use them, and what activities need to be accommodated.",
                },
                {
                  t: "Budget range",
                  d: "A rough figure is enough. It shapes material choices and floor area from the very start.",
                },
                {
                  t: "Visual references",
                  d: "Images of homes or spaces you like — and ones you dislike, which helps just as much.",
                },
              ].map((item, i) => (
                <li key={item.t} className="flex gap-4">
                  <span
                    aria-hidden
                    className="mt-0.5 shrink-0 font-mono text-[11px] tabular-nums text-accent"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-paper">
                      {item.t}
                    </span>
                    <span className="mt-1 block max-w-[46ch] text-sm leading-relaxed text-muted">
                      {item.d}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal direction="right" delay={0.08}>
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-accent" aria-hidden />
              <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                Where We Work
              </h2>
            </div>
            <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-muted">
              Our studio is in Pekanbaru, but our built work spans{" "}
              {company.cities.length} cities. For projects outside the city,
              coordination runs online with scheduled site visits.
            </p>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {company.cities.map((city) => (
                <li
                  key={city}
                  className="rounded-full border border-line/70 bg-surface-raised px-4 py-2 text-sm text-paper"
                >
                  {city}
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-line/70 pt-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                After you reach out
              </p>
              <p className="mt-3 max-w-[50ch] text-sm leading-relaxed text-muted">
                That first conversation is the initial consultation — stage one
                of our five-stage process, and free of charge. Each stage and
                its output is set out on{" "}
                <Link
                  href="/layanan"
                  className="font-medium text-accent underline underline-offset-4 transition-colors duration-200 hover:text-accent-dim"
                >
                  the Services page
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
