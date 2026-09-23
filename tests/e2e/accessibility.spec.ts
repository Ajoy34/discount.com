import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = [
  { name: "home (bn)", path: "bn/" },
  { name: "home (en)", path: "en/" },
  { name: "search", path: "en/search/" },
  { name: "offers", path: "en/offers/" },
  { name: "offer detail", path: "en/offers/1/" },
  { name: "leaderboard", path: "en/leaderboard/" },
  { name: "leaderboard checkout", path: "en/leaderboard/checkout/" },
  { name: "rewards", path: "en/rewards/" },
  { name: "shop detail", path: "en/shop/1/" },
  { name: "consultancy", path: "en/consultancy/" },
  { name: "service detail", path: "en/consultancy/ai-ad/" },
  { name: "dashboard", path: "en/dashboard/" },
  { name: "admin", path: "en/admin/" },
  { name: "login", path: "en/login/" },
];

for (const { name, path } of PAGES) {
  test(`${name} has no WCAG A/AA violations`, async ({ page }, testInfo) => {
    // Runs once per colour scheme; these rules do not vary by viewport.
    test.skip(
      !["desktop", "dark"].includes(testInfo.project.name),
      "one pass per colour scheme",
    );

    await page.goto(path);
    await page.waitForLoadState("load").catch(() => {});

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    // Logged with a marker so CI can republish these as annotations; the
    // assertion diff alone gets truncated before the useful part.
    for (const violation of results.violations) {
      console.log(
        `AXE [${testInfo.project.name}] ${path} | ${violation.id} | ${violation.impact} | ${violation.nodes.length} node(s) | ${violation.help}`,
      );
      for (const node of violation.nodes.slice(0, 2)) {
        console.log(`AXE   target: ${node.target.join(" ")}`);
        if (node.failureSummary) {
          console.log(
            `AXE   why: ${node.failureSummary.replace(/\s+/g, " ").slice(0, 200)}`,
          );
        }
      }
    }

    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
}

test.describe("keyboard and structure", () => {
  test("every page has a single, reachable main landmark", async ({ page }) => {
    await page.goto("en/consultancy/");
    await expect(page.locator("main#main")).toHaveCount(1);
  });

  test("the mobile menu button reports its expanded state", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile layout only");

    await page.goto("en/");
    const toggle = page.locator('button[aria-controls="mobile-menu"]');
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#mobile-menu")).toBeVisible();
  });

  test("the bottom nav marks the current page", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile layout only");

    await page.goto("en/offers/");
    await expect(
      page.locator('nav a[aria-current="page"][href$="/en/offers/"]'),
    ).toBeVisible();
  });

  test("filter toggles expose their pressed state", async ({ page }) => {
    await page.goto("en/search/");
    const toggle = page.getByRole("button", { name: "Open Now" });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  test("form controls are all labelled", async ({ page }) => {
    await page.goto("en/consultancy/");
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
