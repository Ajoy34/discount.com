import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, ShieldCheck, Star, Tag, X } from "lucide-react";
import { shops } from "@/lib/data";
import { getTranslator, isLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? (locale as Locale) : "bn";
  return { title: `${getTranslator(l, "Admin")("title")} — ${getTranslator(l, "Common")("titleSuffix")}` };
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const t = getTranslator(locale, "Admin");
  const tCommon = getTranslator(locale, "Common");
  const pending = shops.filter((s) => !s.verified);
  const featuredRequests = shops.filter((s) => !s.featured).slice(0, 2);

  const sections = [
    {
      heading: t("pendingShops"),
      Icon: ShieldCheck,
      rows: pending,
      actionable: true,
    },
    {
      heading: t("featuredRequests"),
      Icon: Star,
      rows: featuredRequests,
      actionable: true,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight sm:text-3xl">
          <ShieldCheck className="h-6 w-6 text-brand-600" aria-hidden="true" />
          {t("title")}
        </h1>
        <p className="mt-1 text-sm muted">{t("verificationQueue")}</p>
      </header>

      <div className="space-y-8">
        {sections.map(({ heading, Icon, rows, actionable }) => (
          <section key={heading}>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <Icon className="h-5 w-5 muted" aria-hidden="true" />
              {heading}
              <span className="rounded-lg bg-[var(--surface-muted)] px-2 py-0.5 text-xs font-bold muted">
                {rows.length}
              </span>
            </h2>

            {rows.length === 0 ? (
              <p className="surface rounded-3xl px-5 py-10 text-center text-sm muted">
                {tCommon("comingSoon")}
              </p>
            ) : (
              <ul className="space-y-3">
                {rows.map((shop) => (
                  <li
                    key={shop.id}
                    className="surface flex flex-col gap-3 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-bold">
                        {locale === "bn" ? shop.nameBn : shop.nameEn}
                      </p>
                      <p className="text-xs muted">
                        {locale === "bn" ? shop.addressBn : shop.addressEn}
                      </p>
                    </div>
                    {actionable && (
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
                        >
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          {t("approve")}
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--surface-muted)] px-4 py-2 text-xs font-bold hover:bg-[var(--border-subtle)]"
                        >
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                          {t("reject")}
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Tag className="h-5 w-5 muted" aria-hidden="true" />
            {t("offerModeration")}
          </h2>
          <p className="surface rounded-3xl px-5 py-10 text-center text-sm muted">
            {tCommon("comingSoon")}
          </p>
        </section>
      </div>

      <p className="mt-10 text-center text-xs muted">{tCommon("demoData")}</p>
    </div>
  );
}
