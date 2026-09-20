import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { consultancyServices, shops } from "@/lib/data";
import { locales } from "@/lib/i18n";

const OUT = join(process.cwd(), "out");
const BASE = "/discount.com";

/** Every route the app is expected to have emitted, as a site path. */
const expectedRoutes = [
  "/",
  ...locales.flatMap((locale) => [
    `/${locale}/`,
    `/${locale}/search/`,
    `/${locale}/offers/`,
    `/${locale}/login/`,
    `/${locale}/dashboard/`,
    `/${locale}/admin/`,
    `/${locale}/consultancy/`,
    ...consultancyServices.map((s) => `/${locale}/consultancy/${s.id}/`),
    ...shops.map((s) => `/${locale}/shop/${s.id}/`),
  ]),
];

const fileFor = (route: string) => join(OUT, route, "index.html");
const read = (route: string) => readFileSync(fileFor(route), "utf8");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

describe("static export", () => {
  it("produced an out directory", () => {
    expect(
      existsSync(OUT),
      "out/ is missing — run `npm run build` first",
    ).toBe(true);
  });

  it("emitted every expected route", () => {
    const missing = expectedRoutes.filter((r) => !existsSync(fileFor(r)));
    expect(missing).toEqual([]);
  });

  it("emitted a 404 page", () => {
    expect(existsSync(join(OUT, "404.html"))).toBe(true);
  });

  it("includes .nojekyll so GitHub Pages serves _next", () => {
    // Without this, Jekyll strips every underscore-prefixed directory.
    expect(existsSync(join(OUT, ".nojekyll"))).toBe(true);
  });
});

describe("page documents", () => {
  it("gives every page a non-empty title", () => {
    for (const route of expectedRoutes) {
      const title = read(route).match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
      expect(title.trim(), `${route} has no title`).not.toBe("");
    }
  });

  it("gives each locale's pages a distinct title", () => {
    // One shared title across the site makes tabs and search results useless.
    for (const locale of locales) {
      const routes = expectedRoutes.filter((r) => r.startsWith(`/${locale}/`));
      const titles = routes.map(
        (r) => read(r).match(/<title>([^<]*)<\/title>/)?.[1] ?? "",
      );
      expect(new Set(titles).size).toBe(titles.length);
    }
  });

  it("declares a language on the html element", () => {
    for (const route of expectedRoutes) {
      expect(read(route)).toMatch(/<html[^>]+lang="(bn|en)"/);
    }
  });

  it("sets a viewport meta so phones render at device width", () => {
    for (const route of expectedRoutes) {
      expect(read(route)).toContain('name="viewport"');
    }
  });

  it("puts exactly one h1 on each content page", () => {
    for (const route of expectedRoutes.filter((r) => r !== "/")) {
      const count = (read(route).match(/<h1[\s>]/g) ?? []).length;
      expect(count, `${route} has ${count} h1 elements`).toBe(1);
    }
  });

  it("leaves no unresolved route placeholders in filenames", () => {
    // The previous export shipped files like __next.$d$locale.shop.$d$id.txt.
    const offenders = walk(OUT)
      .map((f) => relative(OUT, f))
      .filter((f) => f.includes("$d$"));
    expect(offenders).toEqual([]);
  });

  it("renders no raw message keys", () => {
    // A missing catalogue entry falls back to the key, which would show here.
    for (const route of expectedRoutes) {
      const html = read(route);
      expect(html, `${route} leaked a message key`).not.toMatch(
        />(adCreationF\d|aiAdF\d|websiteF\d|guideF\d|heroSubtitle|titleSuffix)</,
      );
    }
  });
});

describe("assets and links", () => {
  it("prefixes framework assets with the project base path", () => {
    const html = read("/bn/");
    expect(html).toContain(`${BASE}/_next/`);
    expect(html).not.toMatch(/src="\/_next\//);
  });

  it("points every internal link at a page that exists", () => {
    const broken: string[] = [];

    for (const route of expectedRoutes) {
      const html = read(route);
      const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

      for (const href of hrefs) {
        if (!href.startsWith(`${BASE}/`)) continue;
        if (href.includes("/_next/")) continue;

        const path = href.slice(BASE.length).split(/[?#]/)[0];
        const candidates = [
          join(OUT, path, "index.html"),
          join(OUT, path),
        ];
        if (!candidates.some(existsSync)) broken.push(`${route} -> ${href}`);
      }
    }

    expect(broken).toEqual([]);
  });

  it("requests only full Unsplash photo ids", () => {
    const html = read("/bn/");
    const ids = [...html.matchAll(/images\.unsplash\.com\/(photo-[^"&?]+)/g)].map(
      (m) => m[1],
    );
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      expect(id, "truncated Unsplash id would 404").toMatch(
        /^photo-\d{10,}-[0-9a-z]{10,}$/,
      );
    }
  });

  it("uses the configured contact details wherever it offers contact", () => {
    const html = read("/bn/consultancy/");
    expect(html).toContain("tel:+8801533033515");
    expect(html).toContain("mailto:vertextai101@gmail.com");
    expect(html).toContain("wa.me/8801533033515");
  });
});

describe("shop pages", () => {
  it("renders each shop's own name and dial link", () => {
    for (const shop of shops) {
      const html = read(`/en/shop/${shop.id}/`);
      expect(html).toContain(shop.nameEn);
      expect(html).toContain(`tel:${shop.phone}`);
      expect(html).toContain(`wa.me/${shop.whatsapp}`);
    }
  });
});

describe("consultancy pages", () => {
  it("renders each service's title on its own page, in both locales", () => {
    for (const locale of locales) {
      for (const service of consultancyServices) {
        const html = read(`/${locale}/consultancy/${service.id}/`);
        expect(html.length).toBeGreaterThan(1000);
        expect(html).toContain("#request");
      }
    }
  });

  it("links to every service from the landing page", () => {
    for (const locale of locales) {
      const html = read(`/${locale}/consultancy/`);
      for (const service of consultancyServices) {
        expect(html).toContain(`${BASE}/${locale}/consultancy/${service.id}/`);
      }
    }
  });

  it("surfaces the consultancy entry point on the home page", () => {
    // The feature was invisible before; this keeps it discoverable.
    for (const locale of locales) {
      expect(read(`/${locale}/`)).toContain(`${BASE}/${locale}/consultancy/`);
    }
  });
});
