import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import bn from "../../messages/bn.json";

type Catalogue = Record<string, Record<string, string>>;

const catalogues: Record<string, Catalogue> = {
  en: en as Catalogue,
  bn: bn as Catalogue,
};

const placeholders = (text: string) =>
  (text.match(/\{[a-zA-Z0-9_]+\}/g) ?? []).sort();

describe("message catalogues", () => {
  it("defines the same namespaces in both languages", () => {
    expect(Object.keys(bn).sort()).toEqual(Object.keys(en).sort());
  });

  it("defines the same keys in every namespace", () => {
    for (const namespace of Object.keys(en)) {
      const enKeys = Object.keys(catalogues.en[namespace]).sort();
      const bnKeys = Object.keys(catalogues.bn[namespace]).sort();
      // Reported per namespace so a failure names the gap directly.
      expect({ namespace, keys: bnKeys }).toEqual({
        namespace,
        keys: enKeys,
      });
    }
  });

  it("never leaves a string empty", () => {
    for (const [locale, catalogue] of Object.entries(catalogues)) {
      for (const [namespace, entries] of Object.entries(catalogue)) {
        for (const [key, value] of Object.entries(entries)) {
          expect(
            typeof value === "string" && value.trim() !== "",
            `${locale}.${namespace}.${key} is empty`,
          ).toBe(true);
        }
      }
    }
  });

  it("keeps placeholders identical across languages", () => {
    // A dropped {count} in one language would render a broken sentence.
    for (const [namespace, entries] of Object.entries(catalogues.en)) {
      for (const key of Object.keys(entries)) {
        const enPlaceholders = placeholders(catalogues.en[namespace][key]);
        const bnPlaceholders = placeholders(catalogues.bn[namespace][key]);
        expect(
          bnPlaceholders,
          `${namespace}.${key} placeholder mismatch`,
        ).toEqual(enPlaceholders);
      }
    }
  });

  it("leaves no untranslated Bengali strings copied from English", () => {
    // Latin-only text in the bn catalogue usually means a forgotten translation.
    const allowed = new Set(["Discounty", "WhatsApp", "Dhaka"]);
    const suspicious: string[] = [];

    for (const [namespace, entries] of Object.entries(catalogues.bn)) {
      for (const [key, value] of Object.entries(entries)) {
        const sameAsEnglish = value === catalogues.en[namespace]?.[key];
        const hasNoBengali = !/[ঀ-৿]/.test(value);
        const isPlaceholderish = /^[\d\s{}.+%/-]*$/.test(value);
        if (sameAsEnglish && hasNoBengali && !isPlaceholderish && !allowed.has(value)) {
          suspicious.push(`${namespace}.${key} = "${value}"`);
        }
      }
    }

    expect(suspicious).toEqual([]);
  });

  it("covers every namespace the app renders", () => {
    const required = [
      "Index",
      "Navigation",
      "Category",
      "Search",
      "Shop",
      "Offers",
      "Auth",
      "Dashboard",
      "Admin",
      "Consultancy",
      "Footer",
      "Common",
    ];
    for (const namespace of required) {
      expect(Object.keys(en)).toContain(namespace);
    }
  });
});
