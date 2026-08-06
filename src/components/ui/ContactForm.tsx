"use client";

import { useState, type FormEvent } from "react";
import { CaretDown, PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";

interface ContactFormProps {
  whatsappNumber: string;
  serviceOptions: string[];
}

const inputStyles =
  "rounded-xl border border-line/80 bg-surface-raised/60 px-4 py-3 text-sm text-paper placeholder:text-muted transition-colors duration-200 hover:border-muted focus:border-accent focus:outline-none";

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
    const text = `Hello Angkasa Architects, my name is ${name}. I'm interested in ${projectType}. ${message}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          className={inputStyles}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="projectType" className="text-sm font-medium">
          Service Type
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
          Tell Us About Your Project
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Site location, approximate area, and an outline of what you need"
          className={inputStyles}
        />
      </div>

      <button
        type="submit"
        className="group inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-medium text-on-accent shadow-[0_0_0_0_rgba(140,104,54,0)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dim hover:shadow-[0_10px_32px_-8px_rgba(140,104,54,0.55)] active:translate-y-0 active:scale-[0.97]"
      >
        Send via WhatsApp
        <PaperPlaneTilt
          size={16}
          weight="bold"
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </button>

      {sent && (
        <p className="text-sm text-muted">
          WhatsApp opened in a new tab with your message. Did not go through?
          Copy the message and send it to our number manually.
        </p>
      )}
    </form>
  );
}
