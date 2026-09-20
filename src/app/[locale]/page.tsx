import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Check,
  Search,
  Store,
  TrendingUp,
  Trophy,
} from "lucide-react";
import OfferCard from "@/components/OfferCard";
import CategoryRail from "@/components/CategoryRail";
import LeaderboardBoard from "@/components/Leaderboard";
import ConsultancyWizard from "@/components/ConsultancyWizard";
import ServiceIcon from "@/components/ServiceIcon";
import { consultancyServices, offers, shops, trendingScore } from "@/lib/data";
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
  const t = getTranslator(l, "Index");
  return {
    title: `${t("title")} — ${t("tagline")}`,
    description: t("heroSubtitle"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const t = getTranslator(locale, "Index");
  const tc = getTranslator(locale, "Consultancy");
  const tl = getTranslator(locale, "Leaderboard");
  const tw = getTranslator(locale, "Wizard");
  const tn = getTranslator(locale, "Navigation");

  const topOffers = [...offers]
    .sort((a, b) => trendingScore(b.id) - trendingScore(a.id))
    .slice(0, 3);

  const stats = [
    { value: shops.length, label: t("statShops") },
    { value: offers.length, label: t("statOffers") },
    { value: 3, label: t("statAreas") },
  ];

  const wizardStrings = {
    openLabel: tw("openLabel"),
    title: tw("title"),
    intro: tw("intro"),
    q1: tw("q1"),
    q1a: tw("q1a"),
    q1b: tw("q1b"),
    q1c: tw("q1c"),
    q2: tw("q2"),
    q2a: tw("q2a"),
    q2b: tw("q2b"),
    q2c: tw("q2c"),
    q2d: tw("q2d"),
    q3: tw("q3"),
    q3a: tw("q3a"),
    q3b: tw("q3b"),
    q3c: tw("q3c"),
    back: tw("back"),
    next: tw("next"),
    skip: tw("skip"),
    close: tw("close"),
    resultTitle: tw("resultTitle"),
    resultWhy: tw("resultWhy"),
    seeService: tw("seeService"),
    startOver: tw("startOver"),
    browsing: tw("browsing"),
    seeOffers: tw("seeOffers"),
    step: tw("step"),
  };

  const wizardServices = consultancyServices.map((service) => ({
    id: service.id,
    title: tc(service.titleKey),
    description: tc(service.descKey),
    icon: service.icon,
    accent: service.accent,
  }));

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Hero: say what this is, then let people search                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white">
        <div
          className="pointer-events-none absolute -end-32 -top-32 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-12 sm:pb-12 sm:pt-16">
          <h1 className="max-w-3xl text-3xl font-black leading-[1.15] tracking-tight sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-50 sm:text-base">
            {t("heroSubtitle")}
          </p>

          {/* Search is the primary action, so it gets the primary element. */}
          <Link
            href={`/${locale}/search/`}
            className="mt-7 flex max-w-xl items-center gap-3 rounded-2xl bg-white p-2 ps-4 shadow-xl transition-transform hover:scale-[1.01]"
          >
            <Search
              className="h-5 w-5 shrink-0 text-zinc-400"
              aria-hidden="true"
            />
            <span className="flex-1 truncate py-2 text-sm text-zinc-500">
              {t("searchPlaceholder")}
            </span>
            <span className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white">
              {t("searchAction")}
            </span>
          </Link>

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <dd className="text-xl font-black">
                  {formatNumber(s.value, locale)}
                </dd>
                <dt className="text-xs font-semibold text-brand-100">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Categories, right under the hero where they get used              */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-[var(--border-subtle)] bg-[var(--surface-card)]">
        <div className="mx-auto max-w-6xl px-4 py-7">
          <h2 className="mb-4 text-sm font-black uppercase tracking-wider muted">
            {t("browseCategories")}
          </h2>
          <CategoryRail locale={locale} />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Leaderboard, high on the page and flattened to a ranked list      */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-4">
          <h2 className="flex items-center gap-2 text-xl font-black tracking-tight sm:text-2xl">
            <Trophy className="h-5 w-5 text-accent-600" aria-hidden="true" />
            {tl("topThisWeek")}
          </h2>
          <p className="mt-1 text-sm muted">{tl("topThisWeekSub")}</p>
        </div>
        <LeaderboardBoard locale={locale} limit={5} showHow={false} compact />
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Trending offers                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-black tracking-tight sm:text-2xl">
              <TrendingUp
                className="h-5 w-5 text-accent-600"
                aria-hidden="true"
              />
              {t("trendingNow")}
            </h2>
            <p className="mt-1 text-sm muted">{t("trendingNowSub")}</p>
          </div>
          <Link
            href={`/${locale}/offers/`}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-brand-700 hover:underline dark:text-brand-300"
          >
            {t("viewAll")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topOffers.map((offer, i) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              locale={locale}
              priority={i === 0}
            />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Business services, as a section rather than a banner              */}
      {/* ---------------------------------------------------------------- */}
      <section
        id="business"
        className="border-y border-[var(--border-subtle)] bg-[var(--surface-card)]"
      >
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-14">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-800 dark:bg-violet-950/60 dark:text-violet-200">
                <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                {t("forShopOwners")}
              </p>
              <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                {t("servicesLead")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed muted">
                {t("growBusinessDesc")}
              </p>
            </div>

            <ConsultancyWizard
              locale={locale}
              autoOpen
              t={wizardStrings}
              services={wizardServices}
            />
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {consultancyServices.map((service) => (
              <li key={service.id}>
                <Link
                  href={`/${locale}/consultancy/${service.id}/`}
                  className="card-interactive surface flex h-full flex-col rounded-3xl p-5"
                >
                  <ServiceIcon icon={service.icon} accent={service.accent} />
                  <span className="mt-3.5 flex items-center gap-2">
                    <span className="font-bold">{tc(service.titleKey)}</span>
                    {service.popular && (
                      <span className="rounded-lg bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-800 dark:bg-violet-950 dark:text-violet-200">
                        {tc("popular")}
                      </span>
                    )}
                  </span>
                  <span className="mt-1.5 line-clamp-3 flex-1 text-xs leading-relaxed muted">
                    {tc(service.descKey)}
                  </span>
                  <span className="mt-4 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
                    <span className="text-sm font-black">
                      {locale === "bn" ? service.priceBn : service.priceEn}
                      {service.priceUnit === "perMonth" && (
                        <span className="text-xs font-normal muted">
                          {tc("perMonth")}
                        </span>
                      )}
                    </span>
                    <ArrowRight
                      className="h-4 w-4 muted rtl:rotate-180"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={`/${locale}/consultancy/`}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:underline dark:text-brand-300"
          >
            {t("seeAllServices")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Register CTA                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="surface flex flex-col items-start gap-5 rounded-4xl p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div className="max-w-xl space-y-2">
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              {t("registerCTA")}
            </h2>
            <p className="text-sm muted">{t("registerDesc")}</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs muted">
              {[tn("offers"), tn("leaderboard"), tn("consultancy")].map(
                (item) => (
                  <li key={item} className="inline-flex items-center gap-1.5">
                    <Check
                      className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
          <Link
            href={`/${locale}/login/`}
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.03]"
          >
            <Store className="h-4 w-4" aria-hidden="true" />
            {t("registerCTA")}
          </Link>
        </div>
      </section>
    </>
  );
}
