import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a production build run alongside `next dev` without clobbering its .next folder.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Photos come from pre-generated, cached WebP sizes (src/lib/image-loader.ts), not per-request resizing.
  images: { loader: "custom", loaderFile: "./src/lib/image-loader.ts" },
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
