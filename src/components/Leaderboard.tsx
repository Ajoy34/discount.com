import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Crown,
  Flame,
  Globe,
  Info,
  Medal,
  Minus,
  Star,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { rankedLeaderboard, shopName, type RankedShop } from "@/lib/data";
import { formatNumber, getTranslator, type Locale } from "@/lib/i18n";

/** Only the first three rank badges are tinted; past that it is just a number. */
const rankTint = [
  "bg-amber-400 text-amber-950",
  "bg-zinc-300 text-zinc-800",
  "bg-orange-400 text-orange-950",
];

const podiumMedal = [
  "text-amber-400",
  "text-zinc-400",
  "text-orange-400",
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

/** Relative bid strength against the current top bid, for the little fill bar. */
function bidStrength(bid: number, topBid: number) {
  if (topBid <= 0) return 0;
  return Math.max(4, Math.min(100, Math.round((bid / topBid) * 100)));
}

/** A shop's own site when it has one, otherwise a nudge toward building one. */
function WebsiteLink({
  website,
  locale,
  visitLabel,
  getLabel,
}: {
  website?: string;
  locale: Locale;
  visitLabel: string;
  getLabel: string;
}) {
  if (website) {
    const host = website.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return (
      <a
        href={website}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-20 inline-flex max-w-full items-center gap-1 rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-bold text-brand-700 transition-colors hover:bg-brand-100 dark:text-brand-300 dark:hover:bg-brand-900/40"
      >
        <Globe className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span className="truncate">{host}</span>
        <span className="sr-only"> — {visitLabel}</span>
      </a>
    );
  }
  return (
    <Link
      href={`/${locale}/consultancy/website/`}
      className="relative z-20 inline-flex items-center gap-1 rounded-full border border-dashed border-[var(--border-subtle)] px-2.5 py-1 text-[11px] font-bold muted transition-colors hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
    >
      <Globe className="h-3 w-3 shrink-0" aria-hidden="true" />
      {getLabel}
    </Link>
  );
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
  const podium = !compact ? rows.slice(0, 3) : [];

  const label = (k: "up" | "down" | "same", v?: Record<string, string>) =>
    t(k, v);
  const taka = (n: number) => `৳${formatNumber(n, locale)}`;

  const Row = ({ entry, stagger }: { entry: RankedShop; stagger: number }) => (
    <li
      className="group animate-fade-up relative flex items-center gap-3 border-t border-[var(--border-subtle)] px-3 py-3 transition-[background-color,transform] first:border-t-0 hover:bg-[var(--surface-muted)] hover:[transform:scale(1.01)] sm:gap-4 sm:px-4"
      style={{ "--stagger": stagger } as CSSProperties}
    >
      <Link
        href={`/${locale}/shop/${entry.shop.id}/`}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">{shopName(entry.shop, locale)}</span>
      </Link>

      <span
        className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm font-black ${
          rankTint[entry.rank - 1] ?? "bg-[var(--surface-muted)] muted"
        } ${entry.rank === 1 ? "ring-2 ring-accent-400 ring-offset-2 ring-offset-[var(--surface-card)]" : ""}`}
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
        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs muted">
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
          <WebsiteLink
            website={entry.shop.website}
            locale={locale}
            visitLabel={t("visitWebsite")}
            getLabel={t("getWebsite")}
          />
        </span>
        <span
          className="mt-1.5 block h-1 w-full max-w-40 overflow-hidden rounded-full bg-[var(--surface-muted)]"
          aria-hidden="true"
        >
          <span
            className="animate-bar-fill block h-full origin-left rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
            style={
              {
                width: `${bidStrength(entry.bid, topBid)}%`,
                "--stagger": stagger,
              } as CSSProperties
            }
          />
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

  const PodiumCard = ({
    entry,
    place,
  }: {
    entry: RankedShop;
    place: 1 | 2 | 3;
  }) => {
    const isFirst = place === 1;
    const placeLabel =
      place === 1 ? t("champion") : place === 2 ? t("runnerUp") : t("thirdPlace");

    return (
      <div
        className={`animate-fade-up relative ${
          isFirst ? "order-2 sm:-translate-y-4" : place === 2 ? "order-1" : "order-3"
        }`}
        style={{ "--stagger": place } as CSSProperties}
      >
        <div
          className={`surface relative flex flex-col items-center overflow-hidden rounded-3xl px-4 pt-8 pb-5 text-center ${
            isFirst
              ? "border-2 border-accent-400/70 shadow-xl sm:pt-9"
              : "shadow-sm"
          }`}
        >
          {isFirst && (
            <span
              className="animate-glow-pulse pointer-events-none absolute inset-0 rounded-3xl"
              aria-hidden="true"
            />
          )}

          {isFirst ? (
            <Crown
              className="absolute top-2 h-7 w-7 animate-bounce text-amber-400 drop-shadow-sm [animation-duration:2.2s]"
              aria-hidden="true"
            />
          ) : (
            <Medal
              className={`absolute top-2 h-6 w-6 ${podiumMedal[place - 1]}`}
              aria-hidden="true"
            />
          )}

          <div className="relative">
            {isFirst && (
              <span
                className="animate-spin-slow absolute -inset-2.5 rounded-full border-2 border-dashed border-accent-400/50"
                aria-hidden="true"
              />
            )}
            <Link
              href={`/${locale}/shop/${entry.shop.id}/`}
              className={`relative z-20 block overflow-hidden rounded-full ring-4 ring-[var(--surface-card)] ${
                isFirst ? "h-20 w-20 sm:h-24 sm:w-24" : "h-16 w-16"
              }`}
            >
              <span className="relative block h-full w-full">
                <Image
                  src={entry.shop.image}
                  alt={shopName(entry.shop, locale)}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </span>
            </Link>
            <span
              className={`absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full text-[11px] font-black ${
                rankTint[place - 1]
              } ring-2 ring-[var(--surface-card)]`}
            >
              {formatNumber(place, locale)}
            </span>
          </div>

          <p className="relative mt-3 text-[11px] font-bold uppercase tracking-wider muted">
            {placeLabel}
          </p>
          <p className="relative mt-0.5 line-clamp-1 text-sm font-black leading-snug sm:text-base">
            {shopName(entry.shop, locale)}
          </p>
          <p className="relative mt-0.5 flex items-center gap-1 text-xs muted">
            <Star
              className="h-3 w-3 fill-accent-500 text-accent-500"
              aria-hidden="true"
            />
            {formatNumber(entry.shop.rating, locale)}
            <span>· {tCat(entry.shop.category)}</span>
          </p>

          <p className="relative mt-2.5 text-lg font-black tabular-nums sm:text-xl">
            {taka(entry.bid)}
          </p>
          <span className="relative mt-1">
            <Movement value={entry.movement} locale={locale} label={label} />
          </span>

          <span className="relative mt-3">
            <WebsiteLink
              website={entry.shop.website}
              locale={locale}
              visitLabel={t("visitWebsite")}
              getLabel={t("getWebsite")}
            />
          </span>

          {isFirst && (
            <Link
              href={`/${locale}/leaderboard/checkout/?amount=${entry.bid + 500}`}
              className="relative z-20 mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-brand-700"
            >
              <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
              {t("outbid")}
            </Link>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {!compact && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/10 px-3 py-1 text-xs font-bold text-red-700 dark:text-red-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
            </span>
            {t("liveNow")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600/10 px-3 py-1 text-xs font-bold text-brand-700 dark:text-brand-300">
            <Flame className="h-3.5 w-3.5" aria-hidden="true" />
            {t("startsAt")} {taka(1)}
          </span>
        </div>
      )}

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

      {podium.length === 3 && (
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-lg font-black tracking-tight">
            <Trophy className="h-5 w-5 text-accent-600" aria-hidden="true" />
            {t("podiumTitle")}
          </h2>
          <p className="mt-1 text-sm muted">{t("podiumSubtitle")}</p>

          <div className="mt-5 grid grid-cols-3 items-end gap-3 sm:gap-4">
            {podium.map((entry) => (
              <PodiumCard
                key={entry.shop.id}
                entry={entry}
                place={entry.rank as 1 | 2 | 3}
              />
            ))}
          </div>
        </div>
      )}

      {!compact && (
        <h2 className="mb-3 flex items-center justify-between gap-2 text-sm font-black uppercase tracking-wider muted">
          {t("fullBoard")}
          <span className="font-medium normal-case">{t("fullBoardSub")}</span>
        </h2>
      )}

      <ol className="surface overflow-hidden rounded-3xl">
        {rows.map((entry, i) => (
          <Row key={entry.shop.id} entry={entry} stagger={i} />
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

          <div className="surface relative flex flex-col justify-between overflow-hidden rounded-3xl p-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-wider muted">
                  {t("currentTop")}
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-600/10 px-2 py-0.5 text-[11px] font-bold text-brand-700 dark:text-brand-300">
                  <Flame className="h-3 w-3" aria-hidden="true" />
                  {t("startsAt")} {taka(1)}
                </span>
              </div>
              <p className="mt-1 text-3xl font-black">{taka(topBid)}</p>
              <p className="mt-2 text-sm muted">{t("boostIntro")}</p>
              <p className="mt-1 text-xs muted">{t("startingBidNote")}</p>
            </div>
            <Link
              href={`/${locale}/leaderboard/checkout/?amount=${topBid + 500}`}
              className="group mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700"
            >
              <TrendingUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
              {t("toTakeTop", { amount: taka(topBid + 500) })}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
