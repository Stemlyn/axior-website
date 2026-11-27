// Fails if a component imports the full `motion` component from framer-motion. The site uses the
// lightweight `m` inside <LazyMotion strict>, which throws at runtime if `motion` is used.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const files = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?)$/.test(f)) files.push(p);
  }
})("src");

const bad = files.filter((f) => {
  const src = readFileSync(f, "utf8");
  const m = /import\s*\{([^}]*)\}\s*from\s*["']framer-motion["']/.exec(src);
  return m && /(^|[\s,])motion([\s,]|$)/.test(m[1]);
});
if (bad.length) {
  console.error(`check-motion-imports: FAIL, import { motion } in: ${bad.join(", ")}`);
  process.exit(1);
}
console.log(`check-motion-imports: PASS (${files.length} files)`);
