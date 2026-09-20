"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  MapPin,
  Sparkles,
  LogIn,
  Store,
} from "lucide-react";
import { otherLocale, localeLabels, type Locale } from "@/lib/i18n";

interface NavStrings {
  home: string;
  search: string;
  offers: string;
  dashboard: string;
  consultancy: string;
  consultancyShort: string;
  login: string;
  menu: string;
  closeMenu: string;
  skipToContent: string;
  title: string;
  searchPlaceholder: string;
}

export default function Header({
  locale,
  t,
}: {
  locale: Locale;
  t: NavStrings;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const other = otherLocale(locale);

  /** Same page, other language — falls back to that locale's home. */
  const switchHref = pathname
    ? pathname.replace(`/${locale}`, `/${other}`)
    : `/${other}/`;

  const links: { href: string; label: string; badge?: boolean }[] = [
    { href: `/${locale}/search/`, label: t.search },
    { href: `/${locale}/offers/`, label: t.offers },
    { href: `/${locale}/consultancy/`, label: t.consultancy, badge: true },
    { href: `/${locale}/dashboard/`, label: t.dashboard },
  ];

  const isActive = (href: string) => pathname?.startsWith(href.slice(0, -1));

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--surface-card)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link
          href={`/${locale}/`}
          className="shrink-0 text-lg font-black tracking-tight"
        >
          {t.title}
          <span className="text-brand-600 dark:text-brand-400">.</span>
        </Link>

        <span className="hidden items-center gap-1 rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-semibold muted sm:inline-flex">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          Dhaka
        </span>

        {/* Desktop search shortcut */}
        <Link
          href={`/${locale}/search/`}
          className="ms-auto hidden min-w-0 flex-1 items-center gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm muted transition-colors hover:border-brand-400 md:flex md:max-w-sm"
        >
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{t.searchPlaceholder}</span>
        </Link>

        <nav className="ms-auto hidden items-center gap-1 md:ms-0 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                  : "muted hover:bg-[var(--surface-muted)]"
              }`}
            >
              {link.label}
              {link.badge && (
                <Sparkles
                  className="ms-1 inline h-3.5 w-3.5 text-accent-500"
                  aria-hidden="true"
                />
              )}
            </Link>
          ))}
        </nav>

        <Link
          href={switchHref}
          hrefLang={other}
          className="hidden rounded-xl border border-[var(--border-subtle)] px-2.5 py-1.5 text-xs font-bold transition-colors hover:bg-[var(--surface-muted)] md:block"
        >
          {localeLabels[other]}
        </Link>

        <Link
          href={`/${locale}/login/`}
          className="hidden items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-700 md:inline-flex"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          {t.login}
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t.closeMenu : t.menu}
          className="ms-auto rounded-xl p-2 hover:bg-[var(--surface-muted)] md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-[var(--border-subtle)] bg-[var(--surface-card)] md:hidden"
        >
          <nav className="mx-auto max-w-6xl space-y-1 px-4 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-[var(--surface-muted)]"
              >
                {link.label}
                {link.badge && (
                  <Sparkles
                    className="h-4 w-4 text-accent-500"
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <Link
                href={`/${locale}/login/`}
                onClick={() => setOpen(false)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white"
              >
                <Store className="h-4 w-4" aria-hidden="true" />
                {t.login}
              </Link>
              <Link
                href={switchHref}
                hrefLang={other}
                onClick={() => setOpen(false)}
                className="rounded-xl border border-[var(--border-subtle)] px-3 py-2.5 text-xs font-bold"
              >
                {localeLabels[other]}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
