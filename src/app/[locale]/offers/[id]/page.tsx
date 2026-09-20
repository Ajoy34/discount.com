import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  CalendarClock,
  Eye,
  MapPin,
  MessageCircle,
  MousePointerClick,
  Navigation,
  Phone,
  ShieldCheck,
  ShieldX,
  Store,
} from "lucide-react";
import OfferMap from "@/components/OfferMap";
import ReviewSection from "@/components/ReviewSection";
import {
  getOffer,
  getShop,
  offerSignals,
  offerTitle,
  offers,
  reviewsForOffer,
  shopAddress,
  shopName,
  trustScore,
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
    offers.map((offer) => ({ locale, id: String(offer.id) })),
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
  const offer = getOffer(Number(id));
  if (!offer) return {};
  const shop = getShop(offer.shopId);
  return {
    title: `${offerTitle(offer, l)} — ${getTranslator(l, "Common")("titleSuffix")}`,
    description: shop ? shopName(shop, l) : undefined,
  };
}

export default async function OfferPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const offer = getOffer(Number(id));
  if (!offer) notFound();
  const shop = getShop(offer.shopId);
  if (!shop) notFound();

  const t = getTranslator(locale, "Offers");
  const tShop = getTranslator(locale, "Shop");
  const tCat = getTranslator(locale, "Category");
  const tReviews = getTranslator(locale, "Reviews");

  const signals = offerSignals(offer.id);
  const trust = trustScore(offer.id);
  const seed = reviewsForOffer(offer.id);

  const stats = [
    { label: t("views"), value: signals.views, Icon: Eye },
    { label: t("claims"), value: signals.claims, Icon: MousePointerClick },
    { label: t("saves"), value: signals.saves, Icon: Bookmark },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link
        href={`/${locale}/offers/`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold muted hover:text-brand-600 dark:hover:text-brand-400"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        {t("backToOffers")}
      </Link>

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
          className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/25 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 space-y-2 p-5 text-white">
          <span className="inline-block rounded-full bg-accent-700 px-3 py-1 text-xs font-black">
            {formatNumber(offer.discount, locale)}% {tShop("off")}
          </span>
          <h1 className="text-2xl font-black leading-tight drop-shadow-sm sm:text-3xl">
            {offerTitle(offer, locale)}
          </h1>
          <p className="flex items-center gap-1.5 text-sm text-zinc-200">
            <Store className="h-4 w-4 shrink-0" aria-hidden="true" />
            <Link href={`/${locale}/shop/${shop.id}/`} className="hover:underline">
              {shopName(shop, locale)}
            </Link>
            <span aria-hidden="true">·</span>
            <span>{tCat(shop.category)}</span>
          </p>
        </div>
      </div>

      {/* Trust */}
      <section className="surface mt-6 rounded-3xl p-5 sm:p-6">
        <h2 className="text-sm font-black uppercase tracking-wider muted">
          {t("howItPerformed")}
        </h2>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="min-w-[10rem] flex-1">
            <p className="mb-1.5 flex items-center justify-between text-sm font-bold">
              <span>{t("trustScore")}</span>
              <span>
                {trust > 0 ? `${formatNumber(trust, locale)}%` : "—"}
              </span>
            </p>
            <div
              className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]"
              role="img"
              aria-label={`${t("trustScore")}: ${trust}%`}
            >
              <div
                className={`h-full rounded-full ${
                  trust >= 80
                    ? "bg-brand-600"
                    : trust >= 50
                      ? "bg-accent-600"
                      : "bg-red-600"
                }`}
                style={{ width: `${trust}%` }}
              />
            </div>
            <p className="mt-2 text-xs muted">{t("trustExplain")}</p>
          </div>

          <ul className="space-y-1.5 text-sm">
            <li className="flex items-center gap-2 font-semibold text-brand-700 dark:text-brand-300">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {t("confirmedBy", {
                count: formatNumber(signals.confirmed, locale),
              })}
            </li>
            <li className="flex items-center gap-2 font-semibold text-red-700 dark:text-red-300">
              <ShieldX className="h-4 w-4" aria-hidden="true" />
              {t("disputedBy", {
                count: formatNumber(signals.disputed, locale),
              })}
            </li>
          </ul>
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-[var(--border-subtle)] pt-5">
          {stats.map(({ label, value, Icon }) => (
            <div key={label}>
              <dt className="flex items-center gap-1.5 text-xs muted">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </dt>
              <dd className="mt-0.5 text-xl font-black">
                {formatNumber(value, locale)}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Shop and actions */}
      <section className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="surface rounded-3xl p-5">
          <h2 className="mb-2 text-sm font-black uppercase tracking-wider muted">
            {t("aboutOffer")}
          </h2>
          <p className="flex items-start gap-1.5 text-sm muted">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {shopAddress(shop, locale)}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm muted">
            <CalendarClock className="h-4 w-4 shrink-0" aria-hidden="true" />
            {t("validUntil")}: {offer.validUntil}
          </p>
          {shop.verified && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 dark:text-brand-300">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              {tShop("verified")}
            </p>
          )}

          <div className="mt-4 grid grid-cols-3 gap-2">
            <a
              href={`tel:${shop.phone}`}
              className="inline-flex flex-col items-center justify-center gap-1 rounded-2xl bg-brand-600 px-2 py-3 text-xs font-bold text-white hover:bg-brand-700"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {tShop("call")}
            </a>
            <a
              href={`https://wa.me/${shop.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-col items-center justify-center gap-1 rounded-2xl bg-[#25D366] px-2 py-3 text-xs font-bold text-zinc-950 hover:brightness-95"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {tShop("whatsapp")}
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="surface inline-flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-xs font-bold hover:bg-[var(--surface-muted)]"
            >
              <Navigation className="h-4 w-4" aria-hidden="true" />
              {tShop("directions")}
            </a>
          </div>
        </div>

        <div>
          <OfferMap
            height="100%"
            zoom={13}
            emptyLabel={t("noLocation")}
            points={[
              {
                id: offer.id,
                lat: shop.lat,
                lng: shop.lng,
                title: offerTitle(offer, locale),
                subtitle: shopName(shop, locale),
                badge: `${offer.discount}%`,
                href: `/discount.com/${locale}/shop/${shop.id}/`,
              },
            ]}
          />
        </div>
      </section>

      <ReviewSection
        offerId={offer.id}
        seed={seed}
        locale={locale}
        t={{
          title: tReviews("title"),
          subtitle: tReviews("subtitle"),
          writeTitle: tReviews("writeTitle"),
          yourName: tReviews("yourName"),
          yourRating: tReviews("yourRating"),
          star: tReviews("star"),
          stars: tReviews("stars"),
          yourReview: tReviews("yourReview"),
          wasHonoured: tReviews("wasHonoured"),
          yes: tReviews("yes"),
          no: tReviews("no"),
          submit: tReviews("submit"),
          posted: tReviews("posted"),
          localOnly: tReviews("localOnly"),
          incomplete: tReviews("incomplete"),
          none: tReviews("none"),
          helpful: tReviews("helpful"),
          honoured: tReviews("honoured"),
          notHonoured: tReviews("notHonoured"),
          yours: tReviews("yours"),
          averageOf: tReviews("averageOf"),
          delete: tReviews("delete"),
        }}
      />
    </div>
  );
}
