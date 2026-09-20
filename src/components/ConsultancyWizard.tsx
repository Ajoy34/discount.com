"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react";
import ServiceIcon from "@/components/ServiceIcon";
import type { ConsultancyServiceId } from "@/lib/data";
import type { Locale } from "@/lib/i18n";

export interface WizardStrings {
  openLabel: string;
  title: string;
  intro: string;
  q1: string;
  q1a: string;
  q1b: string;
  q1c: string;
  q2: string;
  q2a: string;
  q2b: string;
  q2c: string;
  q2d: string;
  q3: string;
  q3a: string;
  q3b: string;
  q3c: string;
  back: string;
  next: string;
  skip: string;
  close: string;
  resultTitle: string;
  resultWhy: string;
  seeService: string;
  startOver: string;
  browsing: string;
  seeOffers: string;
  step: string;
}

export interface WizardService {
  id: ConsultancyServiceId;
  title: string;
  description: string;
  icon: "megaphone" | "sparkles" | "globe" | "book";
  accent: "orange" | "violet" | "sky" | "emerald";
}

type Stage = "who" | "need" | "budget" | "result";

const SEEN_KEY = "discounty.wizard.seen.v1";

/**
 * Recommends one service from three answers.
 *
 * Budget is the strongest constraint: suggesting a paid build to somebody who
 * said they cannot spend yet wastes both sides' time, so that answer always
 * lands on the free guide.
 */
function recommend(
  who: string,
  need: string,
  budget: string,
): { id: ConsultancyServiceId; reasonKey: "q1" | "q2" | "q3" } {
  if (budget === "q3a") return { id: "guide", reasonKey: "q3" };
  if (need === "q2b") return { id: "website", reasonKey: "q2" };
  if (need === "q2c") return { id: "guide", reasonKey: "q2" };
  if (need === "q2d") return { id: "ai-ad", reasonKey: "q2" };
  // Wants reach: a new business needs creative built for it, an existing shop
  // is better served by cheap, repeatable output.
  if (who === "q1a" && budget === "q3c")
    return { id: "ad-creation", reasonKey: "q1" };
  return { id: "ai-ad", reasonKey: "q2" };
}

export default function ConsultancyWizard({
  locale,
  t,
  services,
  /** Opens itself once per browser, a beat after the page settles. */
  autoOpen = false,
}: {
  locale: Locale;
  t: WizardStrings;
  services: WizardService[];
  autoOpen?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement | null>(null);
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("who");
  const [who, setWho] = useState("");
  const [need, setNeed] = useState("");
  const [budget, setBudget] = useState("");

  const show = useCallback(() => {
    setOpen(true);
    if (!dialog.current?.open) dialog.current?.showModal();
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
    if (dialog.current?.open) dialog.current.close();
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Not remembering is fine; it just asks again next visit.
    }
  }, []);

  useEffect(() => {
    if (!autoOpen) return;
    // A modal that appears on its own would sit over every automated run.
    if (navigator.webdriver) return;
    let seen = true;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = true;
    }
    if (seen) return;

    const timer = window.setTimeout(show, 2500);
    return () => window.clearTimeout(timer);
  }, [autoOpen, show]);

  // The dialog can also be dismissed with Escape, which fires close directly.
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const onClose = () => setOpen(false);
    node.addEventListener("close", onClose);
    return () => node.removeEventListener("close", onClose);
  }, []);

  const reset = () => {
    setStage("who");
    setWho("");
    setNeed("");
    setBudget("");
  };

  const steps: {
    stage: Stage;
    question: string;
    options: { value: string; label: string }[];
    value: string;
    set: (v: string) => void;
    index: number;
  }[] = [
    {
      stage: "who",
      question: t.q1,
      options: [
        { value: "q1a", label: t.q1a },
        { value: "q1b", label: t.q1b },
        { value: "q1c", label: t.q1c },
      ],
      value: who,
      set: setWho,
      index: 1,
    },
    {
      stage: "need",
      question: t.q2,
      options: [
        { value: "q2a", label: t.q2a },
        { value: "q2b", label: t.q2b },
        { value: "q2c", label: t.q2c },
        { value: "q2d", label: t.q2d },
      ],
      value: need,
      set: setNeed,
      index: 2,
    },
    {
      stage: "budget",
      question: t.q3,
      options: [
        { value: "q3a", label: t.q3a },
        { value: "q3b", label: t.q3b },
        { value: "q3c", label: t.q3c },
      ],
      value: budget,
      set: setBudget,
      index: 3,
    },
  ];

  const current = steps.find((s) => s.stage === stage);
  const result = recommend(who, need, budget);
  const service = services.find((s) => s.id === result.id);
  const browsingOnly = who === "q1c";

  const choose = (step: (typeof steps)[number], value: string) => {
    step.set(value);
    if (step.stage === "who" && value === "q1c") {
      setStage("result");
      return;
    }
    setStage(
      step.stage === "who" ? "need" : step.stage === "need" ? "budget" : "result",
    );
  };

  const goBack = () => {
    if (stage === "result") setStage(browsingOnly ? "who" : "budget");
    else if (stage === "budget") setStage("need");
    else if (stage === "need") setStage("who");
  };

  return (
    <>
      <button
        type="button"
        onClick={show}
        className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-violet-800 shadow-lg transition-transform hover:scale-[1.03]"
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        {t.openLabel}
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="wizard-title"
        className="w-[min(34rem,calc(100vw-2rem))] rounded-4xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-0 text-[var(--text-strong)] backdrop:bg-zinc-950/60 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="p-6 sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="wizard-title" className="text-xl font-black tracking-tight">
                  {t.title}
                </h2>
                <p className="mt-1 text-sm muted">{t.intro}</p>
              </div>
              <button
                type="button"
                onClick={hide}
                aria-label={t.close}
                className="rounded-xl p-2 hover:bg-[var(--surface-muted)]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {current ? (
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider muted">
                  {t.step
                    .replace("{current}", String(current.index))
                    .replace("{total}", "3")}
                </p>
                <div
                  className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]"
                  role="presentation"
                >
                  <div
                    className="h-full rounded-full bg-violet-600 transition-[width] duration-300"
                    style={{ width: `${(current.index / 3) * 100}%` }}
                  />
                </div>

                <fieldset>
                  <legend className="mb-3 text-base font-bold">
                    {current.question}
                  </legend>
                  <div className="space-y-2">
                    {current.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => choose(current, option.value)}
                        aria-pressed={current.value === option.value}
                        className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3.5 text-start text-sm font-semibold transition-colors ${
                          current.value === option.value
                            ? "border-violet-600 bg-violet-50 dark:bg-violet-950/50"
                            : "border-[var(--border-subtle)] hover:bg-[var(--surface-muted)]"
                        }`}
                      >
                        {option.label}
                        <ArrowRight
                          className="h-4 w-4 shrink-0 muted rtl:rotate-180"
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={stage === "who"}
                    className="inline-flex items-center gap-1.5 text-sm font-bold muted hover:text-brand-600 disabled:opacity-40 dark:hover:text-brand-400"
                  >
                    <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                    {t.back}
                  </button>
                  <button
                    type="button"
                    onClick={hide}
                    className="text-sm font-bold muted hover:underline"
                  >
                    {t.skip}
                  </button>
                </div>
              </div>
            ) : browsingOnly ? (
              <div className="space-y-5">
                <p className="text-sm leading-relaxed">{t.browsing}</p>
                <div className="flex flex-wrap gap-2.5">
                  <Link
                    href={`/${locale}/offers/`}
                    onClick={hide}
                    className="rounded-2xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
                  >
                    {t.seeOffers}
                  </Link>
                  <button
                    type="button"
                    onClick={reset}
                    className="surface rounded-2xl px-5 py-3 text-sm font-bold hover:bg-[var(--surface-muted)]"
                  >
                    {t.startOver}
                  </button>
                </div>
              </div>
            ) : service ? (
              <div className="space-y-5">
                <p className="text-xs font-bold uppercase tracking-wider muted">
                  {t.resultTitle}
                </p>

                <div className="flex items-start gap-4 rounded-3xl border-2 border-violet-600 p-5">
                  <ServiceIcon
                    icon={service.icon}
                    accent={service.accent}
                    className="h-12 w-12"
                  />
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold">{service.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed muted">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <Link
                    href={`/${locale}/consultancy/${service.id}/`}
                    onClick={hide}
                    className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
                  >
                    {t.seeService}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    onClick={reset}
                    className="surface rounded-2xl px-5 py-3 text-sm font-bold hover:bg-[var(--surface-muted)]"
                  >
                    {t.startOver}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </dialog>
    </>
  );
}
