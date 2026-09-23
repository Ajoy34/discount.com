import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import CheckoutClient from "@/components/CheckoutClient";
import { bidToBeat } from "@/lib/data";
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
  const t = getTranslator(l, "Checkout");
  return {
    title: `${t("title")} — ${getTranslator(l, "Common")("titleSuffix")}`,
    description: t("subtitle"),
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getTranslator(locale, "Checkout");
  const loading = getTranslator(locale, "Index")("loading");

  const strings = {
    title: t("title"),
    subtitle: t("subtitle"),
    backToLeaderboard: t("backToLeaderboard"),
    amountLabel: t("amountLabel"),
    amountHint: t("amountHint"),
    amountInvalid: t("amountInvalid"),
    shopLabel: t("shopLabel"),
    nameLabel: t("nameLabel"),
    phoneLabel: t("phoneLabel"),
    methodTitle: t("methodTitle"),
    methodSubtitle: t("methodSubtitle"),
    sslTitle: t("sslTitle"),
    sslDesc: t("sslDesc"),
    stripeTitle: t("stripeTitle"),
    stripeDesc: t("stripeDesc"),
    bankTitle: t("bankTitle"),
    bankDesc: t("bankDesc"),
    selected: t("selected"),
    summaryTitle: t("summaryTitle"),
    summaryBid: t("summaryBid"),
    summaryMethod: t("summaryMethod"),
    summaryPlacement: t("summaryPlacement"),
    continueWhatsapp: t("continueWhatsapp"),
    continueEmail: t("continueEmail"),
    formIncomplete: t("formIncomplete"),
    requestHeading: t("requestHeading"),
    emailSubject: t("emailSubject"),
    msgAmount: t("msgAmount"),
    msgMethod: t("msgMethod"),
    msgService: t("msgService"),
    msgDetails: t("msgDetails"),
    secureTitle: t("secureTitle"),
    secure1: t("secure1"),
    secure2: t("secure2"),
    secure3: t("secure3"),
    noCardNote: t("noCardNote"),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href={`/${locale}/leaderboard/`}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold muted hover:text-[var(--text-strong)]"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        {strings.backToLeaderboard}
      </Link>

      <header className="mb-7">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight sm:text-3xl">
          <ShieldCheck className="h-6 w-6 text-brand-600" aria-hidden="true" />
          {strings.title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm muted">{strings.subtitle}</p>
      </header>

      {/*
        The suggested amount can arrive as a ?amount= query param (from the
        leaderboard's "take the top spot" and "outbid" buttons), so reading
        it opts this subtree out of prerendering.
      */}
      <Suspense fallback={<p className="py-8 text-sm muted">{loading}</p>}>
        <CheckoutClient
          locale={locale}
          t={strings}
          suggestedAmount={bidToBeat()}
        />
      </Suspense>
    </div>
  );
}
