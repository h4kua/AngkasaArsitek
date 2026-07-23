import type { Metadata } from "next";
import { Archivo, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteName = "Angkasa Architects";
const siteDescription =
  "Angkasa Architects merancang rumah, komersial, dan bangunan publik di Pekanbaru sejak 2015. Kami menciptakan ruang untuk tempat yang lebih baik.";

export const metadata: Metadata = {
  title: {
    default: `${siteName} — Biro Arsitektur Pekanbaru`,
    template: `%s`,
  },
  description: siteDescription,
  openGraph: {
    title: `${siteName} — Biro Arsitektur Pekanbaru`,
    description: siteDescription,
    siteName,
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${siteName} — Biro Arsitektur Pekanbaru`,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${jakarta.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-paper">
        <div className="grain-overlay pointer-events-none fixed inset-0 z-[60]" aria-hidden />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
