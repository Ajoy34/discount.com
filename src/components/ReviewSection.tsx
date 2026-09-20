"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, ShieldCheck, ShieldX, ThumbsUp, Trash2 } from "lucide-react";
import { Stars, StarInput } from "@/components/StarRating";
import type { Review } from "@/lib/data";
import {
  addLocalReview,
  localReviews,
  newReviewId,
  removeLocalReview,
} from "@/lib/localReviews";
import { formatNumber, type Locale } from "@/lib/i18n";

export interface ReviewStrings {
  title: string;
  subtitle: string;
  writeTitle: string;
  yourName: string;
  yourRating: string;
  star: string;
  stars: string;
  yourReview: string;
  wasHonoured: string;
  yes: string;
  no: string;
  submit: string;
  posted: string;
  localOnly: string;
  incomplete: string;
  none: string;
  helpful: string;
  honoured: string;
  notHonoured: string;
  yours: string;
  averageOf: string;
  delete: string;
}

export default function ReviewSection({
  offerId,
  seed,
  locale,
  t,
}: {
  offerId: number;
  seed: Review[];
  locale: Locale;
  t: ReviewStrings;
}) {
  const [mine, setMine] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [honoured, setHonoured] = useState(true);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);

  // Read after mount so the server and first client render agree.
  useEffect(() => {
    setMine(localReviews(offerId));
  }, [offerId]);

  const all = useMemo(() => [...mine, ...seed], [mine, seed]);
  const average = useMemo(
    () =>
      all.length === 0
        ? 0
        : all.reduce((sum, r) => sum + r.rating, 0) / all.length,
    [all],
  );

  const submit = () => {
    if (name.trim().length < 2 || rating === 0 || body.trim().length < 4) {
      setError(true);
      return;
    }
    setError(false);
    const review: Review = {
      id: newReviewId(),
      offerId,
      author: name.trim(),
      rating,
      body: body.trim(),
      postedAt: new Date().toISOString().slice(0, 10),
      honoured,
      helpful: 0,
    };
    setMine(addLocalReview(review));
    setName("");
    setRating(0);
    setBody("");
    setHonoured(true);
    setSaved(true);
  };

  return (
    <section className="mt-10">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight">{t.title}</h2>
          <p className="mt-1 text-sm muted">{t.subtitle}</p>
        </div>
        {all.length > 0 && (
          <p className="flex items-center gap-2 text-sm font-bold">
            <Stars value={average} />
            <span>
              {t.averageOf
                .replace("{rating}", formatNumber(Math.round(average * 10) / 10, locale))
                .replace("{count}", formatNumber(all.length, locale))}
            </span>
          </p>
        )}
      </div>

      {/* Write */}
      <div className="surface rounded-3xl p-5 sm:p-6">
        <h3 className="mb-4 text-sm font-black uppercase tracking-wider muted">
          {t.writeTitle}
        </h3>

        {saved && (
          <p
            role="status"
            className="mb-4 flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800 dark:bg-brand-950/60 dark:text-brand-200"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            {t.posted}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="rv-name" className="block text-sm font-bold">
              {t.yourName}
            </label>
            <input
              id="rv-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="surface w-full rounded-2xl px-4 py-3 text-sm outline-none"
            />
          </div>

          <StarInput
            name="rv-rating"
            value={rating}
            onChange={setRating}
            legend={t.yourRating}
            starLabel={t.star}
            starsLabel={t.stars}
          />
        </div>

        <div className="mt-4 space-y-1.5">
          <label htmlFor="rv-body" className="block text-sm font-bold">
            {t.yourReview}
          </label>
          <textarea
            id="rv-body"
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="surface w-full resize-y rounded-2xl px-4 py-3 text-sm outline-none"
          />
        </div>

        <fieldset className="mt-4">
          <legend className="mb-2 block text-sm font-bold">
            {t.wasHonoured}
          </legend>
          <div className="flex gap-2">
            {[
              { value: true, label: t.yes },
              { value: false, label: t.no },
            ].map((option) => (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => setHonoured(option.value)}
                aria-pressed={honoured === option.value}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                  honoured === option.value
                    ? "bg-brand-600 text-white"
                    : "surface muted hover:bg-[var(--surface-muted)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        {error && (
          <p
            role="alert"
            className="mt-4 flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-300"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {t.incomplete}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={submit}
            className="rounded-2xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700"
          >
            {t.submit}
          </button>
          <p className="text-xs muted">{t.localOnly}</p>
        </div>
      </div>

      {/* Read */}
      {all.length === 0 ? (
        <p className="surface mt-5 rounded-3xl px-5 py-12 text-center text-sm muted">
          {t.none}
        </p>
      ) : (
        <ul className="mt-5 space-y-4">
          {all.map((review) => {
            const isMine = review.id.startsWith("local-");
            return (
              <li key={review.id} className="surface rounded-3xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="flex flex-wrap items-center gap-2 font-bold">
                      {review.author}
                      {isMine && (
                        <span className="rounded-lg bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                          {t.yours}
                        </span>
                      )}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xs muted">
                      <Stars value={review.rating} className="h-3.5 w-3.5" />
                      <span>{review.postedAt}</span>
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] font-bold ${
                      review.honoured
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                        : "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                    }`}
                  >
                    {review.honoured ? (
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <ShieldX className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {review.honoured ? t.honoured : t.notHonoured}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed">{review.body}</p>

                <div className="mt-3 flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 text-xs muted">
                    <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
                    {t.helpful} · {formatNumber(review.helpful, locale)}
                  </span>
                  {isMine && (
                    <button
                      type="button"
                      onClick={() =>
                        setMine(removeLocalReview(offerId, review.id))
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 hover:underline dark:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {t.delete}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
