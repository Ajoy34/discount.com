import { expect, test, type Page } from "@playwright/test";

/** The live region that announces how many shops matched. */
const countText = (page: Page) => page.locator('p[aria-live="polite"]');

test.describe("search", () => {
  test("lists every shop by default", async ({ page }) => {
    await page.goto("en/search/");
    await expect(countText(page)).toContainText("6 shops found");
    await expect(page.locator("article")).toHaveCount(6);
  });

  test("filters to shops that are open now", async ({ page }) => {
    await page.goto("en/search/");
    await page.getByRole("button", { name: "Open Now" }).click();
    await expect(countText(page)).toContainText("2 shops found");
    await expect(page.locator("article")).toHaveCount(2);
  });

  test("combines filters and can clear them again", async ({ page }) => {
    await page.goto("en/search/");
    await page.getByRole("button", { name: "Free Delivery" }).click();
    await page.getByRole("button", { name: "Has Discount" }).click();

    const clear = page.getByRole("button", { name: "Clear all filters" });
    await expect(clear).toBeVisible();

    await clear.click();
    await expect(countText(page)).toContainText("6 shops found");
  });

  test("narrows by category", async ({ page }) => {
    await page.goto("en/search/");
    await page.getByLabel("All Categories").selectOption("pharmacy");
    await expect(page.locator("article")).toHaveCount(1);
    await expect(page.locator("article").first()).toContainText("Lazz Pharma");
  });

  test("honours a category passed in the url", async ({ page }) => {
    await page.goto("en/search/?category=fish");
    await expect(page.locator("article")).toHaveCount(1);
    await expect(page.locator("article").first()).toContainText("Bhai Bhai");
  });

  test("matches shops by free-text query", async ({ page }) => {
    await page.goto("en/search/");
    await page.getByPlaceholder("Search shops or products...").fill("organic");
    await expect(page.locator("article")).toHaveCount(1);
  });

  test("shows a helpful empty state when nothing matches", async ({ page }) => {
    await page.goto("en/search/");
    await page
      .getByPlaceholder("Search shops or products...")
      .fill("zzzz-no-such-shop");
    await expect(page.locator("article")).toHaveCount(0);
    await expect(page.getByText("No shops found in this area")).toBeVisible();
  });

  test("sorts by rating", async ({ page }) => {
    await page.goto("en/search/");
    await page.getByLabel("Sort by").selectOption("rating");
    await expect(page.locator("article").first()).toContainText("Lazz Pharma");
  });

  test("shows the map view as not yet available", async ({ page }) => {
    await page.goto("en/search/");
    await page.getByRole("button", { name: "Map" }).click();
    await expect(page.getByText("Coming soon")).toBeVisible();
  });
});

test.describe("category rail", () => {
  test("leads from the home page into a filtered search", async ({ page }) => {
    await page.goto("en/");
    await page
      .locator('a[href*="/search/?category=grocery"]:visible')
      .first()
      .click();
    await expect(page).toHaveURL(/category=grocery/);
    await expect(page.locator("article")).toHaveCount(1);
  });
});
