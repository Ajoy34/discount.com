import { expect, test, type Page } from "@playwright/test";

/**
 * Captures the url the form hands to WhatsApp instead of letting the browser
 * navigate away to it.
 */
async function captureWhatsApp(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    return new Promise<string | null>((resolve) => {
      const original = window.open;
      let captured: string | null = null;
      window.open = ((url?: string | URL) => {
        captured = url ? String(url) : null;
        return null;
      }) as typeof window.open;

      const button = [...document.querySelectorAll("button")].find((b) =>
        /payment link|পেমেন্ট লিংক/.test(b.textContent ?? ""),
      );
      button?.click();

      setTimeout(() => {
        window.open = original;
        resolve(captured);
      }, 300);
    });
  });
}

test.describe("leaderboard checkout", () => {
  test("prefills the bid from the ?amount= query string", async ({ page }) => {
    await page.goto("en/leaderboard/checkout/?amount=13500");
    await expect(page.getByLabel(/Weekly bid amount/)).toHaveValue("13500");
  });

  test("never collects a card number on this page", async ({ page }) => {
    await page.goto("en/leaderboard/checkout/");
    await expect(page.locator('input[type="text"][name*="card" i]')).toHaveCount(0);
    await expect(page.getByText(/never ask for a card number/i)).toBeVisible();
  });

  test("refuses to send without the required details", async ({ page }) => {
    await page.goto("en/leaderboard/checkout/");
    await page
      .getByRole("button", { name: "Request secure payment link" })
      .click();
    await expect(page.locator('[role="alert"]')).toContainText(
      "Add your bid, shop name and phone number first.",
    );
  });

  test("builds a WhatsApp message with the bid and chosen gateway", async ({
    page,
  }) => {
    await page.goto("en/leaderboard/checkout/?amount=9000");
    await page.getByLabel(/Shop name/).fill("Karim Electronics");
    await page.getByLabel(/Your name/).fill("Karim Uddin");
    await page.getByLabel(/Phone number/).fill("01812345678");
    await page.getByText("Stripe", { exact: true }).click();

    const url = await captureWhatsApp(page);
    expect(url).toBeTruthy();
    expect(url).toContain("wa.me/8801533033515");

    const body = decodeURIComponent(url!.split("text=")[1]);
    expect(body).toContain("Shop name: Karim Electronics");
    expect(body).toContain("Your name: Karim Uddin");
    expect(body).toContain("Phone number: 01812345678");
    expect(body).toContain("Weekly bid: ৳9,000");
    expect(body).toContain("Payment method: Stripe");
  });

  test("defaults to SSLCommerz for a Bangladeshi shop's first bid", async ({
    page,
  }) => {
    await page.goto("en/leaderboard/checkout/?amount=5000");
    await page.getByLabel(/Shop name/).fill("Rahim Store");
    await page.getByLabel(/Your name/).fill("Rahim");
    await page.getByLabel(/Phone number/).fill("01711111111");

    const url = await captureWhatsApp(page);
    const body = decodeURIComponent(url!.split("text=")[1]);
    expect(body).toContain("Payment method: SSLCommerz");
  });

  test("writes the message in Bengali on the bn site", async ({ page }) => {
    await page.goto("bn/leaderboard/checkout/?amount=5000");
    await page.getByLabel(/দোকানের নাম/).fill("রহিম স্টোর");
    await page.getByLabel(/আপনার নাম/).fill("রহিম");
    await page.getByLabel(/ফোন নম্বর/).fill("01711111111");

    const url = await captureWhatsApp(page);
    const body = decodeURIComponent(url!.split("text=")[1]);
    expect(body).toContain("দোকানের নাম: রহিম স্টোর");
    expect(body).toContain("সাপ্তাহিক বিড: ৳৫,০০০");
  });

  test("reaches checkout from the leaderboard's outbid button with the champion's amount", async ({
    page,
  }) => {
    await page.goto("en/leaderboard/");
    await page.getByRole("link", { name: "Outbid" }).click();
    await expect(page).toHaveURL(/\/en\/leaderboard\/checkout\/\?amount=13000$/);
  });
});
