import { describe, expect, it } from "vitest";
import {
  defaultLocale,
  formatNumber,
  getMessages,
  getTranslator,
  isLocale,
  localeLabels,
  locales,
  otherLocale,
} from "@/lib/i18n";

describe("locales", () => {
  it("exposes exactly the two shipped locales, Bengali first", () => {
    expect(locales).toEqual(["bn", "en"]);
    expect(defaultLocale).toBe("bn");
  });

  it("recognises supported locales and rejects everything else", () => {
    expect(isLocale("bn")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
    expect(isLocale("BN")).toBe(false);
  });

  it("pairs each locale with the other one", () => {
    expect(otherLocale("bn")).toBe("en");
    expect(otherLocale("en")).toBe("bn");
  });

  it("labels every locale in its own language", () => {
    for (const locale of locales) {
      expect(localeLabels[locale]).toBeTruthy();
    }
    expect(localeLabels.bn).toBe("বাংলা");
    expect(localeLabels.en).toBe("English");
  });
});

describe("getTranslator", () => {
  it("returns the string for the active locale", () => {
    expect(getTranslator("en", "Navigation")("home")).toBe("Home");
    expect(getTranslator("bn", "Navigation")("home")).toBe("হোম");
  });

  it("substitutes named placeholders", () => {
    const t = getTranslator("en", "Search");
    expect(t("shopsFound", { count: 6 })).toBe("6 shops found");
  });

  it("replaces every occurrence of a placeholder", () => {
    const t = getTranslator("en", "Search");
    // Guards the replaceAll behaviour rather than a single replace.
    expect(t("shopsFound", { count: 0 })).not.toContain("{count}");
  });

  it("leaves the text untouched when no vars are given", () => {
    const t = getTranslator("en", "Search");
    expect(t("shopsFound")).toContain("{count}");
  });

  it("falls back to the key itself for an unknown key", () => {
    const t = getTranslator("en", "Navigation");
    expect(t("doesNotExist" as never)).toBe("doesNotExist");
  });
});

describe("formatNumber", () => {
  it("leaves Latin digits alone for English", () => {
    expect(formatNumber(1248, "en")).toBe("1,248");
    expect(formatNumber(4.8, "en")).toBe("4.8");
  });

  it("converts to Bengali-Indic digits for Bengali", () => {
    expect(formatNumber(6, "bn")).toBe("৬");
    expect(formatNumber(450, "bn")).toBe("৪৫০");
    expect(formatNumber(1248, "bn")).toBe("১,২৪৮");
  });

  it("converts digits inside decimals but keeps the separator", () => {
    expect(formatNumber(4.8, "bn")).toBe("৪.৮");
  });

  it("handles zero in both locales", () => {
    expect(formatNumber(0, "en")).toBe("0");
    expect(formatNumber(0, "bn")).toBe("০");
  });
});

describe("getMessages", () => {
  it("returns a populated catalogue for each locale", () => {
    for (const locale of locales) {
      const messages = getMessages(locale);
      expect(Object.keys(messages).length).toBeGreaterThan(0);
      expect(messages.Navigation.home).toBeTruthy();
    }
  });
});
