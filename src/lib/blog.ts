import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { connection } from "next/server";
import { PHOTOS, type PhotoKey } from "./site";

/*
 * Blog posts written and published in the admin console (Content > Blog).
 * - With Supabase configured: the public `blog` row of admin_kv (published posts only).
 * - Demo mode: the shared file the console writes (../shared/published.json).
 * Drafts never reach the website. Always read at request time, so a publish shows up on the next load.
 */

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  cover: PhotoKey;
  author: string;
  publishedAt: string;
  updatedAt: string;
}

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const FILE = process.env.AXIOR_SHARED_FILE || resolve(/* turbopackIgnore: true */ process.cwd(), "../shared/published.json");

const str = (v: unknown) => (typeof v === "string" ? v : "");

/** Keep only well-formed posts; anything odd in the store is dropped rather than crashing a page. */
function clean(raw: unknown): Post[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((p): p is Record<string, unknown> => !!p && typeof p === "object")
    .map((p) => ({
      id: str(p.id),
      slug: str(p.slug),
      title: str(p.title),
      excerpt: str(p.excerpt),
      body: str(p.body),
      category: str(p.category) || "Notes",
      cover: (str(p.cover) in PHOTOS ? p.cover : "window") as PhotoKey,
      author: str(p.author) || "Axior",
      publishedAt: str(p.publishedAt) || str(p.updatedAt),
      updatedAt: str(p.updatedAt),
      published: p.status === "published",
    }))
    .filter((p) => p.published && /^[a-z0-9-]+$/.test(p.slug) && p.title && p.publishedAt)
    .map((p): Post => ({ id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt, body: p.body, category: p.category, cover: p.cover, author: p.author, publishedAt: p.publishedAt, updatedAt: p.updatedAt }))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

async function load(): Promise<unknown> {
  if (SUPA_URL && SUPA_KEY) {
    const res = await fetch(`${SUPA_URL}/rest/v1/admin_kv?key=eq.blog&select=value`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as { value: unknown }[];
    return rows[0]?.value ?? [];
  }
  const data = JSON.parse(await readFile(/* turbopackIgnore: true */ FILE, "utf8"));
  return data.blog ?? [];
}

export async function getPosts(): Promise<Post[]> {
  await connection();
  try {
    return clean(await load());
  } catch {
    return [];
  }
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((p) => p.slug === slug);
}

export function postDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
}
