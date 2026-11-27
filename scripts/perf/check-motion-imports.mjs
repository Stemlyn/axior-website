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

// The server can't know prefers-reduced-motion (useReducedMotion() is null there, true/false in the
// browser), so animation props that branch on it render different styles on server and client and
// React never patches them: elements stay clipped or invisible. Reduced motion is handled globally
// by <MotionConfig reducedMotion="user">; never branch initial/animate/exit/variants on it.
const branchy = [];
for (const f of files) {
  readFileSync(f, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (/\b(initial|animate|exit|variants|whileInView)=\{\s*reduce\s*\?/.test(line) || /^\s*(enter|exit|center|initial|animate)\s*:\s*\([^)]*\)\s*=>\s*\(?\s*reduce\s*\?/.test(line) || /entrance === "css"[\s\S]*?: reduce/.test(line) || /^\s*: reduce\s*$/.test(line))
        branchy.push(`${f}:${i + 1}`);
    });
}
if (branchy.length) {
  console.error(`check-motion-imports: FAIL, animation props branch on reduced motion (server/client mismatch):\n  ${branchy.join("\n  ")}`);
  process.exit(1);
}
console.log(`check-motion-imports: PASS (${files.length} files)`);
