import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MapPin, Star, Truck } from "lucide-react";
import {
  offersForShop,
  shopAddress,
  shopName,
  type Shop,
} from "@/lib/data";
import { formatNumber, getTranslator, type Locale } from "@/lib/i18n";

export default function ShopCard({
  shop,
  locale,
}: {
  shop: Shop;
  locale: Locale;
}) {
  const tShop = getTranslator(locale, "Shop");
  const tSearch = getTranslator(locale, "Search");
  const tCat = getTranslator(locale, "Category");

  const best = offersForShop(shop.id).sort((a, b) => b.discount - a.discount)[0];
  const freeDelivery = shop.services.some((s) => s.id === "freeDelivery");

  return (
    <article className="card-interactive surface relative overflow-hidden rounded-3xl">
      <Link
        href={`/${locale}/shop/${shop.id}/`}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">{shopName(shop, locale)}</span>
      </Link>

      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-muted)]">
        <Image
          src={shop.image}
          alt={shopName(shop, locale)}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          {shop.featured && (
            <span className="rounded-full bg-accent-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
              {tSearch("featured")}
            </span>
          )}
          {best && (
            <span className="ms-auto rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-black text-accent-700 shadow-sm dark:bg-zinc-900/95 dark:text-accent-300">
              {formatNumber(best.discount, locale)}% {tShop("off")}
            </span>
          )}
        </div>
        <span
          className={`absolute bottom-3 start-3 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm ${
            shop.openNow
              ? "bg-brand-600 text-white"
              : "bg-zinc-900/80 text-white"
          }`}
        >
          {shop.openNow ? tShop("openNow") : tShop("closed")}
        </span>
      </div>

      <div className="space-y-2.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-bold leading-snug">
            {shopName(shop, locale)}
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-bold">
            <Star
              className="h-3.5 w-3.5 fill-accent-400 text-accent-400"
              aria-hidden="true"
            />
            {formatNumber(shop.rating, locale)}
          </span>
        </div>

        <p className="flex items-center gap-1.5 text-xs muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="line-clamp-1">{shopAddress(shop, locale)}</span>
          <span aria-hidden="true">•</span>
          <span className="shrink-0 font-semibold">
            {formatNumber(shop.distanceMeters, locale)}
            {tSearch("meters")}
          </span>
        </p>

        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="rounded-lg bg-[var(--surface-muted)] px-2 py-1 text-[11px] font-semibold">
            {tCat(shop.category)}
          </span>
          {shop.verified && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2 py-1 text-[11px] font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              <BadgeCheck className="h-3 w-3" aria-hidden="true" />
              {tShop("verified")}
            </span>
          )}
          {freeDelivery && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2 py-1 text-[11px] font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              <Truck className="h-3 w-3" aria-hidden="true" />
              {tShop("freeDelivery")}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
