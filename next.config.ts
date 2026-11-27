import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a production build run alongside `next dev` without clobbering its .next folder.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Smaller photos for browsers that support them (most phones): AVIF first, then WebP.
  images: { formats: ["image/avif", "image/webp"] },
  // Lets the dev server be viewed through a Cloudflare quick tunnel (*.trycloudflare.com).
  allowedDevOrigins: ["*.trycloudflare.com"],
  // Cache Components is off: the Cloudflare adapter (OpenNext) does not support it yet and pages
  // hang on Workers. Live data (prices, site settings, blog) is read per request via connection().
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
