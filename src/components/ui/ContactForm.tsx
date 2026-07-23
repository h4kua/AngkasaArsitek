"use client";

import { useState, type FormEvent } from "react";
import { CaretDown, PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";

interface ContactFormProps {
  whatsappNumber: string;
  serviceOptions: string[];
}

const inputStyles =
  "border border-line bg-transparent px-4 py-3 text-sm text-paper placeholder:text-muted transition-colors duration-200 hover:border-muted focus:border-accent focus:outline-none";

export default function ContactForm({
  whatsappNumber,
  serviceOptions,
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [projectType, setProjectType] = useState(serviceOptions[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = `Halo Angkasa Architects, saya ${name}. Saya tertarik dengan layanan ${projectType}. ${message}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nama
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama lengkap Anda"
          className={inputStyles}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="projectType" className="text-sm font-medium">
          Jenis Layanan
        </label>
        <div className="relative">
          <select
            id="projectType"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className={`w-full appearance-none ${inputStyles}`}
          >
            {serviceOptions.map((option) => (
              <option key={option} value={option} className="bg-ink">
                {option}
              </option>
            ))}
          </select>
          <CaretDown
            size={16}
            weight="bold"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium">
          Ceritakan Proyek Anda
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Lokasi lahan, luas kira-kira, dan gambaran kebutuhan Anda"
          className={inputStyles}
        />
      </div>

      <button
        type="submit"
        className="group inline-flex w-fit items-center gap-2 bg-accent px-6 py-3.5 text-sm font-medium text-paper transition-all duration-300 hover:bg-accent-dim hover:shadow-[0_10px_32px_-8px_rgba(61,99,255,0.6)] active:scale-[0.97]"
      >
        Kirim via WhatsApp
        <PaperPlaneTilt
          size={16}
          weight="bold"
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </button>

      {sent && (
        <p className="text-sm text-muted">
          WhatsApp terbuka di tab baru dengan pesan Anda. Belum terkirim?
          Salin pesan dan kirim manual ke nomor kami.
        </p>
      )}
    </form>
  );
}
