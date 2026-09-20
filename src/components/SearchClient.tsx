"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, List, Map, X, Store } from "lucide-react";
import ShopCard from "@/components/ShopCard";
import {
  offersForShop,
  shopAddress,
  shopName,
  shops,
  type AreaId,
  type CategoryId,
} from "@/lib/data";
import { formatNumber, type Locale } from "@/lib/i18n";

type SortKey = "distance" | "rating" | "discount";

interface Strings {
  title: string;
  filters: string;
  listView: string;
  mapView: string;
  openNow: string;
  freeDelivery: string;
  hasDiscount: string;
  featured: string;
  noResults: string;
  noResultsHint: string;
  clearFilters: string;
  allAreas: string;
  allCategories: string;
  sortBy: string;
  sortDistance: string;
  sortRating: string;
  sortDiscount: string;
  searchPlaceholder: string;
  loading: string;
  shopsFoundOne: string;
  comingSoon: string;
  off: string;
}

export default function SearchClient({
  locale,
  t,
  categoryOptions,
  areaOptions,
}: {
  locale: Locale;
  t: Strings;
  categoryOptions: { id: CategoryId; label: string }[];
  areaOptions: { id: AreaId; label: string }[];
}) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [area, setArea] = useState("");
  const [openNow, setOpenNow] = useState(false);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [sort, setSort] = useState<SortKey>("distance");
  const [view, setView] = useState<"list" | "map">("list");

  const filterCount =
    (category ? 1 : 0) +
    (area ? 1 : 0) +
    (openNow ? 1 : 0) +
    (freeDelivery ? 1 : 0) +
    (hasDiscount ? 1 : 0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = shops.filter((shop) => {
      if (category && shop.category !== category) return false;
      if (area && shop.area !== area) return false;
      if (openNow && !shop.openNow) return false;
      if (freeDelivery && !shop.services.some((s) => s.id === "freeDelivery"))
        return false;
      if (hasDiscount && offersForShop(shop.id).length === 0) return false;
      if (q) {
        const haystack = [
          shopName(shop, locale),
          shop.nameEn,
          shop.nameBn,
          shopAddress(shop, locale),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    const best = (id: number) =>
      offersForShop(id).reduce((m, o) => Math.max(m, o.discount), 0);

    return filtered.sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "discount") return best(b.id) - best(a.id);
      return a.distanceMeters - b.distanceMeters;
    });
  }, [query, category, area, openNow, freeDelivery, hasDiscount, sort, locale]);

  const clearAll = () => {
    setCategory("");
    setArea("");
    setOpenNow(false);
    setFreeDelivery(false);
    setHasDiscount(false);
    setQuery("");
  };

  const toggles: { label: string; on: boolean; set: (v: boolean) => void }[] = [
    { label: t.openNow, on: openNow, set: setOpenNow },
    { label: t.freeDelivery, on: freeDelivery, set: setFreeDelivery },
    { label: t.hasDiscount, on: hasDiscount, set: setHasDiscount },
  ];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm muted" aria-live="polite">
          {t.shopsFoundOne.replace(
            "{count}",
            formatNumber(results.length, locale),
          )}
        </p>

        <div
          className="flex items-center gap-1 rounded-2xl border border-[var(--border-subtle)] p-1"
          role="group"
          aria-label={t.listView + " / " + t.mapView}
        >
          {(
            [
              { key: "list", label: t.listView, Icon: List },
              { key: "map", label: t.mapView, Icon: Map },
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

      {/* Search field */}
      <label className="surface mb-4 flex items-center gap-2 rounded-2xl px-4 py-3">
        <Search className="h-4 w-4 shrink-0 muted" aria-hidden="true" />
        <span className="sr-only">{t.searchPlaceholder}</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
        />
      </label>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold muted">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            {t.filters}
          </span>

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

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label={t.sortBy}
            className="surface rounded-xl px-3 py-2 text-xs font-semibold"
          >
            <option value="distance">{t.sortDistance}</option>
            <option value="rating">{t.sortRating}</option>
            <option value="discount">{t.sortDiscount}</option>
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

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {toggles.map(({ label, on, set }) => (
            <button
              key={label}
              type="button"
              onClick={() => set(!on)}
              aria-pressed={on}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition-colors ${
                on
                  ? "bg-brand-600 text-white"
                  : "surface muted hover:bg-[var(--surface-muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {view === "map" ? (
        <div className="surface grid place-items-center gap-3 rounded-3xl px-6 py-20 text-center">
          <Map className="h-8 w-8 muted" aria-hidden="true" />
          <p className="text-sm font-bold">{t.mapView}</p>
          <p className="text-xs muted">{t.comingSoon}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="surface grid place-items-center gap-3 rounded-3xl px-6 py-20 text-center">
          <Store className="h-8 w-8 muted" aria-hidden="true" />
          <p className="text-sm font-bold">{t.noResults}</p>
          <p className="text-xs muted">{t.noResultsHint}</p>
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((shop) => (
            <ShopCard key={shop.id} shop={shop} locale={locale} />
          ))}
        </div>
      )}
    </>
  );
}
