import Link from "next/link";
import { defaultLocale, getTranslator } from "@/lib/i18n";

export default function NotFound() {
  const t = getTranslator(defaultLocale, "Common");

  return (
    <main className="flex-1 grid place-items-center px-6 py-24 text-center">
      <div className="space-y-4">
        <p className="text-6xl font-black tracking-tight text-brand-600">404</p>
        <h1 className="text-xl font-bold">{t("notFoundTitle")}</h1>
        <p className="mx-auto max-w-sm text-sm muted">{t("notFoundDesc")}</p>
        <Link
          href={`/${defaultLocale}/`}
          className="mt-2 inline-block rounded-2xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
        >
          {t("backHome")}
        </Link>
      </div>
    </main>
  );
}
