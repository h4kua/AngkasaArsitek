"use client";

import { useState, type FormEvent } from "react";
import { CaretDown, PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";

interface ContactFormProps {
  whatsappNumber: string;
  serviceOptions: string[];
}

interface FormErrors {
  name?: string;
  email?: string;
  location?: string;
  message?: string;
}

const inputStyles =
  "rounded-xl border border-line/80 bg-surface-raised/60 px-4 py-3 text-sm text-paper placeholder:text-muted transition-colors duration-200 hover:border-muted focus:border-accent focus:outline-none";
const inputErrorStyles = "border-danger focus:border-danger";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm({
  whatsappNumber,
  serviceOptions,
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [projectType, setProjectType] = useState(serviceOptions[0]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!name.trim()) next.name = "Enter your name.";
    if (!email.trim()) next.email = "Enter your email.";
    else if (!EMAIL_PATTERN.test(email.trim()))
      next.email = "Enter a valid email address.";
    if (!location.trim()) next.location = "Enter the project location.";
    if (!message.trim()) next.message = "Tell us a bit about the project.";
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSent(false);
      return;
    }

    setSubmitting(true);
    try {
      const text = [
        `Hello Angkasa Architects, my name is ${name}.`,
        `Email: ${email}`,
        `Project location: ${location}`,
        `I'm interested in ${projectType}.`,
        message,
      ].join("\n");
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  }

  function clearError(field: keyof FormErrors) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearError("name");
          }}
          placeholder="Your full name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`${inputStyles} ${errors.name ? inputErrorStyles : ""}`}
        />
        {errors.name && (
          <p id="name-error" className="text-xs text-danger">
            {errors.name}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError("email");
            }}
            placeholder="you@email.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`${inputStyles} ${errors.email ? inputErrorStyles : ""}`}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-danger">
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="location" className="text-sm font-medium">
            Project Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              clearError("location");
            }}
            placeholder="City or site address"
            aria-invalid={Boolean(errors.location)}
            aria-describedby={errors.location ? "location-error" : undefined}
            className={`${inputStyles} ${errors.location ? inputErrorStyles : ""}`}
          />
          {errors.location && (
            <p id="location-error" className="text-xs text-danger">
              {errors.location}
            </p>
          )}
        </div>
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
          rows={5}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            clearError("message");
          }}
          placeholder="Approximate area and an outline of what you need"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${inputStyles} ${errors.message ? inputErrorStyles : ""}`}
        />
        {errors.message && (
          <p id="message-error" className="text-xs text-danger">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="group inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-medium text-on-accent shadow-[0_0_0_0_rgba(140,104,54,0)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dim hover:shadow-[0_10px_32px_-8px_rgba(140,104,54,0.55)] active:translate-y-0 active:scale-[0.97] disabled:opacity-70"
      >
        {submitting ? "Opening WhatsApp…" : "Send via WhatsApp"}
        <PaperPlaneTilt
          size={16}
          weight="bold"
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </button>

      {sent && (
        <p role="status" className="text-sm text-muted">
          WhatsApp opened in a new tab with your message. Did not go through?
          Copy the message and send it to our number manually.
        </p>
      )}
    </form>
  );
}
