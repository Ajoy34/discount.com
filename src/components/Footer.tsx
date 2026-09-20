import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { contact, displayPhone, telHref } from "@/lib/contact";
import { localeLabels, otherLocale, type Locale } from "@/lib/i18n";

interface FooterStrings {
  tagline: string;
  forCustomers: string;
  forBusiness: string;
  company: string;
  about: string;
  contact: string;
  privacy: string;
  terms: string;
  rights: string;
  language: string;
  contactHeading: string;
  title: string;
  home: string;
  search: string;
  offers: string;
  consultancy: string;
  dashboard: string;
}

export default function Footer({
  locale,
  t,
}: {
  locale: Locale;
  t: FooterStrings;
}) {
  const other = otherLocale(locale);

  const columns = [
    {
      heading: t.forCustomers,
      links: [
        { href: `/${locale}/`, label: t.home },
        { href: `/${locale}/search/`, label: t.search },
        { href: `/${locale}/offers/`, label: t.offers },
      ],
    },
    {
      heading: t.forBusiness,
      links: [
        { href: `/${locale}/consultancy/`, label: t.consultancy },
        { href: `/${locale}/dashboard/`, label: t.dashboard },
        { href: `/${locale}/login/`, label: t.about },
      ],
    },
  ];

  return (
    <footer className="mt-16 border-t border-[var(--border-subtle)] bg-[var(--surface-card)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-3">
          <p className="text-lg font-black tracking-tight">
            {t.title}
            <span className="text-brand-600 dark:text-brand-400">.</span>
          </p>
          <p className="max-w-xs text-sm muted">{t.tagline}</p>
        </div>

        {columns.map((col) => (
          <nav key={col.heading} aria-label={col.heading} className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider muted">
              {col.heading}
            </h2>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider muted">
            {t.contactHeading}
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href={telHref}
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-brand-600 dark:hover:text-brand-400"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {displayPhone(locale)}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-2 break-all text-sm font-medium hover:text-brand-600 dark:hover:text-brand-400"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {contact.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider muted">
            {t.language}
          </h2>
          <Link
            href={`/${other}/`}
            hrefLang={other}
            className="inline-block rounded-xl border border-[var(--border-subtle)] px-3 py-2 text-sm font-bold hover:bg-[var(--surface-muted)]"
          >
            {localeLabels[other]}
          </Link>
        </div>
      </div>

      <div className="border-t border-[var(--border-subtle)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {t.title}. {t.rights}
          </p>
          <p className="flex gap-4">
            <span>{t.privacy}</span>
            <span>{t.terms}</span>
            <a
              href={`mailto:${contact.email}`}
              className="hover:text-brand-600 dark:hover:text-brand-400"
            >
              {t.contact}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
