import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Check,
  Rocket,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import ServiceIcon from "@/components/ServiceIcon";
import ConsultancyForm from "@/components/ConsultancyForm";
import { consultancyServices } from "@/lib/data";
import { getTranslator, isLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ConsultancyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const t = getTranslator(locale, "Consultancy");

  const audiences = [
    {
      title: t("newBusiness"),
      desc: t("newBusinessDesc"),
      Icon: Rocket,
      tint: "bg-accent-50 text-accent-600 dark:bg-accent-900/40 dark:text-accent-300",
    },
    {
      title: t("existingShop"),
      desc: t("existingShopDesc"),
      Icon: TrendingUp,
      tint: "bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-300",
    },
  ];

  const steps = [
    { title: t("step1Title"), desc: t("step1Desc") },
    { title: t("step2Title"), desc: t("step2Desc") },
    { title: t("step3Title"), desc: t("step3Desc") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-gradient-to-br from-violet-700 via-violet-800 to-indigo-900 text-white">
        <div
          className="pointer-events-none absolute -end-24 -top-28 h-96 w-96 rounded-full bg-violet-400/25 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {t("navTitle")}
          </p>
          <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-violet-100 sm:text-base">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#request"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-violet-800 shadow-lg transition-transform hover:scale-[1.03]"
            >
              {t("heroCtaPrimary")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-5 py-3 text-sm font-bold backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              {t("heroCtaSecondary")}
            </a>
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="mb-6 text-2xl font-black tracking-tight">
          {t("audienceTitle")}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {audiences.map(({ title, desc, Icon, tint }) => (
            <div key={title} className="surface rounded-3xl p-6">
              <span className={`inline-grid h-12 w-12 place-items-center rounded-2xl ${tint}`}>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-6">
          <h2 className="text-2xl font-black tracking-tight">
            {t("servicesTitle")}
          </h2>
          <p className="mt-1 text-sm muted">{t("servicesSubtitle")}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {consultancyServices.map((service) => (
            <article
              key={service.id}
              className={`surface relative flex flex-col rounded-4xl p-6 ${
                service.popular ? "ring-2 ring-violet-500" : ""
              }`}
            >
              {service.popular && (
                <span className="absolute -top-3 end-6 rounded-full bg-violet-600 px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                  {t("popular")}
                </span>
              )}

              <ServiceIcon icon={service.icon} accent={service.accent} />

              <h3 className="mt-4 text-lg font-bold">{t(service.titleKey)}</h3>
              <p className="mt-2 text-sm leading-relaxed muted">
                {t(service.descKey)}
              </p>

              <ul className="mt-5 space-y-2.5">
                {service.featureKeys.map((key) => (
                  <li key={key} className="flex items-start gap-2 text-sm">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                      aria-hidden="true"
                    />
                    {t(key)}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-end justify-between gap-4 border-t border-[var(--border-subtle)] pt-5">
                <p>
                  <span className="block text-xs muted">
                    {t("startingFrom")}
                  </span>
                  <span className="text-xl font-black">
                    {locale === "bn" ? service.priceBn : service.priceEn}
                  </span>
                  {service.priceUnit !== "free" && (
                    <span className="text-xs muted">
                      {service.priceUnit === "perMonth"
                        ? t("perMonth")
                        : ` ${t("oneTime")}`}
                    </span>
                  )}
                </p>
                <Link
                  href={`/${locale}/consultancy/${service.id}/`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-700"
                >
                  {t("learnMore")}
                  <ArrowRight
                    className="h-4 w-4 rtl:rotate-180"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="mb-6 text-2xl font-black tracking-tight">
          {t("howTitle")}
        </h2>
        <ol className="grid gap-5 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="surface rounded-3xl p-6">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-violet-600 text-sm font-black text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-bold">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed muted">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Request form */}
      <section id="request" className="mx-auto max-w-3xl px-4 pb-20">
        <div className="surface rounded-4xl p-7 sm:p-9">
          <h2 className="text-2xl font-black tracking-tight">
            {t("ctaTitle")}
          </h2>
          <p className="mt-2 text-sm muted">{t("ctaDesc")}</p>
          <ConsultancyForm
            t={{
              formName: t("formName"),
              formShop: t("formShop"),
              formPhone: t("formPhone"),
              formService: t("formService"),
              formMessage: t("formMessage"),
              formSubmit: t("formSubmit"),
              formNote: t("formNote"),
              formSuccess: t("formSuccess"),
              options: consultancyServices.map((s) => ({
                id: s.id,
                label: t(s.titleKey),
              })),
            }}
          />
        </div>
      </section>
    </>
  );
}
