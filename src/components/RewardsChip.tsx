"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Sparkles } from "lucide-react";
import { useRewards } from "@/components/useRewards";
import { levelFor, recordVisit } from "@/lib/rewards";
import { formatNumber, type Locale } from "@/lib/i18n";

/**
 * The header's progress chip. It also credits the daily visit, which is the
 * one reward that has to be granted on arrival rather than on an action.
 */
export default function RewardsChip({
  locale,
  t,
}: {
  locale: Locale;
  t: {
    rewards: string;
    pointsShort: string;
    levelLabels: Record<string, string>;
    streak: string;
  };
}) {
  const state = useRewards();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Rendering the real figures before hydration would mismatch the export,
    // which is built with an empty state.
    setMounted(true);
    recordVisit();
  }, []);

  const level = levelFor(state.points);

  return (
    <Link
      href={`/${locale}/rewards/`}
      className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] px-2.5 py-2 text-xs font-bold transition-colors hover:bg-[var(--surface-muted)]"
      title={t.rewards}
    >
      <Sparkles
        className="h-3.5 w-3.5 text-accent-600 dark:text-accent-300"
        aria-hidden="true"
      />
      <span className="sr-only">{t.rewards}: </span>
      <span suppressHydrationWarning>
        {mounted ? formatNumber(state.points, locale) : "0"}
      </span>
      <span className="hidden muted sm:inline">{t.pointsShort}</span>

      {mounted && state.streak > 1 && (
        <span className="inline-flex items-center gap-0.5 text-accent-700 dark:text-accent-300">
          <Flame className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only">{t.streak}: </span>
          {formatNumber(state.streak, locale)}
        </span>
      )}

      <span className="hidden rounded-lg bg-[var(--surface-muted)] px-1.5 py-0.5 text-[10px] muted lg:inline">
        {t.levelLabels[level.id]}
      </span>
    </Link>
  );
}
