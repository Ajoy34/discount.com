import { expect, test, type Page } from "@playwright/test";

const SERVICES = ["ad-creation", "ai-ad", "website", "guide"];

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
        /WhatsApp|হোয়াটসঅ্যাপ/.test(b.textContent ?? ""),
      );
      button?.click();

      setTimeout(() => {
        window.open = original;
        resolve(captured);
      }, 300);
    });
  });
}

test.describe("consultancy landing", () => {
  test("presents all four services with prices", async ({ page }) => {
    await page.goto("en/consultancy/");
    await expect(page.getByRole("heading", { name: "Ad creation" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "AI ad generator" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Website building" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Business guide" })).toBeVisible();
    await expect(page.getByText("Most popular")).toBeVisible();
  });

  test("links through to every service page", async ({ page }) => {
    for (const id of SERVICES) {
      await page.goto("en/consultancy/");
      await page
        .locator(`a[href$="/en/consultancy/${id}/"]:visible`)
        .first()
        .click();
      await expect(page).toHaveURL(new RegExp(`/en/consultancy/${id}/$`));
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("explains how the process works", async ({ page }) => {
    await page.goto("en/consultancy/");
    await expect(page.getByRole("heading", { name: "How it works" })).toBeVisible();
    await expect(page.locator("ol li")).toHaveCount(3);
  });
});

test.describe("consultancy request form", () => {
  test("refuses to send without a name and phone", async ({ page }) => {
    await page.goto("en/consultancy/");
    await page.getByRole("button", { name: "Send on WhatsApp" }).click();
    await expect(page.locator('form [role="alert"]')).toContainText(
      "Please add your name and phone number first.",
    );
  });

  test("builds a WhatsApp message from the entered details", async ({ page }) => {
    await page.goto("en/consultancy/");

    await page.getByLabel(/Your name/).fill("Karim Uddin");
    await page.getByLabel(/Shop name/).fill("Karim Electronics");
    await page.getByLabel(/Phone number/).fill("01812345678");
    await page
      .getByLabel("Which service do you need?")
      .selectOption({ label: "Website building" });
    await page
      .getByLabel("Tell us briefly what you want to achieve")
      .fill("Need a shop website.");

    const url = await captureWhatsApp(page);
    expect(url).toBeTruthy();
    expect(url).toContain("wa.me/8801533033515");

    const body = decodeURIComponent(url!.split("text=")[1]);
    expect(body).toContain("Name: Karim Uddin");
    expect(body).toContain("Shop: Karim Electronics");
    expect(body).toContain("Phone: 01812345678");
    expect(body).toContain("Service: Website building");
    expect(body).toContain("Need a shop website.");
    // The on-screen label is a question; the message must not repeat it.
    expect(body).not.toContain("Which service do you need?");
  });

  test("omits optional fields that were left blank", async ({ page }) => {
    await page.goto("en/consultancy/");
    await page.getByLabel(/Your name/).fill("Ayesha");
    await page.getByLabel(/Phone number/).fill("01711111111");

    const url = await captureWhatsApp(page);
    const body = decodeURIComponent(url!.split("text=")[1]);
    expect(body).toContain("Name: Ayesha");
    expect(body).not.toContain("Shop:");
    expect(body).not.toContain("Details:");
  });

  test("writes the message in Bengali on the bn site", async ({ page }) => {
    await page.goto("bn/consultancy/");
    await page.getByLabel(/আপনার নাম/).fill("করিম উদ্দিন");
    await page.getByLabel(/ফোন নম্বর/).fill("01812345678");

    const url = await captureWhatsApp(page);
    const body = decodeURIComponent(url!.split("text=")[1]);
    expect(body).toContain("নাম: করিম উদ্দিন");
    expect(body).toContain("ফোন: 01812345678");
  });

  test("preselects the service whose page it sits on", async ({ page }) => {
    await page.goto("en/consultancy/ai-ad/");
    await page.getByLabel(/Your name/).fill("Rina");
    await page.getByLabel(/Phone number/).fill("01911111111");

    const url = await captureWhatsApp(page);
    const body = decodeURIComponent(url!.split("text=")[1]);
    expect(body).toContain("Service: AI ad generator");
  });

  test("offers direct call and email routes too", async ({ page }) => {
    await page.goto("en/consultancy/");
    await expect(
      page.locator('form a[href="tel:+8801533033515"]'),
    ).toBeVisible();
    await expect(
      page.locator('form a[href="mailto:vertextai101@gmail.com"]'),
    ).toBeVisible();
  });
});

test.describe("dashboard", () => {
  test("surfaces every consultancy service to a shop owner", async ({ page }) => {
    await page.goto("en/dashboard/");
    for (const id of SERVICES) {
      await expect(
        page.locator(`a[href$="/en/consultancy/${id}/"]`),
      ).toHaveCount(1);
    }
  });
});
