import Link from "next/link";
import { InstagramLogo, EnvelopeSimple, Phone } from "@phosphor-icons/react/dist/ssr";
import { company } from "@/lib/data";

const columns = [
  {
    title: "Navigasi",
    links: [
      { href: "/", label: "Beranda" },
      { href: "/tentang", label: "Tentang" },
      { href: "/layanan", label: "Layanan" },
      { href: "/karya", label: "Karya" },
    ],
  },
  {
    title: "Layanan",
    links: [
      { href: "/layanan#rumah-tinggal", label: "Rumah Tinggal" },
      { href: "/layanan#komersial", label: "Komersial" },
      { href: "/layanan#interior", label: "Interior" },
      { href: "/layanan#bangunan-publik", label: "Bangunan Publik" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="blueprint-grid relative border-t border-line">
      <div className="relative mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
          <div>
            <p className="font-display text-2xl font-extrabold tracking-tight">
              ANGKASA<span className="text-accent">.</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {company.motto} Biro arsitektur asal Pekanbaru, berkarya sejak{" "}
              {company.founded}.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                {col.title}
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="relative inline-block text-sm text-paper transition-colors duration-200 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-accent hover:after:scale-x-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              Kontak
            </p>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              <li className="text-muted">{company.address}</li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-accent"
                >
                  <EnvelopeSimple size={16} />
                  {company.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${company.phones[0].replace(/[^0-9]/g, "")}`}
                  className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-accent"
                >
                  <Phone size={16} />
                  {company.phones[0]}
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/angkasaarchitects/"
                  className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-accent"
                >
                  <InstagramLogo size={16} />
                  {company.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {company.name}. Seluruh hak
            cipta dilindungi.
          </p>
          <p>{company.address}</p>
        </div>
      </div>
    </footer>
  );
}
