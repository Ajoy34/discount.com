import { expect, test } from "@playwright/test";

test.describe("offer categories in the nav", () => {
  test("opens from the header and filters the offers page", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "desktop dropdown");

    await page.goto("en/");
    const toggle = page.getByRole("button", {
      name: "Browse offer categories",
    });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    const panel = page.locator("#offer-categories");
    await expect(panel).toBeVisible();
    await panel.getByRole("link", { name: "Pharmacy" }).click();

    await expect(page).toHaveURL(/\/en\/offers\/\?category=pharmacy$/);
  });

  test("closes on Escape", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "desktop dropdown");

    await page.goto("en/");
    const toggle = page.getByRole("button", {
      name: "Browse offer categories",
    });
    await toggle.click();
    await expect(page.locator("#offer-categories")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#offer-categories")).toBeHidden();
  });

  test("lists categories inside the mobile menu", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile menu");

    await page.goto("en/");
    await page.locator('button[aria-controls="mobile-menu"]').click();
    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "Grocery" })).toBeVisible();
  });
});

test.describe("trending offers", () => {
  test("lists every offer and reports the count", async ({ page }) => {
    await page.goto("en/offers/");
    await expect(page.locator('p[aria-live="polite"]')).toContainText(
      "5 offers",
    );
    await expect(page.locator("article")).toHaveCount(5);
  });

  test("puts the most acted-on offer first by default", async ({ page }) => {
    await page.goto("en/offers/");
    await expect(page.locator("article").first()).toContainText(
      "Lazz Pharma Mirpur",
    );
  });

  test("re-orders by biggest discount", async ({ page }) => {
    await page.goto("en/offers/");
    await page.getByLabel("Sort by").selectOption("discount");
    await expect(page.locator("article").first()).toContainText("20%");
  });

  test("re-orders by most trusted", async ({ page }) => {
    await page.goto("en/offers/");
    await page.getByLabel("Sort by").selectOption("trust");
    // The disputed hilsa offer must not lead a trust-sorted list.
    await expect(page.locator("article").first()).not.toContainText("Hilsa");
  });

  test("filters by category", async ({ page }) => {
    await page.goto("en/offers/");
    await page.getByLabel("All categories").selectOption("vegetables");
    await expect(page.locator("article")).toHaveCount(1);
  });

  test("honours a category from the header link", async ({ page }) => {
    await page.goto("en/offers/?category=pharmacy");
    await expect(page.locator("article")).toHaveCount(5);
  });

  test("drops low-trust offers as the threshold rises", async ({ page }) => {
    await page.goto("en/offers/");
    const before = await page.locator("article").count();
    await page.getByRole("slider").fill("90");
    const after = await page.locator("article").count();
    expect(after).toBeLessThan(before);
  });

  test("switches to the map and renders tiles", async ({ page }) => {
    await page.goto("en/offers/");
    await page.getByRole("button", { name: "Map" }).click();
    const map = page.locator(".leaflet-container");
    await expect(map).toBeVisible();
    await expect(page.locator(".leaflet-tile").first()).toBeAttached();
  });
});

test.describe("offer detail", () => {
  test("shows trust, engagement and a map", async ({ page }) => {
    await page.goto("en/offers/1/");
    await expect(page.locator("h1")).toContainText("Eid Special");
    await expect(page.getByText("Trust score")).toBeVisible();
    await expect(page.getByText("confirmed it was honoured")).toBeVisible();
    await expect(page.locator(".leaflet-container")).toBeVisible();
  });

  test("lists the existing reviews", async ({ page }) => {
    await page.goto("en/offers/1/");
    await expect(page.getByText("Sumaiya A.")).toBeVisible();
    await expect(page.getByText("Discount honoured").first()).toBeVisible();
  });

  test("accepts a review and keeps it on the page", async ({ page }) => {
    await page.goto("en/offers/5/");

    await page.getByLabel("Your name").fill("Test Reviewer");
    await page.getByRole("radio", { name: "4 stars" }).check();
    await page
      .getByLabel("What was your experience?")
      .fill("Exactly as described, no argument at the counter.");
    await page.getByRole("button", { name: "Post review" }).click();

    await expect(page.getByRole("status")).toContainText("saved on this device");
    await expect(page.getByText("Test Reviewer").first()).toBeVisible();
    await expect(page.getByText("Your review").first()).toBeVisible();
  });

  test("refuses an empty review", async ({ page }) => {
    await page.goto("en/offers/4/");
    await page.getByRole("button", { name: "Post review" }).click();
    await expect(
      page.getByText("Add your name, a rating and a few words."),
    ).toBeVisible();
  });

  test("is reachable from an offer card", async ({ page }) => {
    await page.goto("en/offers/");
    await page.locator("article a").first().click();
    await expect(page).toHaveURL(/\/en\/offers\/\d+\/$/);
  });
});

test.describe("leaderboard", () => {
  test("ranks by bid and says the placement is paid", async ({ page }) => {
    await page.goto("en/leaderboard/");
    await expect(page.locator("h1")).toContainText("Shop leaderboard");
    await expect(page.getByText("Paid placement")).toBeVisible();
    // Highest bidder leads, even though it is not the highest rated shop.
    const first = page.locator("ol li").first();
    await expect(first).toContainText("Lazz Pharma Mirpur");
    await expect(first).toContainText("৳12,500");
  });

  test("offers a route to bid for the top spot", async ({ page }) => {
    await page.goto("en/leaderboard/");
    const boost = page.locator('a[href*="wa.me"]').first();
    await expect(boost).toBeVisible();
    await expect(boost).toHaveAttribute("href", /8801533033515/);
  });

  test("appears on the home page with a link to the full board", async ({
    page,
  }) => {
    await page.goto("en/");
    await expect(
      page.locator('a[href$="/en/leaderboard/"]:visible').first(),
    ).toBeVisible();
  });
});

test.describe("consultancy wizard", () => {
  test("recommends the free guide when there is no budget", async ({
    page,
  }) => {
    await page.goto("en/");
    await page.getByRole("button", { name: "Find the right service" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "I have a shop already" }).click();
    await dialog
      .getByRole("button", { name: "Getting more people to notice me" })
      .click();
    await dialog.getByRole("button", { name: "Nothing yet" }).click();

    await expect(dialog.getByText("Business guide")).toBeVisible();
    await expect(
      dialog.getByRole("link", { name: "See the details" }),
    ).toHaveAttribute("href", /consultancy\/guide\//);
  });

  test("recommends a website when the goal is being findable", async ({
    page,
  }) => {
    await page.goto("en/");
    await page.getByRole("button", { name: "Find the right service" }).click();
    const dialog = page.getByRole("dialog");

    await dialog.getByRole("button", { name: "I have a shop already" }).click();
    await dialog.getByRole("button", { name: "Being findable online" }).click();
    await dialog.getByRole("button", { name: "Up to 3,000 taka" }).click();

    await expect(dialog.getByText("Website building")).toBeVisible();
  });

  test("does not try to sell to someone who is only browsing", async ({
    page,
  }) => {
    await page.goto("en/");
    await page.getByRole("button", { name: "Find the right service" }).click();
    const dialog = page.getByRole("dialog");

    await dialog.getByRole("button", { name: "Just browsing offers" }).click();
    await expect(dialog.getByText("nothing to sell you")).toBeVisible();
    await expect(
      dialog.getByRole("link", { name: "See offers" }),
    ).toBeVisible();
  });

  test("closes on Escape", async ({ page }) => {
    await page.goto("en/");
    await page.getByRole("button", { name: "Find the right service" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});
