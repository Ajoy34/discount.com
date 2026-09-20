import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Eye,
  MousePointerClick,
  Plus,
  Store,
  Tag,
} from "lucide-react";
import ServiceIcon from "@/components/ServiceIcon";
import { consultancyServices, getShop } from "@/lib/data";
import {
  formatNumber,
  getTranslator,
  isLocale,
  locales,
  type Locale,
} from "@/lib/i18n";

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
  return { title: `${getTranslator(l, "Dashboard")("title")} — ${getTranslator(l, "Common")("titleSuffix")}` };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const t = getTranslator(locale, "Dashboard");
  const tc = getTranslator(locale, "Consultancy");
  const tCommon = getTranslator(locale, "Common");
  const shop = getShop(1);

  const stats = [
    {
      label: t("profileViews"),
      value: 1248,
      delta: "+12%",
      Icon: Eye,
      tint: "bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-300",
    },
    {
      label: t("callClicks"),
      value: 84,
      delta: "+5%",
      Icon: MousePointerClick,
      tint: "bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-300",
    },
    {
      label: t("activeOffers"),
      value: 1,
      delta: null,
      Icon: Tag,
      tint: "bg-accent-50 text-accent-600 dark:bg-accent-900/40 dark:text-accent-300",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm muted">{t("subtitle")}</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t("addShop")}
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, delta, Icon, tint }) => (
          <div key={label} className="surface rounded-3xl p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold muted">{label}</span>
              <span className={`rounded-xl p-2 ${tint}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
            <p className="text-3xl font-black">{formatNumber(value, locale)}</p>
            {delta ? (
              <span className="mt-1 inline-block text-xs font-semibold text-brand-600 dark:text-brand-400">
                ↑ {delta} {t("last30Days")}
              </span>
            ) : (
              <span className="mt-1 inline-block text-xs muted">
                {t("offersRunning", { count: formatNumber(value, locale) })}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* My shops */}
      <h2 className="mb-4 text-xl font-bold">{t("myShops")}</h2>
      {shop && (
        <div className="surface mb-10 flex flex-col items-center justify-between gap-4 rounded-3xl p-5 sm:flex-row">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              <Store className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-lg font-bold">
                {locale === "bn" ? shop.nameBn : shop.nameEn}
              </h3>
              <p className="text-xs muted">
                {locale === "bn" ? shop.addressBn : shop.addressEn} •{" "}
                {getTranslator(locale, "Shop")("verified")}
              </p>
            </div>
          </div>
          <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
            <Link
              href={`/${locale}/shop/${shop.id}/`}
              className="rounded-xl bg-[var(--surface-muted)] px-4 py-2 text-xs font-bold hover:bg-[var(--border-subtle)]"
            >
              {t("viewProfile")}
            </Link>
            <button
              type="button"
              className="rounded-xl bg-accent-700 px-4 py-2 text-xs font-bold text-white hover:bg-accent-800"
            >
              {t("postOffer")}
            </button>
          </div>
        </div>
      )}

      {/* Consultancy entry points — previously absent from the product */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{t("growTitle")}</h2>
            <p className="mt-1 text-sm muted">{t("growDesc")}</p>
          </div>
          <Link
            href={`/${locale}/consultancy/`}
            className="hidden shrink-0 items-center gap-1 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 sm:inline-flex"
          >
            {tc("learnMore")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {consultancyServices.map((service) => (
            <li key={service.id}>
              <Link
                href={`/${locale}/consultancy/${service.id}/`}
                className="card-interactive surface flex h-full items-start gap-4 rounded-3xl p-5"
              >
                <ServiceIcon
                  icon={service.icon}
                  accent={service.accent}
                  className="h-11 w-11 shrink-0"
                />
                <span className="min-w-0 space-y-1">
                  <span className="flex items-center gap-2">
                    <span className="font-bold">{tc(service.titleKey)}</span>
                    {service.popular && (
                      <span className="rounded-lg bg-accent-100 px-1.5 py-0.5 text-[10px] font-bold text-accent-700 dark:bg-accent-900/50 dark:text-accent-300">
                        {tc("popular")}
                      </span>
                    )}
                  </span>
                  <span className="line-clamp-2 block text-xs muted">
                    {tc(service.descKey)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-center text-xs muted">{tCommon("demoData")}</p>
    </div>
  );
}
