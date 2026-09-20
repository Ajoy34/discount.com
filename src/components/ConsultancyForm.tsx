"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

interface Strings {
  formName: string;
  formShop: string;
  formPhone: string;
  formService: string;
  formMessage: string;
  formSubmit: string;
  formNote: string;
  formSuccess: string;
  options: { id: string; label: string }[];
}

/**
 * There is no backend yet, so this validates and acknowledges locally and says
 * so plainly rather than pretending a request was filed.
 */
export default function ConsultancyForm({ t }: { t: Strings }) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p
        role="status"
        className="mt-6 flex items-center gap-2.5 rounded-2xl bg-brand-50 px-4 py-4 text-sm font-semibold text-brand-800 dark:bg-brand-950/60 dark:text-brand-200"
      >
        <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
        {t.formSuccess}
      </p>
    );
  }

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label={t.formName} autoComplete="name" required />
        <Field id="shop" label={t.formShop} autoComplete="organization" />
      </div>

      <Field
        id="phone"
        label={t.formPhone}
        type="tel"
        autoComplete="tel"
        required
      />

      <div className="space-y-1.5">
        <label htmlFor="service" className="block text-sm font-bold">
          {t.formService}
        </label>
        <select
          id="service"
          name="service"
          className="surface w-full rounded-2xl px-4 py-3 text-sm outline-none"
        >
          {t.options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="block text-sm font-bold">
          {t.formMessage}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="surface w-full resize-y rounded-2xl px-4 py-3 text-sm outline-none"
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-700 sm:w-auto"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {t.formSubmit}
      </button>

      <p className="text-xs muted">{t.formNote}</p>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-bold">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="surface w-full rounded-2xl px-4 py-3 text-sm outline-none"
      />
    </div>
  );
}
