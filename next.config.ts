import type { NextConfig } from "next";

/**
 * The site is published to GitHub Pages as a project page, so every asset has to
 * be served from /discount.com. `output: "export"` emits a fully static ./out
 * directory, which the Pages workflow uploads as the deployment artifact.
 *
 * Pages has no image optimisation server, so remote images are passed through
 * untouched rather than routed via /_next/image.
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/discount.com",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
