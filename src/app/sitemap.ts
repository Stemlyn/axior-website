import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = ["", "/services", "/audit", "/trust", "/coverage", "/book", "/blog"].map((p) => ({
    url: `${SITE.url}${p}`,
    changeFrequency: p === "/blog" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.8,
  }));
  const posts = (await getPosts()).map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: p.updatedAt || p.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...pages, ...posts];
}
