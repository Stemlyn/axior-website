import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/*
 * What the admin console has published for the public site: prices, site settings and the blog.
 * - On Cloudflare: the shared D1 database (binding `DB`), table `kv`. Only these three keys are ever
 *   read here; operational data in the same database is never queried by the website.
 * - Local development: the file the console writes (../shared/published.json).
 * Any failure returns {} and the site falls back to its built-in values.
 */

export type Published = { pricing?: unknown; site?: unknown; blog?: unknown };

const FILE = process.env.AXIOR_SHARED_FILE || resolve(/* turbopackIgnore: true */ process.cwd(), "../shared/published.json");

interface D1 {
  prepare(sql: string): { all<T>(): Promise<{ results: T[] }> };
}

/**
 * True only inside the Cloudflare Workers runtime. Outside it (next dev / next start on a laptop),
 * getCloudflareContext would quietly start a local, empty D1 through wrangler instead.
 */
const onWorkers = () => typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

async function fromD1(): Promise<Published | null> {
  if (!onWorkers()) return null;
  let db: D1 | undefined;
  try {
    const { env } = await getCloudflareContext({ async: true });
    db = (env as unknown as { DB?: D1 }).DB;
  } catch {
    return null; // not running on Cloudflare
  }
  if (!db) return null;
  try {
    const { results } = await db
      .prepare("SELECT key, value FROM kv WHERE key IN ('pricing', 'site', 'blog')")
      .all<{ key: string; value: string }>();
    const out: Published = {};
    for (const r of results) out[r.key as keyof Published] = JSON.parse(r.value);
    return out;
  } catch {
    return {}; // table not created yet (the console creates it on first sign-in)
  }
}

export async function readPublished(): Promise<Published> {
  const d1 = await fromD1();
  if (d1) return d1;
  try {
    const data = JSON.parse(await readFile(/* turbopackIgnore: true */ FILE, "utf8"));
    return { pricing: data.pricing, site: data.site, blog: data.blog };
  } catch {
    return {};
  }
}
