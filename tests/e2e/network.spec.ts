import { expect, test } from "@playwright/test";

const PAGES = [
  "bn/",
  "en/",
  "bn/search/",
  "bn/offers/",
  "bn/shop/1/",
  "en/shop/5/",
  "bn/consultancy/",
  "en/consultancy/ai-ad/",
  "bn/dashboard/",
  "en/admin/",
  "bn/login/",
];

/**
 * The deployed site used to request RSC prefetch payloads it had never
 * written, producing 28 silent 404s on the home page alone. Anything the
 * app asks its own origin for has to exist.
 */
for (const path of PAGES) {
  test(`${path} requests nothing that 404s`, async ({ page, baseURL }) => {
    const failures: string[] = [];

    page.on("response", (response) => {
      const url = response.url();
      if (!url.startsWith(new URL(baseURL!).origin)) return;
      if (response.status() >= 400) {
        failures.push(`${response.status()} ${url}`);
      }
    });

    await page.goto(path);
    await page.waitForLoadState("load").catch(() => {});

    expect(failures).toEqual([]);
  });
}

test("console stays free of errors on the home page", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("bn/");
  await page.waitForLoadState("load").catch(() => {});

  expect(errors).toEqual([]);
});

test("client navigation between pages loads no missing payloads", async ({
  page,
  baseURL,
}) => {
  const failures: string[] = [];
  page.on("response", (r) => {
    if (r.url().startsWith(new URL(baseURL!).origin) && r.status() >= 400) {
      failures.push(`${r.status()} ${r.url()}`);
    }
  });

  await page.goto("en/");
  await page.locator('a[href$="/en/offers/"]').first().click();
  await expect(page).toHaveURL(/\/en\/offers\/$/);
  await page.locator('a[href$="/en/consultancy/"]').first().click();
  await expect(page).toHaveURL(/\/en\/consultancy\/$/);

  expect(failures).toEqual([]);
});
