import Image from "next/image";
import Link from "next/link";
import { CalendarClock, Store } from "lucide-react";
import { getShop, offerTitle, shopName, type Offer } from "@/lib/data";
import { formatNumber, getTranslator, type Locale } from "@/lib/i18n";

export default function OfferCard({
  offer,
  locale,
  priority = false,
}: {
  offer: Offer;
  locale: Locale;
  priority?: boolean;
}) {
  const shop = getShop(offer.shopId);
  if (!shop) return null;

  const tShop = getTranslator(locale, "Shop");
  const tOffers = getTranslator(locale, "Offers");

  return (
    <article className="card-interactive surface relative overflow-hidden rounded-3xl">
      <Link
        href={`/${locale}/shop/${shop.id}/`}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">{offerTitle(offer, locale)}</span>
      </Link>

      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={shop.image}
          alt={shopName(shop, locale)}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/25 to-transparent"
          aria-hidden="true"
        />

        <span className="absolute top-3 start-3 rounded-full bg-accent-500 px-3 py-1 text-xs font-black text-white shadow-sm">
          {formatNumber(offer.discount, locale)}% {tShop("off")}
        </span>

        <div className="absolute inset-x-0 bottom-0 space-y-1 p-4 text-white">
          <h3 className="line-clamp-2 font-bold leading-snug drop-shadow-sm">
            {offerTitle(offer, locale)}
          </h3>
          <p className="flex items-center gap-1.5 text-xs text-zinc-200">
            <Store className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{shopName(shop, locale)}</span>
          </p>
        </div>
      </div>

      <p className="flex items-center gap-1.5 px-4 py-3 text-xs muted">
        <CalendarClock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {tOffers("validUntil")}: {offer.validUntil}
      </p>
    </article>
  );
}
