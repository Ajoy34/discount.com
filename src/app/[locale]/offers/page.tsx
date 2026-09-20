import { notFound } from "next/navigation";
import { Tag } from "lucide-react";
import OfferCard from "@/components/OfferCard";
import { offers } from "@/lib/data";
import { getTranslator, isLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
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
  const sorted = [...offers].sort((a, b) => b.discount - a.discount);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight sm:text-3xl">
          <Tag className="h-6 w-6 text-accent-500" aria-hidden="true" />
          {t("title")}
        </h1>
        <p className="mt-1 text-sm muted">{t("subtitle")}</p>
      </header>

      {sorted.length === 0 ? (
        <p className="surface rounded-3xl px-6 py-20 text-center text-sm muted">
          {t("noOffers")}
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((offer, i) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              locale={locale}
              priority={i < 2}
            />
          ))}
        </div>
      )}
    </div>
  );
}
