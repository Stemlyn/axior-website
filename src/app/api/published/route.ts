import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { NextResponse, connection } from "next/server";

/*
 * Prices and site settings published from the admin console in demo mode (no Supabase), read from
 * the shared file the console writes (../shared/published.json). Returns {} when there is none, and
 * the site falls back to its built-in values. With Supabase configured the site reads the database.
 */

const FILE = process.env.AXIOR_SHARED_FILE || resolve(/* turbopackIgnore: true */ process.cwd(), "../shared/published.json");

export async function GET() {
  await connection(); // always read at request time, never cached at build
  try {
    const data = JSON.parse(await readFile(/* turbopackIgnore: true */ FILE, "utf8"));
    return NextResponse.json(
      { pricing: data.pricing ?? null, site: data.site ?? null, updatedAt: data.updatedAt ?? null },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({}, { headers: { "Cache-Control": "no-store" } });
  }
}
