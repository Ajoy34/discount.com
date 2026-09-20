import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SearchClient from "@/components/SearchClient";
import { areas, categories } from "@/lib/data";
import {
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
  return { title: `${getTranslator(l, "Search")("title")} — ${getTranslator(l, "Common")("titleSuffix")}` };
}

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const t = getTranslator(locale, "Search");
  const tShop = getTranslator(locale, "Shop");
  const tCat = getTranslator(locale, "Category");
  const tIndex = getTranslator(locale, "Index");

  const strings = {
    title: t("title"),
    filters: t("filters"),
    listView: t("listView"),
    mapView: t("mapView"),
    openNow: t("openNow"),
    freeDelivery: t("freeDelivery"),
    hasDiscount: t("hasDiscount"),
    featured: t("featured"),
    noResults: t("noResults"),
    noResultsHint: t("noResultsHint"),
    clearFilters: t("clearFilters"),
    allAreas: t("allAreas"),
    allCategories: tCat("all"),
    sortBy: t("sortBy"),
    sortDistance: t("sortDistance"),
    sortRating: t("sortRating"),
    sortDiscount: t("sortDiscount"),
    searchPlaceholder: tIndex("searchPlaceholder"),
    loading: tIndex("loading"),
    shopsFoundOne: t("shopsFound", { count: "{count}" }),
    comingSoon: getTranslator(locale, "Common")("comingSoon"),
    off: tShop("off"),
  };

  const categoryOptions = categories.map((id) => ({ id, label: tCat(id) }));
  const areaOptions = areas.map((a) => ({
    id: a.id,
    label: locale === "bn" ? a.nameBn : a.nameEn,
  }));

  return (
    <Suspense
      fallback={
        <p className="mx-auto max-w-6xl px-4 py-12 text-sm muted">
          {strings.loading}
        </p>
      }
    >
      <SearchClient
        locale={locale}
        t={strings}
        categoryOptions={categoryOptions}
        areaOptions={areaOptions}
      />
    </Suspense>
  );
}
