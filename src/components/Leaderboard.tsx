import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Info,
  Minus,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { rankedLeaderboard, shopName, type RankedShop } from "@/lib/data";
import { composeRequest, whatsappHref } from "@/lib/contact";
import { formatNumber, getTranslator, type Locale } from "@/lib/i18n";

/** Only the first three rank badges are tinted; past that it is just a number. */
const rankTint = [
  "bg-amber-400 text-amber-950",
  "bg-zinc-300 text-zinc-800",
  "bg-orange-400 text-orange-950",
];

function Movement({
  value,
  locale,
  label,
}: {
  value: number;
  locale: Locale;
  label: (k: "up" | "down" | "same", v?: Record<string, string>) => string;
}) {
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs muted">
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="sr-only">{label("same")}</span>
      </span>
    );
  }
  const up = value > 0;
  const count = formatNumber(Math.abs(value), locale);
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold ${
        up
          ? "text-brand-700 dark:text-brand-300"
          : "text-red-700 dark:text-red-300"
      }`}
    >
      {up ? (
        <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {count}
      <span className="sr-only">{label(up ? "up" : "down", { count })}</span>
    </span>
  );
}

/** Pre-fills the enquiry rather than pretending to take a payment here. */
function boostHref(shopLabel: string, amount: string) {
  const body = composeRequest(
    {
      name: "",
      shop: shopLabel,
      phone: "",
      service: "Leaderboard placement",
      message: `I want to bid ${amount} per week for leaderboard placement.`,
    },
    {
      heading: "Leaderboard placement request",
      name: "Name",
      shop: "Shop",
      phone: "Phone",
      service: "Service",
      message: "Details",
    },
  );
  return whatsappHref(body);
}

export default function Leaderboard({
  locale,
  limit,
  showHow = true,
  compact = false,
}: {
  locale: Locale;
  limit?: number;
  showHow?: boolean;
  /** Trims the chrome for the strip on the home page. */
  compact?: boolean;
}) {
  const t = getTranslator(locale, "Leaderboard");
  const tShop = getTranslator(locale, "Shop");
  const tCat = getTranslator(locale, "Category");

  const all = rankedLeaderboard();
  const rows = limit ? all.slice(0, limit) : all;
  const topBid = all[0]?.bid ?? 0;

  const label = (k: "up" | "down" | "same", v?: Record<string, string>) =>
    t(k, v);
  const taka = (n: number) => `৳${formatNumber(n, locale)}`;

  const Row = ({ entry }: { entry: RankedShop }) => (
    <li className="group relative flex items-center gap-3 border-t border-[var(--border-subtle)] px-3 py-3 transition-colors first:border-t-0 hover:bg-[var(--surface-muted)] sm:gap-4 sm:px-4">
      <Link
        href={`/${locale}/shop/${entry.shop.id}/`}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">{shopName(entry.shop, locale)}</span>
      </Link>

      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm font-black ${
          rankTint[entry.rank - 1] ?? "bg-[var(--surface-muted)] muted"
        }`}
      >
        {formatNumber(entry.rank, locale)}
      </span>

      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl sm:h-12 sm:w-12">
        <Image
          src={entry.shop.image}
          alt=""
          fill
          sizes="48px"
          className="object-cover"
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate font-bold leading-snug">
          {shopName(entry.shop, locale)}
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs muted">
          <span>{tCat(entry.shop.category)}</span>
          <span className="inline-flex items-center gap-1 font-semibold">
            <Star
              className="h-3 w-3 fill-accent-500 text-accent-500"
              aria-hidden="true"
            />
            {formatNumber(entry.shop.rating, locale)}
          </span>
          {entry.shop.verified && (
            <span className="inline-flex items-center gap-1 font-semibold text-brand-700 dark:text-brand-300">
              <BadgeCheck className="h-3 w-3" aria-hidden="true" />
              <span className="hidden sm:inline">{tShop("verified")}</span>
            </span>
          )}
        </span>
      </span>

      <span className="shrink-0 text-end">
        <span className="block text-sm font-black tabular-nums sm:text-base">
          {taka(entry.bid)}
        </span>
        <Movement value={entry.movement} locale={locale} label={label} />
      </span>
    </li>
  );

  return (
    <div>
      {/* Paid placement is stated before the board, not after it. */}
      <p
        className={`flex items-start gap-2.5 rounded-2xl bg-[var(--surface-muted)] px-4 py-3 text-xs leading-relaxed muted ${
          compact ? "mb-3" : "mb-5"
        }`}
      >
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          <strong className="font-bold">{t("disclosureTitle")}:</strong>{" "}
          {compact ? t("disclosureShort") : t("disclosure")}
        </span>
      </p>

      <ol className="surface overflow-hidden rounded-3xl">
        {rows.map((entry) => (
          <Row key={entry.shop.id} entry={entry} />
        ))}
      </ol>

      {compact && (
        <Link
          href={`/${locale}/leaderboard/`}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:underline dark:text-brand-300"
        >
          {t("viewFull")}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        </Link>
      )}

      {showHow && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="surface rounded-3xl p-6">
            <h2 className="text-base font-bold">{t("howTitle")}</h2>
            <ol className="mt-3 space-y-2.5 text-sm leading-relaxed muted">
              {[t("how1"), t("how2"), t("how3")].map((line, i) => (
                <li key={line} className="flex gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-600 text-[11px] font-black text-white">
                    {i + 1}
                  </span>
                  {line}
                </li>
              ))}
            </ol>
          </div>

          <div className="surface flex flex-col justify-between rounded-3xl p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider muted">
                {t("currentTop")}
              </p>
              <p className="mt-1 text-3xl font-black">{taka(topBid)}</p>
              <p className="mt-2 text-sm muted">{t("boostIntro")}</p>
            </div>
            <a
              href={boostHref("", taka(topBid + 500))}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700"
            >
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              {t("toTakeTop", { amount: taka(topBid + 500) })}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
