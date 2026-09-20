import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Crown,
  Info,
  Minus,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { rankedLeaderboard, shopName, type RankedShop } from "@/lib/data";
import { composeRequest, whatsappHref } from "@/lib/contact";
import { formatNumber, getTranslator, type Locale } from "@/lib/i18n";

const podiumTint = [
  "from-amber-400/25 to-amber-500/5 ring-amber-400/50",
  "from-zinc-300/25 to-zinc-400/5 ring-zinc-400/50",
  "from-orange-500/20 to-orange-600/5 ring-orange-500/40",
];

function Movement({
  value,
  locale,
  t,
}: {
  value: number;
  locale: Locale;
  t: (k: "up" | "down" | "same", v?: Record<string, string>) => string;
}) {
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold muted">
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
        {t("same")}
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
      {t(up ? "up" : "down", { count })}
    </span>
  );
}

/** Pre-fills the enquiry rather than pretending to take a payment here. */
function boostHref(locale: Locale, shopLabel: string, amount: string) {
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
}: {
  locale: Locale;
  limit?: number;
  showHow?: boolean;
}) {
  const t = getTranslator(locale, "Leaderboard");
  const tShop = getTranslator(locale, "Shop");
  const tCat = getTranslator(locale, "Category");
  const all = rankedLeaderboard();
  const rows = limit ? all.slice(0, limit) : all;
  const podium = rows.slice(0, 3);
  const rest = rows.slice(3);
  const topBid = all[0]?.bid ?? 0;

  const movement = (k: "up" | "down" | "same", v?: Record<string, string>) =>
    t(k, v);

  const taka = (n: number) => `৳${formatNumber(n, locale)}`;

  const Podium = ({ entry, index }: { entry: RankedShop; index: number }) => (
    <li
      className={`relative overflow-hidden rounded-4xl bg-gradient-to-b p-5 ring-2 ${podiumTint[index]} ${
        index === 0 ? "sm:order-2 sm:scale-[1.04]" : index === 1 ? "sm:order-1" : "sm:order-3"
      }`}
    >
      <div className="surface absolute inset-0 -z-10 rounded-4xl" />

      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-2xl font-black">
          {index === 0 && (
            <Crown className="h-5 w-5 text-amber-500" aria-hidden="true" />
          )}
          #{formatNumber(entry.rank, locale)}
        </span>
        <Movement value={entry.movement} locale={locale} t={movement} />
      </div>

      <Link
        href={`/${locale}/shop/${entry.shop.id}/`}
        className="group block focus-visible:outline-none"
      >
        <span className="relative mb-3 block aspect-[16/10] overflow-hidden rounded-2xl">
          <Image
            src={entry.shop.image}
            alt={shopName(entry.shop, locale)}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </span>
        <span className="block font-bold leading-snug group-hover:text-brand-700 dark:group-hover:text-brand-300">
          {shopName(entry.shop, locale)}
        </span>
      </Link>

      <p className="mt-1 flex flex-wrap items-center gap-2 text-xs muted">
        <span>{tCat(entry.shop.category)}</span>
        <span aria-hidden="true">·</span>
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
            {tShop("verified")}
          </span>
        )}
      </p>

      <p className="mt-3 border-t border-[var(--border-subtle)] pt-3">
        <span className="block text-[11px] font-bold uppercase tracking-wider muted">
          {t("bid")} · {t("thisCycle")}
        </span>
        <span className="text-lg font-black">{taka(entry.bid)}</span>
      </p>
    </li>
  );

  return (
    <div>
      {/* Paid placement has to be stated before the board, not after it. */}
      <p className="mb-5 flex items-start gap-2.5 rounded-2xl bg-[var(--surface-muted)] px-4 py-3 text-xs leading-relaxed muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          <strong className="font-bold">{t("disclosureTitle")}:</strong>{" "}
          {t("disclosure")}
        </span>
      </p>

      {podium.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-3 sm:items-end">
          {podium.map((entry, i) => (
            <Podium key={entry.shop.id} entry={entry} index={i} />
          ))}
        </ul>
      )}

      {rest.length > 0 && (
        <table className="mt-6 w-full border-collapse text-sm">
          <caption className="sr-only">{t("title")}</caption>
          <thead>
            <tr className="text-start text-[11px] font-bold uppercase tracking-wider muted">
              <th scope="col" className="px-3 py-2 text-start">
                {t("rank")}
              </th>
              <th scope="col" className="px-3 py-2 text-start">
                {t("shop")}
              </th>
              <th scope="col" className="hidden px-3 py-2 text-start sm:table-cell">
                {t("trend")}
              </th>
              <th scope="col" className="px-3 py-2 text-end">
                {t("bid")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rest.map((entry) => (
              <tr
                key={entry.shop.id}
                className="border-t border-[var(--border-subtle)]"
              >
                <td className="px-3 py-3 font-black">
                  #{formatNumber(entry.rank, locale)}
                </td>
                <td className="px-3 py-3">
                  <Link
                    href={`/${locale}/shop/${entry.shop.id}/`}
                    className="font-bold hover:text-brand-700 dark:hover:text-brand-300"
                  >
                    {shopName(entry.shop, locale)}
                  </Link>
                  <span className="block text-xs muted">
                    {tCat(entry.shop.category)}
                  </span>
                </td>
                <td className="hidden px-3 py-3 sm:table-cell">
                  <Movement
                    value={entry.movement}
                    locale={locale}
                    t={movement}
                  />
                </td>
                <td className="px-3 py-3 text-end font-bold">
                  {taka(entry.bid)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showHow && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="surface rounded-3xl p-6">
            <h3 className="text-base font-bold">{t("howTitle")}</h3>
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
              href={boostHref(locale, "", taka(topBid + 500))}
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
