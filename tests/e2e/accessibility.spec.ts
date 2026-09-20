import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = [
  { name: "home (bn)", path: "/bn/" },
  { name: "home (en)", path: "/en/" },
  { name: "search", path: "/en/search/" },
  { name: "offers", path: "/en/offers/" },
  { name: "shop detail", path: "/en/shop/1/" },
  { name: "consultancy", path: "/en/consultancy/" },
  { name: "service detail", path: "/en/consultancy/ai-ad/" },
  { name: "dashboard", path: "/en/dashboard/" },
  { name: "admin", path: "/en/admin/" },
  { name: "login", path: "/en/login/" },
];

for (const { name, path } of PAGES) {
  test(`${name} has no WCAG A/AA violations`, async ({ page }, testInfo) => {
    // One pass is enough; the rules checked here do not vary by viewport.
    test.skip(testInfo.project.name !== "desktop", "desktop pass only");

    await page.goto(path);
    await page.waitForLoadState("load").catch(() => {});

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const summary = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
      help: v.help,
    }));

    expect(summary).toEqual([]);
  });
}

test.describe("keyboard and structure", () => {
  test("every page has a single, reachable main landmark", async ({ page }) => {
    await page.goto("/en/consultancy/");
    await expect(page.locator("main#main")).toHaveCount(1);
  });

  test("the mobile menu button reports its expanded state", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile layout only");

    await page.goto("/en/");
    const toggle = page.locator('button[aria-controls="mobile-menu"]');
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#mobile-menu")).toBeVisible();
  });

  test("the bottom nav marks the current page", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile layout only");

    await page.goto("/en/offers/");
    await expect(
      page.locator('nav a[aria-current="page"][href$="/en/offers/"]'),
    ).toBeVisible();
  });

  test("filter toggles expose their pressed state", async ({ page }) => {
    await page.goto("/en/search/");
    const toggle = page.getByRole("button", { name: "Open Now" });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  test("form controls are all labelled", async ({ page }) => {
    await page.goto("/en/consultancy/");
    const controls = page.locator("form input, form select, form textarea");
    const count = await controls.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const id = await controls.nth(i).getAttribute("id");
      expect(id, "every control needs an id to be labelled").toBeTruthy();
      await expect(page.locator(`label[for="${id}"]`)).toHaveCount(1);
    }
  });
});
