// Fails if a route that should be prerendered is rendered on every request (marked ƒ in the build).
// Usage: node scripts/perf/check-routes.mjs   (runs a production build into .next-build)
import { execSync } from "node:child_process";

const ALLOWED_DYNAMIC = new Set(["/book", "/blog", "/blog/[slug]", "/sitemap.xml"]);

const out = execSync("npx next build", {
  env: { ...process.env, NEXT_DIST_DIR: ".next-build", NEXT_TELEMETRY_DISABLED: "1" },
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"],
  maxBuffer: 50 * 1024 * 1024,
});

const dynamic = [];
for (const line of out.split("\n")) {
  const m = /^[┌├└│ ]+\s*ƒ\s+(\/\S*)/.exec(line);
  if (m) dynamic.push(m[1]);
}
const bad = dynamic.filter((r) => !ALLOWED_DYNAMIC.has(r) && !r.startsWith("/api/"));
if (bad.length) {
  console.error(`check-routes: FAIL, rendered on every request but should be static: ${bad.join(", ")}`);
  process.exit(1);
}
console.log(`check-routes: PASS (dynamic: ${dynamic.join(", ") || "none"})`);
