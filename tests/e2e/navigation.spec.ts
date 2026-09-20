import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("renders the hero and the main calls to action", async ({ page }) => {
    await page.goto("bn/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page).toHaveTitle(/ডিসকাউন্টি/);
  });

  test("shows offer cards with images that actually load", async ({ page }) => {
    await page.goto("bn/");
    const image = page.locator("main img").first();
    await expect(image).toBeVisible();

    // naturalWidth stays 0 when the remote image 404s.
    await expect
      .poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth), {
        timeout: 15_000,
      })
      .toBeGreaterThan(0);
  });

  test("offers a route into the consultancy section", async ({ page }) => {
    await page.goto("bn/");
    const link = page
      .locator('a[href$="/bn/consultancy/"]')
      .first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/bn\/consultancy\/$/);
    await expect(page.locator("h1")).toContainText("ব্যবসায়িক");
  });
});

test.describe("root entry point", () => {
  test("sends a visitor on to a locale", async ({ page }) => {
    await page.goto("");
    await page.waitForURL(/\/(bn|en)\/$/, { timeout: 15_000 });
    expect(page.url()).toMatch(/\/(bn|en)\/$/);
  });
});

test.describe("language switching", () => {
  test("moves between locales and keeps the page", async ({ page }) => {
    await page.goto("bn/consultancy/");
    await page.locator('a[hreflang="en"]').first().click();
    await expect(page).toHaveURL(/\/en\/consultancy\/$/);
    await expect(page.locator("h1")).toContainText("Business");
  });
});

test.describe("shop pages", () => {
  test("shows contact actions for the shop", async ({ page }) => {
    await page.goto("en/shop/1/");
    await expect(page.locator("h1")).toContainText("Rahim General Store");
    await expect(page.locator('a[href^="tel:"]').first()).toBeVisible();
    await expect(page.locator('a[href*="wa.me"]').first()).toBeVisible();
  });

  test("links back to the shop list", async ({ page }) => {
    await page.goto("en/shop/3/");
    await page.locator('a[href$="/en/search/"]').first().click();
    await expect(page).toHaveURL(/\/en\/search\/$/);
  });
});

test.describe("unknown routes", () => {
  test("serve the 404 page", async ({ page }) => {
    const response = await page.goto("bn/not-a-real-page/");
    expect(response?.status()).toBe(404);
  });
});

test.describe("site chrome", () => {
  test("exposes the contact details in the footer", async ({ page }) => {
    await page.goto("en/");
    const footer = page.locator("footer");
    await expect(
      footer.locator('a[href="tel:+8801533033515"]'),
    ).toBeVisible();
    await expect(
      footer.locator('a[href^="mailto:vertextai101@gmail.com"]').first(),
    ).toBeVisible();
  });

  test("provides a skip link for keyboard users", async ({ page }) => {
    await page.goto("en/");
    await page.keyboard.press("Tab");
    const skip = page.locator('a[href="#main"]');
    await expect(skip).toBeFocused();
  });
});
