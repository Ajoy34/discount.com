"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ChevronDown,
  LayoutGrid,
  LogIn,
  Menu,
  Search,
  Store,
  Tag,
  Trophy,
  X,
} from "lucide-react";
import LocaleSwitch from "@/components/LocaleSwitch";
import type { CategoryId } from "@/lib/data";
import type { Locale } from "@/lib/i18n";

export interface NavStrings {
  home: string;
  search: string;
  offers: string;
  dashboard: string;
  consultancy: string;
  consultancyShort: string;
  leaderboard: string;
  categories: string;
  browseCategories: string;
  forBusiness: string;
  allOffers: string;
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
  categories,
}: {
  locale: Locale;
  t: NavStrings;
  categories: { id: CategoryId; label: string }[];
}) {
  const catsRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname() ?? "";

  // Both menus remember the path they were opened on, so navigating away
  // closes them without an effect that writes state on every render.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [catsPath, setCatsPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const catsOpen = catsPath === pathname;

  const setMenuOpen = (open: boolean) => setMenuPath(open ? pathname : null);
  const setCatsOpen = (open: boolean) => setCatsPath(open ? pathname : null);

  // A dropdown that only closes via its own button is a trap on desktop.
  useEffect(() => {
    if (!catsOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!catsRef.current?.contains(e.target as Node)) setCatsPath(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCatsPath(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [catsOpen]);

  const isActive = (href: string) => pathname.startsWith(href.slice(0, -1));

  const customerLinks = [
    { href: `/${locale}/search/`, label: t.search, Icon: Search },
    { href: `/${locale}/leaderboard/`, label: t.leaderboard, Icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--surface-card)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link
          href={`/${locale}/`}
          className="shrink-0 text-lg font-black tracking-tight"
        >
          {t.title}
          <span className="text-brand-600 dark:text-brand-400">.</span>
        </Link>


        {/* Customer navigation */}
        <nav aria-label={t.home} className="hidden items-center gap-1 md:flex">

          {/* Categories is its own item: a chevron alone was too easy to miss */}
          <div className="relative" ref={catsRef}>
            <button
              type="button"
              onClick={() => setCatsOpen(!catsOpen)}
              aria-expanded={catsOpen}
              aria-controls="offer-categories"
              aria-label={t.browseCategories}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                catsOpen
                  ? "bg-[var(--surface-muted)]"
                  : "muted hover:bg-[var(--surface-muted)]"
              }`}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              {t.categories}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  catsOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {catsOpen && (
              <div
                id="offer-categories"
                className="absolute start-0 top-full z-50 mt-2 w-64 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-2 shadow-xl"
              >
                <Link
                  href={`/${locale}/offers/`}
                  className="mb-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold hover:bg-[var(--surface-muted)]"
                >
                  <Tag className="h-4 w-4 muted" aria-hidden="true" />
                  {t.allOffers}
                </Link>
                <p className="border-t border-[var(--border-subtle)] px-3 pb-1.5 pt-2 text-[11px] font-bold uppercase tracking-wider muted">
                  {t.categories}
                </p>
                <ul className="grid grid-cols-2 gap-0.5">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/${locale}/offers/?category=${category.id}`}
                        className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[var(--surface-muted)]"
                      >
                        {category.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {customerLinks.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                isActive(href)
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                  : "muted hover:bg-[var(--surface-muted)]"
              }`}
            >
              <Icon className="me-1.5 inline h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Business side, deliberately set apart from the customer links */}
        <div className="ms-auto hidden items-center gap-2 md:flex">
          <span
            className="h-6 w-px bg-[var(--border-subtle)]"
            aria-hidden="true"
          />
          <nav aria-label={t.forBusiness} className="flex items-center gap-2">
            <Link
              href={`/${locale}/consultancy/`}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${
                isActive(`/${locale}/consultancy/`)
                  ? "border-violet-600 bg-violet-50 text-violet-800 dark:bg-violet-950/60 dark:text-violet-200"
                  : "border-[var(--border-subtle)] hover:border-violet-500 hover:bg-[var(--surface-muted)]"
              }`}
            >
              <Briefcase className="h-4 w-4" aria-hidden="true" />
              {t.consultancy}
            </Link>

            <LocaleSwitch
              locale={locale}
              className="rounded-xl border border-[var(--border-subtle)] px-2.5 py-2 text-xs font-bold transition-colors hover:bg-[var(--surface-muted)]"
            />

            <Link
              href={`/${locale}/login/`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-700"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              {t.login}
            </Link>
          </nav>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? t.closeMenu : t.menu}
          className="ms-auto rounded-xl p-2 hover:bg-[var(--surface-muted)] md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="max-h-[70vh] overflow-y-auto border-t border-[var(--border-subtle)] bg-[var(--surface-card)] md:hidden"
        >
          <div className="mx-auto max-w-6xl px-4 py-3">
            <nav aria-label={t.home} className="space-y-1">
              {[
                { href: `/${locale}/offers/`, label: t.allOffers, Icon: Tag },
                ...customerLinks,
              ].map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-[var(--surface-muted)]"
                >
                  <Icon className="h-4 w-4 muted" aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </nav>

            <p className="px-3 pb-1.5 pt-3 text-[11px] font-bold uppercase tracking-wider muted">
              {t.categories}
            </p>
            <ul className="grid grid-cols-2 gap-0.5">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/${locale}/offers/?category=${category.id}`}
                    className="block rounded-xl px-3 py-2 text-sm font-medium hover:bg-[var(--surface-muted)]"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="px-3 pb-1.5 pt-3 text-[11px] font-bold uppercase tracking-wider muted">
              {t.forBusiness}
            </p>
            <Link
              href={`/${locale}/consultancy/`}
              className="flex items-center gap-2.5 rounded-xl border border-violet-500/60 px-3 py-2.5 text-sm font-bold"
            >
              <Briefcase
                className="h-4 w-4 text-violet-600 dark:text-violet-300"
                aria-hidden="true"
              />
              {t.consultancy}
            </Link>

            <div className="mt-3 flex items-center gap-2">
              <Link
                href={`/${locale}/login/`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white"
              >
                <Store className="h-4 w-4" aria-hidden="true" />
                {t.login}
              </Link>
              <LocaleSwitch
                locale={locale}
                className="rounded-xl border border-[var(--border-subtle)] px-3 py-2.5 text-xs font-bold"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
