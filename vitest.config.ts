import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/** Fast, pure-logic tests. No DOM, no build output, no network. */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
    reporters: "verbose",
  },
});
