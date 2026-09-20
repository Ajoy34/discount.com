"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  Bookmark,
  Compass,
  Flame,
  Lock,
  Shield,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import { useRewards } from "@/components/useRewards";
import {
  BADGES,
  POINTS,
  levelFor,
  levelProgress,
  nextLevel,
  resetRewards,
  type RewardReason,
} from "@/lib/rewards";
import { formatNumber, type Locale } from "@/lib/i18n";

const badgeIcons = {
  star: Star,
  shield: Shield,
  flame: Flame,
  compass: Compass,
  bookmark: Bookmark,
  award: Award,
} as const;

export interface RewardsStrings {
  points: string;
  level: string;
  nextLevel: string;
  maxLevel: string;
  streak: string;
  streakOne: string;
  streakLive: string;
  badges: string;
  badgesEarned: string;
  locked: string;
  progressOf: string;
  howToEarn: string;
  earn: Record<RewardReason, string>;
  recent: string;
  noActivity: string;
  reason: Record<RewardReason, string>;
  whatYouGet: string;
  perks: { label: string; live: boolean }[];
  notYet: string;
  live: string;
  localOnly: string;
  reset: string;
  savedOffers: string;
  noSaves: string;
  levelLabels: Record<string, string>;
  badgeLabels: Record<string, { name: string; desc: string }>;
}

export default function RewardsPanel({
  locale,
  t,
  savedOfferTitles,
}: {
  locale: Locale;
  t: RewardsStrings;
  /** Offer id to title, so saved offers can be listed by name. */
  savedOfferTitles: Record<string, string>;
}) {
  const state = useRewards();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Before hydration the export has an empty state; showing it would flash.
  const s = mounted
    ? state
    : { ...state, points: 0, saves: [], history: [], streak: 0 };

  const level = levelFor(s.points);
  const next = nextLevel(s.points);
  const progress = levelProgress(s.points);
  const earned = BADGES.filter((b) => b.progress(s) >= b.target);

  const earnRows: RewardReason[] = [
    "review",
    "honoured",
    "disputed",
    "save",
    "visit",
    "streak",
  ];

  return (
    <div className="space-y-8">
      {/* Level and points */}
      <section className="surface rounded-4xl p-6 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider muted">
              {t.level}
            </p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black">
                {t.levelLabels[level.id]}
              </span>
              <span className="text-sm font-bold muted" suppressHydrationWarning>
                {formatNumber(s.points, locale)} {t.points}
              </span>
            </p>
          </div>

          <p
            className="inline-flex items-center gap-2 rounded-2xl bg-[var(--surface-muted)] px-3.5 py-2 text-sm font-bold"
            suppressHydrationWarning
          >
            <Flame
              className="h-4 w-4 text-accent-600 dark:text-accent-300"
              aria-hidden="true"
            />
            {formatNumber(s.streak, locale)} · {t.streak}
          </p>
        </div>

        <div className="mt-5">
          <div
            className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-muted)]"
            role="img"
            aria-label={`${t.level}: ${progress}%`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-600 to-accent-600 transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm muted" suppressHydrationWarning>
            {next
              ? t.nextLevel
                  .replace("{points}", formatNumber(next.min - s.points, locale))
                  .replace("{level}", t.levelLabels[next.id])
              : t.maxLevel}
          </p>
          <p className="mt-1 text-sm muted" suppressHydrationWarning>
            {s.streak > 1
              ? t.streakLive.replace("{count}", formatNumber(s.streak, locale))
              : t.streakOne}
          </p>
        </div>
      </section>

      {/* Badges */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-xl font-black tracking-tight">{t.badges}</h2>
          <p className="text-sm muted" suppressHydrationWarning>
            {t.badgesEarned
              .replace("{earned}", formatNumber(earned.length, locale))
              .replace("{total}", formatNumber(BADGES.length, locale))}
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((badge) => {
            const Icon = badgeIcons[badge.icon];
            const current = Math.min(badge.progress(s), badge.target);
            const unlocked = current >= badge.target;
            const labels = t.badgeLabels[badge.id];

            return (
              <li
                key={badge.id}
                className={`surface rounded-3xl p-5 ${
                  unlocked ? "" : "opacity-75"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                      unlocked
                        ? "bg-gradient-to-br from-accent-500 to-accent-700 text-white shadow-md"
                        : "bg-[var(--surface-muted)] muted"
                    }`}
                  >
                    {unlocked ? (
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Lock className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>

                  <div className="min-w-0">
                    <p className="font-bold">{labels?.name ?? badge.id}</p>
                    <p className="mt-0.5 text-xs leading-relaxed muted">
                      {labels?.desc}
                    </p>

                    {!unlocked && (
                      <p
                        className="mt-2 text-[11px] font-bold muted"
                        suppressHydrationWarning
                      >
                        {t.progressOf
                          .replace("{current}", formatNumber(current, locale))
                          .replace(
                            "{target}",
                            formatNumber(badge.target, locale),
                          )}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Saved offers */}
      <section>
        <h2 className="mb-4 text-xl font-black tracking-tight">
          {t.savedOffers}
        </h2>
        {s.saves.length === 0 ? (
          <p className="surface rounded-3xl px-5 py-10 text-center text-sm muted">
            {t.noSaves}
          </p>
        ) : (
          <ul className="space-y-2.5" suppressHydrationWarning>
            {s.saves.map((id) => (
              <li key={id} className="surface rounded-2xl">
                <Link
                  href={`/${locale}/offers/${id}/`}
                  className="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold hover:text-brand-700 dark:hover:text-brand-300"
                >
                  <Bookmark
                    className="h-4 w-4 shrink-0 muted"
                    aria-hidden="true"
                  />
                  {savedOfferTitles[id] ?? id}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Earning and perks */}
      <section className="grid gap-5 lg:grid-cols-2">
        <div className="surface rounded-3xl p-6">
          <h2 className="text-base font-bold">{t.howToEarn}</h2>
          <ul className="mt-3 space-y-2.5">
            {earnRows.map((reason) => (
              <li
                key={reason}
                className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-2.5 text-sm last:border-0 last:pb-0"
              >
                <span className="muted">{t.earn[reason]}</span>
                <span className="shrink-0 rounded-lg bg-brand-50 px-2 py-0.5 text-xs font-black text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                  +{formatNumber(POINTS[reason], locale)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="surface rounded-3xl p-6">
          <h2 className="text-base font-bold">{t.whatYouGet}</h2>
          <ul className="mt-3 space-y-2.5">
            {t.perks.map((perk) => (
              <li
                key={perk.label}
                className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-2.5 text-sm last:border-0 last:pb-0"
              >
                <span className="muted">{perk.label}</span>
                <span
                  className={`shrink-0 rounded-lg px-2 py-0.5 text-[11px] font-bold ${
                    perk.live
                      ? "bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-200"
                      : "bg-[var(--surface-muted)] muted"
                  }`}
                >
                  {perk.live ? t.live : t.notYet}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Activity */}
      <section>
        <h2 className="mb-4 text-xl font-black tracking-tight">{t.recent}</h2>
        {s.history.length === 0 ? (
          <p className="surface rounded-3xl px-5 py-10 text-center text-sm muted">
            {t.noActivity}
          </p>
        ) : (
          <ul className="surface overflow-hidden rounded-3xl" suppressHydrationWarning>
            {s.history.slice(0, 12).map((entry, i) => (
              <li
                key={`${entry.at}-${i}`}
                className="flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] px-4 py-3 text-sm first:border-0"
              >
                <span className="inline-flex items-center gap-2">
                  <Sparkles
                    className="h-3.5 w-3.5 text-accent-600 dark:text-accent-300"
                    aria-hidden="true"
                  />
                  {t.reason[entry.reason]}
                </span>
                <span className="font-black text-brand-700 dark:text-brand-300">
                  +{formatNumber(entry.points, locale)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-5">
        <p className="text-xs muted">{t.localOnly}</p>
        <button
          type="button"
          onClick={resetRewards}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 hover:underline dark:text-red-300"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          {t.reset}
        </button>
      </div>
    </div>
  );
}
