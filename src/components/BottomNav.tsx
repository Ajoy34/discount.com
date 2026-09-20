"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Tag, Sparkles, LayoutDashboard } from "lucide-react";
import type { Locale } from "@/lib/i18n";

/**
 * Thumb-reachable navigation for phones. Most of this audience arrives on a
 * mobile browser, so the primary destinations stay fixed at the bottom of the
 * viewport instead of hidden behind a menu button.
 */
export default function BottomNav({
  locale,
  t,
}: {
  locale: Locale;
  t: {
    home: string;
    search: string;
    offers: string;
    consultancyShort: string;
    dashboard: string;
  };
}) {
  const pathname = usePathname() ?? "";

  const items = [
    { href: `/${locale}/`, label: t.home, Icon: Home, exact: true },
    { href: `/${locale}/search/`, label: t.search, Icon: Search },
    { href: `/${locale}/offers/`, label: t.offers, Icon: Tag },
    {
      href: `/${locale}/consultancy/`,
      label: t.consultancyShort,
      Icon: Sparkles,
    },
    {
      href: `/${locale}/dashboard/`,
      label: t.dashboard,
      Icon: LayoutDashboard,
    },
  ];

  return (
    <nav
      aria-label={t.home}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-subtle)] bg-[var(--surface-card)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch">
        {items.map(({ href, label, Icon, exact }) => {
          const active = exact
            ? pathname === href || pathname === href.slice(0, -1)
            : pathname.startsWith(href.slice(0, -1));
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 px-1 py-2.5 text-[11px] font-semibold transition-colors ${
                  active ? "text-brand-600" : "muted"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`}
                  aria-hidden="true"
                />
                <span className="line-clamp-1">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
