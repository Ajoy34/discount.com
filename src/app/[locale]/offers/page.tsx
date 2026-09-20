import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrendingUp } from "lucide-react";
import TrendingOffers from "@/components/TrendingOffers";
import { areas, categories } from "@/lib/data";
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
  const t = getTranslator(l, "Offers");
  return {
    title: `${t("title")} — ${getTranslator(l, "Common")("titleSuffix")}`,
    description: t("trendingSub"),
  };
}

export default async function OffersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const t = getTranslator(locale, "Offers");
  const tShop = getTranslator(locale, "Shop");
  const tCat = getTranslator(locale, "Category");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-7">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight sm:text-3xl">
          <TrendingUp className="h-6 w-6 text-accent-600" aria-hidden="true" />
          {t("trending")}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm muted">{t("trendingSub")}</p>
      </header>

      <TrendingOffers
        locale={locale}
        categoryOptions={categories.map((id) => ({ id, label: tCat(id) }))}
        areaOptions={areas.map((a) => ({
          id: a.id,
          label: locale === "bn" ? a.nameBn : a.nameEn,
        }))}
        t={{
          sortBy: t("sortBy"),
          sortTrending: t("sortTrending"),
          sortDiscount: t("sortDiscount"),
          sortRating: t("sortRating"),
          sortTrust: t("sortTrust"),
          allAreas: t("allAreas"),
          allCategories: t("allCategories"),
          minTrust: t("minTrust"),
          freeDeliveryOnly: t("freeDeliveryOnly"),
          openNowOnly: t("openNowOnly"),
          verifiedOnly: t("verifiedOnly"),
          resultCount: t("resultCount"),
          clearFilters: t("clearFilters"),
          noMatches: t("noMatches"),
          noMatchesHint: t("noMatchesHint"),
          trustScore: t("trustScore"),
          notRatedYet: t("notRatedYet"),
          views: t("views"),
          claims: t("claims"),
          reviews: t("reviews"),
          viewOffer: t("viewOffer"),
          listView: t("listView"),
          mapView: t("mapView"),
          mapHint: t("mapHint"),
          noLocation: t("noLocation"),
          validUntil: t("validUntil"),
          off: tShop("off"),
        }}
      />
    </div>
  );
}
