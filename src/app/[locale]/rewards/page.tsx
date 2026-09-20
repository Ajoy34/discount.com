import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Sparkles, Star } from "lucide-react";
import RewardsPanel from "@/components/RewardsPanel";
import { offerTitle, offers, reviews } from "@/lib/data";
import {
  formatNumber,
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
  const t = getTranslator(l, "Rewards");
  return {
    title: `${t("title")} — ${getTranslator(l, "Common")("titleSuffix")}`,
    description: t("subtitle"),
  };
}

export default async function RewardsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const t = getTranslator(locale, "Rewards");

  const savedOfferTitles = Object.fromEntries(
    offers.map((offer) => [String(offer.id), offerTitle(offer, locale)]),
  );

  // The contributor board is built from the reviews the site already has, so
  // it shows real standing rather than an invented ladder.
  const contributors = Object.entries(
    reviews.reduce<Record<string, number>>((acc, review) => {
      acc[review.author] = (acc[review.author] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-7">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight sm:text-3xl">
          <Sparkles className="h-6 w-6 text-accent-600" aria-hidden="true" />
          {t("title")}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm muted">{t("subtitle")}</p>
      </header>

      <RewardsPanel
        locale={locale}
        savedOfferTitles={savedOfferTitles}
        t={{
          points: t("points"),
          level: t("level"),
          nextLevel: t("nextLevel"),
          maxLevel: t("maxLevel"),
          streak: t("streak"),
          streakOne: t("streakOne"),
          streakLive: t("streakLive"),
          badges: t("badges"),
          badgesEarned: t("badgesEarned"),
          locked: t("locked"),
          progressOf: t("progressOf"),
          howToEarn: t("howToEarn"),
          earn: {
            review: t("earnReview"),
            honoured: t("earnHonoured"),
            disputed: t("earnDisputed"),
            save: t("earnSave"),
            visit: t("earnVisit"),
            streak: t("earnStreak"),
          },
          recent: t("recent"),
          noActivity: t("noActivity"),
          reason: {
            review: t("reasonReview"),
            honoured: t("reasonHonoured"),
            disputed: t("reasonDisputed"),
            save: t("reasonSave"),
            visit: t("reasonVisit"),
            streak: t("reasonStreak"),
          },
          whatYouGet: t("whatYouGet"),
          perks: [
            { label: t("perkBadge"), live: true },
            { label: t("perkStanding"), live: true },
            { label: t("perkLevel"), live: true },
            { label: t("perkSoon"), live: false },
          ],
          notYet: t("notYet"),
          live: t("live"),
          localOnly: t("localOnly"),
          reset: t("reset"),
          savedOffers: t("savedOffers"),
          noSaves: t("noSaves"),
          levelLabels: {
            newcomer: t("levelNewcomer"),
            bronze: t("levelBronze"),
            silver: t("levelSilver"),
            gold: t("levelGold"),
            platinum: t("levelPlatinum"),
          },
          badgeLabels: {
            firstReview: {
              name: t("badgeFirstReviewName"),
              desc: t("badgeFirstReviewDesc"),
            },
            reviewer: {
              name: t("badgeReviewerName"),
              desc: t("badgeReviewerDesc"),
            },
            truthTeller: {
              name: t("badgeTruthTellerName"),
              desc: t("badgeTruthTellerDesc"),
            },
            collector: {
              name: t("badgeCollectorName"),
              desc: t("badgeCollectorDesc"),
            },
            explorer: {
              name: t("badgeExplorerName"),
              desc: t("badgeExplorerDesc"),
            },
            regular: {
              name: t("badgeRegularName"),
              desc: t("badgeRegularDesc"),
            },
          },
        }}
      />

      <section className="mt-10">
        <h2 className="text-xl font-black tracking-tight">
          {t("contributors")}
        </h2>
        <p className="mt-1 text-sm muted">{t("contributorsSub")}</p>

        <ol className="surface mt-4 overflow-hidden rounded-3xl">
          {contributors.map(([author, count], i) => (
            <li
              key={author}
              className="flex items-center gap-3 border-t border-[var(--border-subtle)] px-4 py-3 first:border-0"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[var(--surface-muted)] text-xs font-black">
                {formatNumber(i + 1, locale)}
              </span>
              <span className="min-w-0 flex-1 truncate font-semibold">
                {author}
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-xs muted">
                <Star
                  className="h-3.5 w-3.5 fill-accent-500 text-accent-500"
                  aria-hidden="true"
                />
                {t("reviewsCount", { count: formatNumber(count, locale) })}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
