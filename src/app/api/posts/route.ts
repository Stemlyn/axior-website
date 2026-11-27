import { NextResponse, type NextRequest } from "next/server";
import { getPosts } from "@/lib/blog";

/*
 * The newest published posts, for the home page's "From the Axior desk" strip. The home page is
 * prerendered (fast to serve), so it fetches these after load instead of reading them per request.
 */
export async function GET(req: NextRequest) {
  const n = Number(req.nextUrl.searchParams.get("limit") ?? 3);
  const limit = Number.isInteger(n) ? Math.min(Math.max(n, 1), 12) : 3;
  const posts = (await getPosts()).slice(0, limit);
  return NextResponse.json({ posts }, { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } });
}
