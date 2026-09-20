import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Trophy } from "lucide-react";
import LeaderboardBoard from "@/components/Leaderboard";
import { getTranslator, isLocale, locales, type Locale } from "@/lib/i18n";

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
  const t = getTranslator(l, "Leaderboard");
  return {
    title: `${t("title")} — ${getTranslator(l, "Common")("titleSuffix")}`,
    description: t("subtitle"),
  };
}

export default async function LeaderboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getTranslator(locale, "Leaderboard");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-7">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight sm:text-3xl">
          <Trophy className="h-6 w-6 text-accent-600" aria-hidden="true" />
          {t("title")}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm muted">{t("subtitle")}</p>
      </header>

      <LeaderboardBoard locale={locale} />
    </div>
  );
}
