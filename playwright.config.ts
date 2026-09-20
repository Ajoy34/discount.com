import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const BASE = `http://localhost:${PORT}/discount.com`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 20_000,
  expect: { timeout: 7_000 },
  globalTimeout: 8 * 60_000,
  maxFailures: process.env.CI ? 15 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",

  use: {
    baseURL: BASE,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],

  // Serves the real build output, base path and all.
  webServer: {
    command: "node tests/static-server.mjs",
    url: `${BASE}/bn/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
