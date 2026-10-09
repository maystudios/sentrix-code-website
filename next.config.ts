import type { NextConfig } from "next";

// GitHub Pages serves the site under /<repository>/ until a custom domain is set.
// The deploy workflow passes the matching prefix; local builds use none.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    // One 404 page for both root layouts (app/global-not-found.tsx).
    globalNotFound: true,
  },
  // cacheComponents and partialPrefetching from the scaffold are omitted:
  // they enable partial prerendering, which needs a server and fails in export mode.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
