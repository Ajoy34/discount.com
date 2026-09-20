"use client";

import { useState } from "react";
import { AlertCircle, Mail, MessageCircle, Phone } from "lucide-react";
import {
  composeRequest,
  contact,
  displayPhone,
  emailHref,
  telHref,
  whatsappHref,
} from "@/lib/contact";
import type { Locale } from "@/lib/i18n";

interface Strings {
  formName: string;
  formShop: string;
  formPhone: string;
  formService: string;
  formMessage: string;
  formNote: string;
  formIncomplete: string;
  requestHeading: string;
  emailSubject: string;
  msgName: string;
  msgShop: string;
  msgPhone: string;
  msgService: string;
  msgDetails: string;
  sendViaWhatsapp: string;
  sendViaEmail: string;
  orDivider: string;
  contactDirect: string;
  callUs: string;
  emailUs: string;
  options: { id: string; label: string }[];
}

/**
 * A statically exported site has no server to post to, so the request is
 * assembled in the browser and handed to WhatsApp or the person's mail client.
 * Nothing is stored here and nothing is sent without them pressing send.
 */
export default function ConsultancyForm({
  locale,
  t,
}: {
  locale: Locale;
  t: Strings;
}) {
  const [name, setName] = useState("");
  const [shop, setShop] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(t.options[0]?.label ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const complete = name.trim().length > 1 && phone.trim().length >= 6;

  const body = () =>
    composeRequest(
      { name, shop, phone, service, message },
      {
        heading: t.requestHeading,
        name: t.msgName,
        shop: t.msgShop,
        phone: t.msgPhone,
        service: t.msgService,
        message: t.msgDetails,
      },
    );

  const send = (kind: "whatsapp" | "email") => {
    if (!complete) {
      setError(true);
      return;
    }
    setError(false);
    if (kind === "whatsapp") {
      window.open(whatsappHref(body()), "_blank", "noopener,noreferrer");
    } else {
      // A mailto: handed to window.open can leave an empty tab behind.
      window.location.href = emailHref(t.emailSubject, body());
    }
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="name"
          label={t.formName}
          value={name}
          onChange={setName}
          autoComplete="name"
          required
        />
        <Field
          id="shop"
          label={t.formShop}
          value={shop}
          onChange={setShop}
          autoComplete="organization"
        />
      </div>

      <Field
        id="phone"
        label={t.formPhone}
        value={phone}
        onChange={setPhone}
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
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="surface w-full rounded-2xl px-4 py-3 text-sm outline-none"
        >
          {t.options.map((o) => (
            <option key={o.id} value={o.label}>
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="surface w-full resize-y rounded-2xl px-4 py-3 text-sm outline-none"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-300"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {t.formIncomplete}
        </p>
      )}

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={() => send("whatsapp")}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3.5 text-sm font-bold text-zinc-950 transition-[filter] hover:brightness-95"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          {t.sendViaWhatsapp}
        </button>

        <span className="self-center text-xs muted sm:px-1">
          {t.orDivider}
        </span>

        <button
          type="button"
          onClick={() => send("email")}
          className="surface inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold transition-colors hover:bg-[var(--surface-muted)]"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          {t.sendViaEmail}
        </button>
      </div>

      <p className="text-xs muted">{t.formNote}</p>

      {/* Direct routes, for anyone who would rather not fill in a form. */}
      <div className="border-t border-[var(--border-subtle)] pt-4">
        <p className="mb-2.5 text-xs font-bold muted">{t.contactDirect}</p>
        <div className="flex flex-wrap gap-2">
          <a
            href={telHref}
            className="surface inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold hover:bg-[var(--surface-muted)]"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {displayPhone(locale)}
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="surface inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold hover:bg-[var(--surface-muted)]"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            {contact.email}
          </a>
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-bold">
        {label}
        {required && (
          <span className="ms-0.5 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        className="surface w-full rounded-2xl px-4 py-3 text-sm outline-none"
      />
    </div>
  );
}
