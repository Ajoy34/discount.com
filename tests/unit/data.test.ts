import { describe, expect, it } from "vitest";
import {
  areaName,
  areas,
  categories,
  consultancyServices,
  getConsultancyService,
  getShop,
  offerTitle,
  offers,
  offersForShop,
  shopAddress,
  shopDescription,
  shopName,
  shops,
} from "@/lib/data";
import { getMessages, locales } from "@/lib/i18n";

const categoryIds = new Set(categories);
const areaIds = new Set(areas.map((a) => a.id));
const serviceIds = new Set([
  "freeDelivery",
  "fridgeRent",
  "freezerRent",
  "bulkOrder",
  "homeService",
]);

describe("shops", () => {
  it("has at least one shop", () => {
    expect(shops.length).toBeGreaterThan(0);
  });

  it("gives every shop a unique id", () => {
    const ids = shops.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("fills both language variants of every text field", () => {
    for (const shop of shops) {
      expect(shop.nameEn.trim()).not.toBe("");
      expect(shop.nameBn.trim()).not.toBe("");
      expect(shop.addressEn.trim()).not.toBe("");
      expect(shop.addressBn.trim()).not.toBe("");
      expect(shop.descriptionEn.trim()).not.toBe("");
      expect(shop.descriptionBn.trim()).not.toBe("");
    }
  });

  it("only uses categories and areas the UI can render", () => {
    for (const shop of shops) {
      expect(categoryIds.has(shop.category)).toBe(true);
      expect(areaIds.has(shop.area)).toBe(true);
    }
  });

  it("only lists services that have a translated label", () => {
    const shopNamespace = getMessages("en").Shop as Record<string, string>;
    for (const shop of shops) {
      for (const service of shop.services) {
        expect(serviceIds.has(service.id)).toBe(true);
        expect(shopNamespace[service.id]).toBeTruthy();
        expect(service.noteEn.trim()).not.toBe("");
        expect(service.noteBn.trim()).not.toBe("");
      }
    }
  });

  it("keeps ratings and distances in a sane range", () => {
    for (const shop of shops) {
      expect(shop.rating).toBeGreaterThan(0);
      expect(shop.rating).toBeLessThanOrEqual(5);
      expect(shop.reviewCount).toBeGreaterThanOrEqual(0);
      expect(shop.distanceMeters).toBeGreaterThan(0);
    }
  });

  it("stores Bangladeshi phone numbers in a dialable form", () => {
    for (const shop of shops) {
      expect(shop.phone).toMatch(/^\+880\d{10}$/);
      // wa.me rejects a leading plus.
      expect(shop.whatsapp).toMatch(/^880\d{10}$/);
      expect(shop.whatsapp).toBe(shop.phone.replace("+", ""));
    }
  });

  it("places every shop inside greater Dhaka", () => {
    for (const shop of shops) {
      expect(shop.lat).toBeGreaterThan(23.6);
      expect(shop.lat).toBeLessThan(24.0);
      expect(shop.lng).toBeGreaterThan(90.2);
      expect(shop.lng).toBeLessThan(90.6);
    }
  });

  it("uses a full Unsplash photo id, not a truncated one", () => {
    // A previous extraction bug cut ids at the hyphen and every image 404'd.
    for (const shop of shops) {
      expect(shop.image).toMatch(
        /^https:\/\/images\.unsplash\.com\/photo-\d{10,}-[0-9a-z]{10,}\?/,
      );
    }
  });

  it("looks a shop up by id and misses cleanly", () => {
    expect(getShop(shops[0].id)?.id).toBe(shops[0].id);
    expect(getShop(9999)).toBeUndefined();
  });
});

describe("offers", () => {
  it("gives every offer a unique id", () => {
    const ids = offers.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("attaches every offer to a shop that exists", () => {
    for (const offer of offers) {
      expect(getShop(offer.shopId)).toBeDefined();
    }
  });

  it("uses a discount percentage that makes sense", () => {
    for (const offer of offers) {
      expect(offer.discount).toBeGreaterThan(0);
      expect(offer.discount).toBeLessThanOrEqual(100);
    }
  });

  it("carries an ISO expiry date", () => {
    for (const offer of offers) {
      expect(offer.validUntil).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(offer.validUntil))).toBe(false);
    }
  });

  it("returns only that shop's offers", () => {
    for (const shop of shops) {
      for (const offer of offersForShop(shop.id)) {
        expect(offer.shopId).toBe(shop.id);
      }
    }
  });
});

describe("locale-aware accessors", () => {
  it("returns the matching language for each field", () => {
    const shop = shops[0];
    expect(shopName(shop, "en")).toBe(shop.nameEn);
    expect(shopName(shop, "bn")).toBe(shop.nameBn);
    expect(shopAddress(shop, "en")).toBe(shop.addressEn);
    expect(shopAddress(shop, "bn")).toBe(shop.addressBn);
    expect(shopDescription(shop, "en")).toBe(shop.descriptionEn);
    expect(shopDescription(shop, "bn")).toBe(shop.descriptionBn);
    expect(offerTitle(offers[0], "en")).toBe(offers[0].titleEn);
    expect(offerTitle(offers[0], "bn")).toBe(offers[0].titleBn);
  });

  it("names every area in both languages", () => {
    for (const area of areas) {
      expect(areaName(area.id, "en")).toBe(area.nameEn);
      expect(areaName(area.id, "bn")).toBe(area.nameBn);
    }
  });
});

describe("consultancy services", () => {
  it("ships the four advertised services", () => {
    expect(consultancyServices.map((s) => s.id).sort()).toEqual([
      "ad-creation",
      "ai-ad",
      "guide",
      "website",
    ]);
  });

  it("uses url-safe ids", () => {
    for (const service of consultancyServices) {
      expect(service.id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("resolves every message key it references, in both locales", () => {
    // A stale key would render the raw key name to a prospective customer.
    for (const locale of locales) {
      const ns = getMessages(locale).Consultancy as Record<string, string>;
      for (const service of consultancyServices) {
        expect(ns[service.titleKey]).toBeTruthy();
        expect(ns[service.descKey]).toBeTruthy();
        for (const key of service.featureKeys) {
          expect(ns[key]).toBeTruthy();
        }
      }
    }
  });

  it("lists features and a price for each service", () => {
    for (const service of consultancyServices) {
      expect(service.featureKeys.length).toBeGreaterThanOrEqual(3);
      expect(service.priceEn.trim()).not.toBe("");
      expect(service.priceBn.trim()).not.toBe("");
      expect(["oneTime", "perMonth", "free"]).toContain(service.priceUnit);
    }
  });

  it("highlights exactly one service as most popular", () => {
    expect(consultancyServices.filter((s) => s.popular)).toHaveLength(1);
  });

  it("looks a service up by id and misses cleanly", () => {
    expect(getConsultancyService("ai-ad")?.id).toBe("ai-ad");
    expect(getConsultancyService("nope")).toBeUndefined();
  });
});
