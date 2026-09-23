"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Check,
  CreditCard,
  Landmark,
  Lock,
  Mail,
  MessageCircle,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import {
  composeRequest,
  contact,
  displayPhone,
  emailHref,
  telHref,
  whatsappHref,
} from "@/lib/contact";
import { formatNumber, type Locale } from "@/lib/i18n";

type MethodId = "sslcommerz" | "stripe" | "bank";

interface Strings {
  amountLabel: string;
  amountHint: string;
  amountInvalid: string;
  shopLabel: string;
  nameLabel: string;
  phoneLabel: string;
  methodTitle: string;
  methodSubtitle: string;
  sslTitle: string;
  sslDesc: string;
  stripeTitle: string;
  stripeDesc: string;
  bankTitle: string;
  bankDesc: string;
  selected: string;
  summaryTitle: string;
  summaryBid: string;
  summaryMethod: string;
  summaryPlacement: string;
  continueWhatsapp: string;
  continueEmail: string;
  formIncomplete: string;
  requestHeading: string;
  emailSubject: string;
  msgAmount: string;
  msgMethod: string;
  msgService: string;
  msgDetails: string;
  secureTitle: string;
  secure1: string;
  secure2: string;
  secure3: string;
  noCardNote: string;
}

/**
 * A statically exported site has no server to create a real payment session
 * on, so this page never touches a card number. It settles the shop, the
 * bid and the preferred gateway, then hands the request to WhatsApp or email
 * the same way every other request on Discounty is sent — a human on our
 * side then sends back the real SSLCommerz/Stripe/bank checkout link.
 */
export default function CheckoutClient({
  locale,
  t,
  suggestedAmount,
}: {
  locale: Locale;
  t: Strings;
  suggestedAmount: number;
}) {
  const params = useSearchParams();
  const initialAmount = Number(params.get("amount")) || suggestedAmount;

  const [amount, setAmount] = useState(String(initialAmount));
  const [shop, setShop] = useState(params.get("shop") ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<MethodId>("sslcommerz");
  const [error, setError] = useState(false);

  const amountValue = Number(amount);
  const amountValid = Number.isFinite(amountValue) && amountValue >= 1;
  const complete =
    amountValid &&
    shop.trim().length > 1 &&
    name.trim().length > 1 &&
    phone.trim().length >= 6;

  const methods: {
    id: MethodId;
    icon: typeof ShieldCheck;
    title: string;
    desc: string;
  }[] = [
    { id: "sslcommerz", icon: Smartphone, title: t.sslTitle, desc: t.sslDesc },
    { id: "stripe", icon: CreditCard, title: t.stripeTitle, desc: t.stripeDesc },
    { id: "bank", icon: Landmark, title: t.bankTitle, desc: t.bankDesc },
  ];
  const methodLabel = methods.find((m) => m.id === method)?.title ?? method;

  const taka = (n: number) => `৳${formatNumber(n, locale)}`;

  const body = () =>
    composeRequest(
      {
        name,
        shop,
        phone,
        service: t.summaryPlacement,
        message: `${t.msgAmount}: ${taka(amountValue)}\n${t.msgMethod}: ${methodLabel}`,
      },
      {
        heading: t.requestHeading,
        name: t.nameLabel,
        shop: t.shopLabel,
        phone: t.phoneLabel,
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
      window.location.href = emailHref(t.emailSubject, body());
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="surface rounded-3xl p-5 sm:p-6">
          <label htmlFor="amount" className="block text-sm font-bold">
            {t.amountLabel}
          </label>
          <div className="mt-2 flex items-center gap-2">
            <span
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--surface-muted)] text-lg font-black"
              aria-hidden="true"
            >
              ৳
            </span>
            <input
              id="amount"
              name="amount"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="surface w-full rounded-2xl px-4 py-3 text-xl font-black tabular-nums outline-none"
              aria-describedby="amount-hint"
              aria-invalid={amount.length > 0 && !amountValid}
            />
          </div>
          <p id="amount-hint" className="mt-2 text-xs muted">
            {t.amountHint}
          </p>
          {amount.length > 0 && !amountValid && (
            <p className="mt-1 text-xs font-semibold text-red-700 dark:text-red-300">
              {t.amountInvalid}
            </p>
          )}
        </div>

        <div className="surface rounded-3xl p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="shop" label={t.shopLabel} value={shop} onChange={setShop} autoComplete="organization" required />
            <Field id="name" label={t.nameLabel} value={name} onChange={setName} autoComplete="name" required />
          </div>
          <div className="mt-4">
            <Field id="phone" label={t.phoneLabel} value={phone} onChange={setPhone} type="tel" autoComplete="tel" required />
          </div>
        </div>

        <fieldset className="surface rounded-3xl p-5 sm:p-6">
          <legend className="px-1 text-base font-bold">{t.methodTitle}</legend>
          <p className="mt-0.5 text-xs muted">{t.methodSubtitle}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {methods.map(({ id, icon: Icon, title, desc }) => {
              const active = method === id;
              return (
                <label
                  key={id}
                  className={`relative flex cursor-pointer flex-col gap-2 rounded-2xl border-2 p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[var(--ring-focus)] has-[:focus-visible]:outline-offset-2 ${
                    active
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30"
                      : "border-[var(--border-subtle)] hover:border-brand-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={id}
                    checked={active}
                    onChange={() => setMethod(id)}
                    className="sr-only"
                  />
                  <span className="flex items-center justify-between">
                    <Icon
                      className={`h-5 w-5 ${active ? "text-brand-700 dark:text-brand-300" : "muted"}`}
                      aria-hidden="true"
                    />
                    {active && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        <Check className="h-3 w-3" aria-hidden="true" />
                        {t.selected}
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-bold">{title}</span>
                  <span className="text-xs leading-relaxed muted">{desc}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <p className="flex items-start gap-2.5 rounded-2xl bg-[var(--surface-muted)] px-4 py-3 text-xs leading-relaxed muted">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {t.noCardNote}
        </p>

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
            {t.continueWhatsapp}
          </button>
          <button
            type="button"
            onClick={() => send("email")}
            className="surface inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold transition-colors hover:bg-[var(--surface-muted)]"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {t.continueEmail}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-[var(--border-subtle)] pt-4">
          <a
            href={telHref}
            className="surface inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold hover:bg-[var(--surface-muted)]"
          >
            {displayPhone(locale)}
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="surface inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold hover:bg-[var(--surface-muted)]"
          >
            {contact.email}
          </a>
        </div>
      </form>

      <aside className="h-fit space-y-4">
        <div className="surface rounded-3xl p-5">
          <h2 className="text-sm font-bold">{t.summaryTitle}</h2>
          <dl className="mt-3 space-y-2.5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="muted">{t.summaryPlacement}</dt>
              <dd className="font-bold">1 {locale === "bn" ? "সপ্তাহ" : "week"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="muted">{t.summaryBid}</dt>
              <dd className="font-black tabular-nums">
                {amountValid ? taka(amountValue) : "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-2.5">
              <dt className="muted">{t.summaryMethod}</dt>
              <dd className="font-bold">{methodLabel}</dd>
            </div>
          </dl>
        </div>

        <div className="surface rounded-3xl p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <ShieldCheck className="h-4 w-4 text-brand-600" aria-hidden="true" />
            {t.secureTitle}
          </h2>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed muted">
            {[t.secure1, t.secure2, t.secure3].map((line) => (
              <li key={line} className="flex gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
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
