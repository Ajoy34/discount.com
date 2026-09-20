"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarClock,
  Eye,
  List,
  Map as MapIcon,
  MessageSquare,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Store,
  Tag,
  X,
} from "lucide-react";
import OfferMap from "@/components/OfferMap";
import {
  averageRating,
  getShop,
  offerSignals,
  offerTitle,
  offers as allOffers,
  reviewsForOffer,
  shopAddress,
  shopName,
  trendingScore,
  trustScore,
  type AreaId,
  type CategoryId,
} from "@/lib/data";
import { formatNumber, type Locale } from "@/lib/i18n";

type SortKey = "trending" | "discount" | "rating" | "trust";

export interface TrendingStrings {
  sortBy: string;
  sortTrending: string;
  sortDiscount: string;
  sortRating: string;
  sortTrust: string;
  allAreas: string;
  allCategories: string;
  minTrust: string;
  freeDeliveryOnly: string;
  openNowOnly: string;
  verifiedOnly: string;
  resultCount: string;
  clearFilters: string;
  noMatches: string;
  noMatchesHint: string;
  trustScore: string;
  notRatedYet: string;
  views: string;
  claims: string;
  reviews: string;
  viewOffer: string;
  listView: string;
  mapView: string;
  mapHint: string;
  noLocation: string;
  validUntil: string;
  off: string;
}

export default function TrendingOffers({
  locale,
  t,
  categoryOptions,
  areaOptions,
}: {
  locale: Locale;
  t: TrendingStrings;
  categoryOptions: { id: CategoryId; label: string }[];
  areaOptions: { id: AreaId; label: string }[];
}) {
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [sort, setSort] = useState<SortKey>("trending");
  const [minTrust, setMinTrust] = useState(0);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const [view, setView] = useState<"list" | "map">("list");

  const filterCount =
    (category ? 1 : 0) +
    (area ? 1 : 0) +
    (minTrust > 0 ? 1 : 0) +
    (freeDelivery ? 1 : 0) +
    (openNow ? 1 : 0);

  const results = useMemo(() => {
    const rows = allOffers
      .flatMap((offer) => {
        const shop = getShop(offer.shopId);
        return shop ? [{ offer, shop }] : [];
      })
      .filter(({ offer, shop }) => {
        if (category && shop.category !== category) return false;
        if (area && shop.area !== area) return false;
        if (openNow && !shop.openNow) return false;
        if (freeDelivery && !shop.services.some((s) => s.id === "freeDelivery"))
          return false;
        if (trustScore(offer.id) < minTrust) return false;
        return true;
      });

    return rows.sort((a, b) => {
      if (sort === "discount") return b.offer.discount - a.offer.discount;
      if (sort === "rating")
        return averageRating(b.offer.id) - averageRating(a.offer.id);
      if (sort === "trust") return trustScore(b.offer.id) - trustScore(a.offer.id);
      return trendingScore(b.offer.id) - trendingScore(a.offer.id);
    });
  }, [category, area, sort, minTrust, freeDelivery, openNow]);

  const points = useMemo(
    () =>
      results.map(({ offer, shop }) => ({
        id: offer.id,
        lat: shop.lat,
        lng: shop.lng,
        title: offerTitle(offer, locale),
        subtitle: shopName(shop, locale),
        badge: `${offer.discount}%`,
        href: `/discount.com/${locale}/offers/${offer.id}/`,
      })),
    [results, locale],
  );

  const clearAll = () => {
    setCategory("");
    setArea("");
    setMinTrust(0);
    setFreeDelivery(false);
    setOpenNow(false);
  };

  const toggles: { label: string; on: boolean; set: (v: boolean) => void }[] = [
    { label: t.openNowOnly, on: openNow, set: setOpenNow },
    { label: t.freeDeliveryOnly, on: freeDelivery, set: setFreeDelivery },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm muted" aria-live="polite">
          {t.resultCount.replace(
            "{count}",
            formatNumber(results.length, locale),
          )}
        </p>

        <div
          className="flex items-center gap-1 rounded-2xl border border-[var(--border-subtle)] p-1"
          role="group"
          aria-label={`${t.listView} / ${t.mapView}`}
        >
          {(
            [
              { key: "list", label: t.listView, Icon: List },
              { key: "map", label: t.mapView, Icon: MapIcon },
            ] as const
          ).map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              aria-pressed={view === key}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                view === key
                  ? "bg-brand-600 text-white"
                  : "muted hover:bg-[var(--surface-muted)]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold muted">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            {t.sortBy}
          </span>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label={t.sortBy}
            className="surface rounded-xl px-3 py-2 text-xs font-semibold"
          >
            <option value="trending">{t.sortTrending}</option>
            <option value="discount">{t.sortDiscount}</option>
            <option value="rating">{t.sortRating}</option>
            <option value="trust">{t.sortTrust}</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label={t.allCategories}
            className="surface rounded-xl px-3 py-2 text-xs font-semibold"
          >
            <option value="">{t.allCategories}</option>
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            aria-label={t.allAreas}
            className="surface rounded-xl px-3 py-2 text-xs font-semibold"
          >
            <option value="">{t.allAreas}</option>
            {areaOptions.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>

          {filterCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 rounded-xl bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold hover:bg-[var(--border-subtle)]"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              {t.clearFilters}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {toggles.map(({ label, on, set }) => (
            <button
              key={label}
              type="button"
              onClick={() => set(!on)}
              aria-pressed={on}
              className={`rounded-full px-3.5 py-2 text-xs font-bold transition-colors ${
                on
                  ? "bg-brand-600 text-white"
                  : "surface muted hover:bg-[var(--surface-muted)]"
              }`}
            >
              {label}
            </button>
          ))}

          <label className="inline-flex items-center gap-2 text-xs font-bold muted">
            {t.minTrust}
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              value={minTrust}
              onChange={(e) => setMinTrust(Number(e.target.value))}
              className="accent-[var(--color-brand-600)]"
            />
            <span className="w-10 tabular-nums">
              {formatNumber(minTrust, locale)}%
            </span>
          </label>
        </div>
      </div>

      {view === "map" ? (
        <div className="space-y-3">
          <p className="text-xs muted">{t.mapHint}</p>
          <OfferMap points={points} emptyLabel={t.noMatches} />
        </div>
      ) : results.length === 0 ? (
        <div className="surface grid place-items-center gap-3 rounded-3xl px-6 py-20 text-center">
          <Tag className="h-8 w-8 muted" aria-hidden="true" />
          <p className="text-sm font-bold">{t.noMatches}</p>
          <p className="text-xs muted">{t.noMatchesHint}</p>
          {filterCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="mt-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white"
            >
              {t.clearFilters}
            </button>
          )}
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(({ offer, shop }) => {
            const trust = trustScore(offer.id);
            const signals = offerSignals(offer.id);
            const reviewCount = reviewsForOffer(offer.id).length;
            const rating = averageRating(offer.id);

            return (
              <li key={offer.id}>
                <article className="card-interactive surface relative h-full overflow-hidden rounded-3xl">
                  <Link
                    href={`/${locale}/offers/${offer.id}/`}
                    className="absolute inset-0 z-10"
                  >
                    <span className="sr-only">{offerTitle(offer, locale)}</span>
                  </Link>

                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={shop.image}
                      alt={shopName(shop, locale)}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/25 to-transparent"
                      aria-hidden="true"
                    />
                    <span className="absolute top-3 start-3 rounded-full bg-accent-700 px-3 py-1 text-xs font-black text-white shadow-sm">
                      {formatNumber(offer.discount, locale)}% {t.off}
                    </span>
                    {trust >= 80 && (
                      <span className="absolute top-3 end-3 inline-flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                        <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                        {formatNumber(trust, locale)}%
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 space-y-1 p-4 text-white">
                      <h3 className="line-clamp-2 font-bold leading-snug drop-shadow-sm">
                        {offerTitle(offer, locale)}
                      </h3>
                      <p className="flex items-center gap-1.5 text-xs text-zinc-200">
                        <Store className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span className="line-clamp-1">
                          {shopName(shop, locale)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 p-4">
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs muted">
                      {rating > 0 ? (
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <Star
                            className="h-3.5 w-3.5 fill-accent-500 text-accent-500"
                            aria-hidden="true"
                          />
                          {formatNumber(Math.round(rating * 10) / 10, locale)}
                        </span>
                      ) : (
                        <span>{t.notRatedYet}</span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatNumber(reviewCount, locale)} {t.reviews}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatNumber(signals.views, locale)}
                      </span>
                    </p>

                    {trust > 0 && (
                      <div>
                        <p className="mb-1 flex items-center justify-between text-[11px] font-bold muted">
                          <span>{t.trustScore}</span>
                          <span>{formatNumber(trust, locale)}%</span>
                        </p>
                        <div
                          className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]"
                          role="img"
                          aria-label={`${t.trustScore}: ${trust}%`}
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
                      </div>
                    )}

                    <p className="flex items-center gap-1.5 text-xs muted">
                      <CalendarClock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {t.validUntil}: {offer.validUntil}
                    </p>
                    <p className="text-xs muted">{shopAddress(shop, locale)}</p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
