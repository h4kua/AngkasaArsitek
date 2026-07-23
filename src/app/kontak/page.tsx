import type { Metadata } from "next";
import { EnvelopeSimple, InstagramLogo, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import ContactForm from "@/components/ui/ContactForm";
import Reveal from "@/components/ui/Reveal";
import { company, services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Kontak — Angkasa Architects",
  description:
    "Hubungi Angkasa Architects di Pekanbaru untuk mendiskusikan proyek rumah tinggal, komersial, atau bangunan publik Anda.",
};

const whatsappNumber = company.phones[0].replace(/[^0-9]/g, "");
const mapQuery = encodeURIComponent(company.address);

export default function KontakPage() {
  return (
    <>
      <section className="mx-auto max-w-2xl px-6 pt-14 pb-16 text-center lg:px-10 lg:pt-20">
        <Reveal>
          <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Mari mulai percakapan.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted">
            Isi formulir di bawah atau hubungi kami langsung. Kami biasanya
            membalas dalam satu hari kerja.
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

          <Reveal direction="right" delay={0.1} className="flex flex-col gap-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                Kontak Langsung
              </p>
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
                <li>
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    className="flex items-center gap-3 transition-colors duration-200 hover:text-accent"
                  >
                    <Phone size={18} className="shrink-0 text-accent" />
                    {company.phones[0]}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/angkasaarchitects/"
                    className="flex items-center gap-3 transition-colors duration-200 hover:text-accent"
                  >
                    <InstagramLogo size={18} className="shrink-0 text-accent" />
                    {company.instagram}
                  </a>
                </li>
              </ul>
            </div>

            <div className="group aspect-[4/3] w-full overflow-hidden border border-line">
              <iframe
                title="Lokasi Angkasa Architects"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="h-full w-full grayscale transition-all duration-500 group-hover:grayscale-0"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
