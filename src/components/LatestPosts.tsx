"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/lib/blog";
import { BlogCard } from "./BlogCard";

/**
 * The three newest guides from the admin blog, loaded after the (prerendered) home page appears.
 * Renders nothing until they arrive and nothing at all when no post is published, so the page
 * never shows an empty section.
 */
export function LatestPosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/posts?limit=3", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : { posts: [] }))
      .then((d: { posts?: Post[] }) => setPosts(Array.isArray(d.posts) ? d.posts : []))
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  if (!posts.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 md:pt-32 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-[13px] font-semibold text-gold-ink">From the Axior desk</p>
          <h2 className="display mt-3 text-4xl sm:text-5xl">
            Guides for owners <em>far from home.</em>
          </h2>
        </div>
        <Link href="/blog" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink hover:text-gold-ink">
          All guides <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <BlogCard key={p.id} post={p} />
        ))}
      </div>
    </section>
  );
}
