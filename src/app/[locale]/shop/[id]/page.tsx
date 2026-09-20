import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Star,
  Tag,
} from "lucide-react";
import {
  getShop,
  offersForShop,
  offerTitle,
  shopAddress,
  shopDescription,
  shopName,
  shops,
} from "@/lib/data";
import {
  formatNumber,
  getTranslator,
  isLocale,
  locales,
  type Locale,
} from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    shops.map((shop) => ({ locale, id: String(shop.id) })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const l = isLocale(locale) ? (locale as Locale) : "bn";
  const shop = getShop(Number(id));
  if (!shop) return {};
  return {
    title: `${shopName(shop, l)} — ${getTranslator(l, "Common")("titleSuffix")}`,
    description: shopDescription(shop, l),
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const shop = getShop(Number(id));
  if (!shop) notFound();

  const t = getTranslator(locale, "Shop");
  const tCat = getTranslator(locale, "Category");
  const tOffers = getTranslator(locale, "Offers");
  const shopOffers = offersForShop(shop.id);

  const actions = [
    {
      href: `tel:${shop.phone}`,
      label: t("call"),
      Icon: Phone,
      className: "bg-brand-600 text-white hover:bg-brand-700",
    },
    {
      href: `https://wa.me/${shop.whatsapp}`,
      label: t("whatsapp"),
      Icon: MessageCircle,
      className: "bg-[#25D366] text-zinc-950 hover:brightness-95",
    },
    {
      href: `https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lng}`,
      label: t("directions"),
      Icon: Navigation,
      className: "surface hover:bg-[var(--surface-muted)]",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link
        href={`/${locale}/search/`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold muted hover:text-brand-600 dark:hover:text-brand-400"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        {t("backToSearch")}
      </Link>

      {/* Hero image */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-3xl sm:aspect-[21/9]">
        <Image
          src={shop.image}
          alt={shopName(shop, locale)}
          fill
          priority
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5 text-white">
          <div className="space-y-1.5">
            <span className="inline-block rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm">
              {tCat(shop.category)}
            </span>
            <h1 className="text-2xl font-black leading-tight drop-shadow-sm sm:text-3xl">
              {shopName(shop, locale)}
            </h1>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              shop.openNow ? "bg-brand-600" : "bg-zinc-800"
            }`}
          >
            {shop.openNow ? t("openNow") : t("closed")}
          </span>
        </div>
      </div>

      {/* Meta row */}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <span className="flex items-center gap-1.5 font-bold">
          <Star
            className="h-4 w-4 fill-accent-400 text-accent-400"
            aria-hidden="true"
          />
          {formatNumber(shop.rating, locale)}
          <span className="font-normal muted">
            ({formatNumber(shop.reviewCount, locale)} {t("reviews")})
          </span>
        </span>
        {shop.verified && (
          <span className="inline-flex items-center gap-1.5 font-semibold text-brand-700 dark:text-brand-300">
            <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            {t("verified")}
          </span>
        )}
        <span className="flex items-center gap-1.5 muted">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {t("openingHours")}: {shop.hours}
        </span>
      </div>

      <p className="mt-2 flex items-start gap-1.5 text-sm muted">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {shopAddress(shop, locale)}
      </p>

      {/* Actions */}
      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {actions.map(({ href, label, Icon, className }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className={`inline-flex flex-col items-center justify-center gap-1.5 rounded-2xl px-3 py-3.5 text-xs font-bold transition-colors sm:flex-row sm:text-sm ${className}`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </a>
        ))}
      </div>

      {/* About */}
      <section className="surface mt-6 rounded-3xl p-5">
        <h2 className="mb-2 text-sm font-black uppercase tracking-wider muted">
          {t("about")}
        </h2>
        <p className="text-sm leading-relaxed">
          {shopDescription(shop, locale)}
        </p>
      </section>

      {/* Offers */}
      <section className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-black tracking-tight">
          <Tag className="h-5 w-5 text-accent-500" aria-hidden="true" />
          {t("offers")}
        </h2>
        {shopOffers.length === 0 ? (
          <p className="surface rounded-3xl px-5 py-10 text-center text-sm muted">
            {t("noOffers")}
          </p>
        ) : (
          <ul className="space-y-3">
            {shopOffers.map((offer) => (
              <li
                key={offer.id}
                className="surface flex items-center justify-between gap-4 rounded-3xl p-5"
              >
                <div className="min-w-0 space-y-1">
                  <p className="font-bold leading-snug">
                    {offerTitle(offer, locale)}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs muted">
                    <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                    {tOffers("validUntil")}: {offer.validUntil}
                  </p>
                </div>
                <span className="shrink-0 rounded-2xl bg-accent-700 px-3 py-2 text-sm font-black text-white">
                  {formatNumber(offer.discount, locale)}% {t("off")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Services */}
      {shop.services.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-black tracking-tight">
            {t("services")}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {shop.services.map((service) => (
              <li key={service.id} className="surface rounded-2xl p-4">
                <p className="text-sm font-bold">{t(service.id)}</p>
                <p className="mt-0.5 text-xs muted">
                  {locale === "bn" ? service.noteBn : service.noteEn}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
