import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Checks run against ./out, so these only make sense after `npm run build`.
 * Kept in a separate config so `npm test` stays runnable without a build.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["tests/export/**/*.test.ts"],
    environment: "node",
    reporters: "verbose",
  },
});
