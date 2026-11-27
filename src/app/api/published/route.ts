import { NextResponse, connection } from "next/server";
import { readPublished } from "@/lib/published";

/*
 * Prices and site settings published from the admin console, for the browser (see lib/store.tsx).
 * Read from Cloudflare D1 in production, or the console's shared file locally. Returns {} when
 * nothing is published, and the site falls back to its built-in values.
 */
export async function GET() {
  await connection(); // always read at request time, never cached at build
  const { pricing, site } = await readPublished();
  return NextResponse.json({ pricing: pricing ?? null, site: site ?? null }, { headers: { "Cache-Control": "no-store" } });
}
