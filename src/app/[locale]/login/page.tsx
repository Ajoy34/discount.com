import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LoginClient from "@/components/LoginClient";
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
  return { title: `${getTranslator(l, "Auth")("title")} — ${getTranslator(l, "Common")("titleSuffix")}` };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const t = getTranslator(locale, "Auth");
  const tIndex = getTranslator(locale, "Index");

  return (
    <LoginClient
      locale={locale}
      t={{
        title: t("title"),
        phone: t("phone"),
        phonePlaceholder: t("phonePlaceholder"),
        sendCode: t("sendCode"),
        verifyCode: t("verifyCode"),
        codePlaceholder: t("codePlaceholder"),
        iAmCustomer: t("iAmCustomer"),
        iAmOwner: t("iAmOwner"),
        findShops: t("findShops"),
        manageShop: t("manageShop"),
        wrongNumber: t("wrongNumber"),
        chooseRole: t("chooseRole"),
        terms: t("terms"),
        brand: tIndex("title"),
      }}
    />
  );
}
