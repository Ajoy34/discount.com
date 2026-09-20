"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeLabels, otherLocale, type Locale } from "@/lib/i18n";

/**
 * Switches language without losing the reader's place. Needs the current path,
 * so it is a client component; the footer previously sent everyone back to the
 * locale home page, which on a phone was the only switcher on screen.
 */
export default function LocaleSwitch({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const pathname = usePathname();
  const other = otherLocale(locale);
  const href = pathname
    ? pathname.replace(`/${locale}`, `/${other}`)
    : `/${other}/`;

  return (
    <Link href={href} hrefLang={other} className={className}>
      {localeLabels[other]}
    </Link>
  );
}
