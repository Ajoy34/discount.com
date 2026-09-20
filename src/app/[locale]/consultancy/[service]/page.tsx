import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import ServiceIcon from "@/components/ServiceIcon";
import ConsultancyForm from "@/components/ConsultancyForm";
import { consultancyServices, getConsultancyService } from "@/lib/data";
import { getTranslator, isLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    consultancyServices.map((service) => ({ locale, service: service.id })),
  );
}

export const dynamicParams = false;

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; service: string }>;
}) {
  const { locale: raw, service: serviceId } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const service = getConsultancyService(serviceId);
  if (!service) notFound();

  const t = getTranslator(locale, "Consultancy");
  const others = consultancyServices.filter((s) => s.id !== service.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href={`/${locale}/consultancy/`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold muted hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        {t("navTitle")}
      </Link>

      <header className="flex items-start gap-4">
        <ServiceIcon
          icon={service.icon}
          accent={service.accent}
          className="h-14 w-14"
        />
        <div className="min-w-0">
          <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
            {t(service.titleKey)}
          </h1>
          <p className="mt-2 text-sm leading-relaxed muted">
            {t(service.descKey)}
          </p>
        </div>
      </header>

      <div className="surface mt-7 flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
        <p>
          <span className="block text-xs muted">{t("startingFrom")}</span>
          <span className="text-2xl font-black">
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
        <a
          href="#request"
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700"
        >
          {t("requestService")}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        </a>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-black tracking-tight">
          {t("servicesTitle")}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {service.featureKeys.map((key) => (
            <li
              key={key}
              className="surface flex items-start gap-2.5 rounded-2xl p-4 text-sm"
            >
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                aria-hidden="true"
              />
              {t(key)}
            </li>
          ))}
        </ul>
      </section>

      <section id="request" className="surface mt-10 rounded-4xl p-7">
        <h2 className="text-xl font-black tracking-tight">{t("ctaTitle")}</h2>
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
            options: [
              { id: service.id, label: t(service.titleKey) },
              ...others.map((s) => ({ id: s.id, label: t(s.titleKey) })),
            ],
          }}
        />
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-black tracking-tight">
          {t("servicesTitle")}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {others.map((other) => (
            <li key={other.id}>
              <Link
                href={`/${locale}/consultancy/${other.id}/`}
                className="card-interactive surface flex h-full flex-col gap-3 rounded-3xl p-5"
              >
                <ServiceIcon
                  icon={other.icon}
                  accent={other.accent}
                  className="h-10 w-10"
                />
                <span className="text-sm font-bold">{t(other.titleKey)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
