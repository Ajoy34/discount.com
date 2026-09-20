"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, ShoppingBag, Store } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface Strings {
  title: string;
  phone: string;
  phonePlaceholder: string;
  sendCode: string;
  verifyCode: string;
  codePlaceholder: string;
  iAmCustomer: string;
  iAmOwner: string;
  findShops: string;
  manageShop: string;
  wrongNumber: string;
  chooseRole: string;
  terms: string;
  brand: string;
}

type Role = "customer" | "owner";

export default function LoginClient({
  locale,
  t,
}: {
  locale: Locale;
  t: Strings;
}) {
  const [role, setRole] = useState<Role>("owner");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const roles = [
    {
      id: "customer" as const,
      label: t.iAmCustomer,
      desc: t.findShops,
      Icon: ShoppingBag,
    },
    {
      id: "owner" as const,
      label: t.iAmOwner,
      desc: t.manageShop,
      Icon: Store,
    },
  ];

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <p className="text-2xl font-black tracking-tight">
          {t.brand}
          <span className="text-brand-600 dark:text-brand-400">.</span>
        </p>
        <h1 className="mt-3 text-xl font-black">{t.title}</h1>
      </div>

      {step === "phone" ? (
        <div className="space-y-6">
          <fieldset className="space-y-3">
            <legend className="mb-3 text-sm font-bold">{t.chooseRole}</legend>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(({ id, label, desc, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRole(id)}
                  aria-pressed={role === id}
                  className={`rounded-3xl border-2 p-4 text-start transition-colors ${
                    role === id
                      ? "border-brand-600 bg-brand-50 dark:bg-brand-950/50"
                      : "border-[var(--border-subtle)] hover:bg-[var(--surface-muted)]"
                  }`}
                >
                  <Icon
                    className={`mb-2 h-6 w-6 ${
                      role === id ? "text-brand-600 dark:text-brand-400" : "muted"
                    }`}
                    aria-hidden="true"
                  />
                  <p className="text-sm font-bold leading-snug">{label}</p>
                  <p className="mt-0.5 text-xs muted">{desc}</p>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-bold">
              {t.phone}
            </label>
            <div className="surface flex items-center gap-2 rounded-2xl px-4 py-3">
              <Phone className="h-4 w-4 shrink-0 muted" aria-hidden="true" />
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep("code")}
            disabled={phone.trim().length < 6}
            className="w-full rounded-2xl bg-brand-600 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.sendCode}
          </button>

          <p className="text-center text-xs muted">{t.terms}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => setStep("phone")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold muted hover:text-brand-600 dark:hover:text-brand-400"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            {t.wrongNumber}
          </button>

          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-bold">
              {t.verifyCode}
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder={t.codePlaceholder}
              className="surface w-full rounded-2xl px-4 py-3.5 text-center text-lg font-black tracking-[0.5em] outline-none"
            />
          </div>

          <Link
            href={
              role === "owner" ? `/${locale}/dashboard/` : `/${locale}/search/`
            }
            className="block w-full rounded-2xl bg-brand-600 px-5 py-3.5 text-center text-sm font-bold text-white hover:bg-brand-700"
          >
            {t.verifyCode}
          </Link>
        </div>
      )}
    </div>
  );
}
