"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useRewards } from "@/components/useRewards";
import { isSaved, POINTS, toggleSave } from "@/lib/rewards";
import { formatNumber, type Locale } from "@/lib/i18n";

export default function SaveOfferButton({
  offerId,
  locale,
  t,
}: {
  offerId: number;
  locale: Locale;
  t: { save: string; saved: string; earned: string };
}) {
  const state = useRewards();
  const [mounted, setMounted] = useState(false);
  const [justEarned, setJustEarned] = useState(false);

  useEffect(() => setMounted(true), []);

  const saved = mounted && isSaved(state, offerId);

  const onClick = () => {
    const wasSaved = isSaved(state, offerId);
    toggleSave(offerId);
    if (!wasSaved) {
      setJustEarned(true);
      window.setTimeout(() => setJustEarned(false), 2200);
    }
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        className={`inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-bold transition-colors ${
          saved
            ? "bg-brand-600 text-white hover:bg-brand-700"
            : "surface hover:bg-[var(--surface-muted)]"
        }`}
      >
        {saved ? (
          <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Bookmark className="h-4 w-4" aria-hidden="true" />
        )}
        {saved ? t.saved : t.save}
      </button>

      {/* Says what the action was worth, then gets out of the way. */}
      {justEarned && (
        <span
          role="status"
          className="pointer-events-none absolute -top-8 start-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-brand-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg rtl:translate-x-1/2"
        >
          {t.earned.replace(
            "{points}",
            formatNumber(POINTS.save, locale),
          )}
        </span>
      )}
    </span>
  );
}
