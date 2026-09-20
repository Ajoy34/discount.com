import next from "eslint-config-next/core-web-vitals";

// eslint-config-next ships flat config; normalise so either shape works.
const base = Array.isArray(next) ? next : [next];

export default [
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
  ...base,
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];
