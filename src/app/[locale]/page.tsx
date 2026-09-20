import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Search,
  Sparkles,
  Store,
  Tag,
  Megaphone,
  Globe,
  BookOpen,
} from "lucide-react";
import ShopCard from "@/components/ShopCard";
import OfferCard from "@/components/OfferCard";
import CategoryRail from "@/components/CategoryRail";
import { offers, shops } from "@/lib/data";
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
  return { title: `${t("title")} — ${t("tagline")}`, description: t("heroSubtitle") };
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

  const featured = shops.filter((s) => s.featured);
  const topOffers = [...offers].sort((a, b) => b.discount - a.discount).slice(0, 3);

  const stats = [
    { value: shops.length, label: t("statShops") },
    { value: offers.length, label: t("statOffers") },
    { value: 3, label: t("statAreas") },
  ];

  const consultancyTeasers = [
    { Icon: Megaphone, label: tc("adCreationTitle") },
    { Icon: Sparkles, label: tc("aiAdTitle") },
    { Icon: Globe, label: tc("websiteTitle") },
    { Icon: BookOpen, label: tc("guideTitle") },
  ];

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white">
        <div
          className="pointer-events-none absolute -end-24 -top-24 h-96 w-96 rounded-full bg-brand-400/25 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -start-16 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {t("nearYou")} — Dhaka
          </p>

          <h1 className="mt-5 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-50 sm:text-base">
            {t("heroSubtitle")}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={`/${locale}/search/`}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-brand-800 shadow-lg transition-transform hover:scale-[1.03]"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              {t("heroSearchCta")}
            </Link>
            <Link
              href={`/${locale}/offers/`}
              className="inline-flex items-center gap-2 rounded-2xl bg-accent-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.03]"
            >
              <Tag className="h-4 w-4" aria-hidden="true" />
              {t("heroOffersCta")}
            </Link>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-xs font-semibold uppercase tracking-wider text-brand-100">
                  {s.label}
                </dt>
                <dd className="text-2xl font-black">
                  {formatNumber(s.value, locale)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Deals near you                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeading
          title={t("dealsNearYou")}
          href={`/${locale}/offers/`}
          linkLabel={t("viewAll")}
          Icon={Tag}
        />
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
      {/* Categories                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="mb-4 text-xl font-black tracking-tight">
          {t("categories")}
        </h2>
        <CategoryRail locale={locale} />
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Business consultancy — the services most owners never discover    */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="relative overflow-hidden rounded-4xl border border-[var(--border-subtle)] bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 p-7 text-white sm:p-10">
          <div
            className="pointer-events-none absolute -end-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {tc("navTitle")}
            </p>
            <h2 className="mt-4 text-2xl font-black leading-tight sm:text-3xl">
              {t("growBusiness")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-violet-100">
              {t("growBusinessDesc")}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {consultancyTeasers.map(({ Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/12 px-3 py-2 text-xs font-bold backdrop-blur-sm"
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>

            <Link
              href={`/${locale}/consultancy/`}
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-violet-800 shadow-lg transition-transform hover:scale-[1.03]"
            >
              {t("exploreConsultancy")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Featured shops                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <SectionHeading
          title={t("featuredShops")}
          href={`/${locale}/search/`}
          linkLabel={t("viewAll")}
          Icon={Store}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((shop) => (
            <ShopCard key={shop.id} shop={shop} locale={locale} />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Shop owner CTA                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="surface flex flex-col items-start gap-5 rounded-4xl p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div className="max-w-xl space-y-2">
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              {t("registerCTA")}
            </h2>
            <p className="text-sm muted">{t("registerDesc")}</p>
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

function SectionHeading({
  title,
  href,
  linkLabel,
  Icon,
}: {
  title: string;
  href: string;
  linkLabel: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="flex items-center gap-2 text-xl font-black tracking-tight">
        <Icon className="h-5 w-5 text-accent-500" aria-hidden={true} />
        {title}
      </h2>
      <Link
        href={href}
        className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700"
      >
        {linkLabel}
        <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
      </Link>
    </div>
  );
}
