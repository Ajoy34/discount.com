import en from "../../messages/en.json";
import bn from "../../messages/bn.json";

export const locales = ["bn", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "bn";

/**
 * Both catalogues are imported statically so the export stays fully static and
 * the type of every namespace is inferred from the English file.
 */
const catalogues = { en, bn } satisfies Record<Locale, unknown>;

export type Messages = typeof en;
export type Namespace = keyof Messages;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getMessages(locale: Locale): Messages {
  return catalogues[locale] as Messages;
}

export type Translator<N extends Namespace> = (
  key: keyof Messages[N],
  vars?: Record<string, string | number>,
) => string;

/**
 * Returns a lookup bound to one namespace. Missing keys fall back to the key
 * itself so a gap in a catalogue shows up in the page rather than crashing it.
 */
export function getTranslator<N extends Namespace>(
  locale: Locale,
  namespace: N,
): Translator<N> {
  const dict = getMessages(locale)[namespace] as Record<string, string>;
  const fallback = getMessages("en")[namespace] as Record<string, string>;

  return (key, vars) => {
    const k = String(key);
    let text = dict?.[k] ?? fallback?.[k] ?? k;
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.replaceAll(`{${name}}`, String(value));
      }
    }
    return text;
  };
}

/** The other locale, used by the language switcher. */
export function otherLocale(locale: Locale): Locale {
  return locale === "bn" ? "en" : "bn";
}

export const localeLabels: Record<Locale, string> = {
  bn: "বাংলা",
  en: "English",
};

/** Bengali-Indic digits, used for counts and prices in the bn locale. */
const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function formatNumber(value: number, locale: Locale): string {
  const grouped = value.toLocaleString("en-US");
  if (locale !== "bn") return grouped;
  return grouped.replace(/\d/g, (d) => bnDigits[Number(d)]);
}
