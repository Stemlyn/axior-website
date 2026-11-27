// Compressed size of the JavaScript each prerendered page loads (from the production build in .next-build).
// Usage: node scripts/perf/js-size.mjs [route ...]   e.g. node scripts/perf/js-size.mjs / /services
import { readFileSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";

const routes = process.argv.slice(2).length ? process.argv.slice(2) : ["/", "/services", "/book"];
const kb = (n) => Math.round(n / 1024);
for (const route of routes) {
  const file = `.next-build/server/app${route === "/" ? "/index" : route}.html`;
  if (!existsSync(file)) {
    console.log(`${route}: not prerendered (dynamic), skipped`);
    continue;
  }
  const html = readFileSync(file, "utf8");
  const srcs = [...new Set([...html.matchAll(/src="(\/_next\/static\/chunks\/[^"]+\.js)"/g)].map((m) => m[1]))];
  let total = 0;
  for (const s of srcs) total += gzipSync(readFileSync(`.next-build${s.replace("/_next", "")}`)).length;
  console.log(`${route}: ${srcs.length} scripts, ${kb(total)} KB gzipped`);
}
