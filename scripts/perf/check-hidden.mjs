// Fails if the first <section> of a page is server-rendered with an inline opacity:0, meaning the
// visitor sees nothing there until JavaScript runs (that is what made the hero slow to appear).
// Usage: node scripts/perf/check-hidden.mjs   (needs a production build in .next-build)
import { spawn } from "node:child_process";

const PORT = 3200;
const PAGES = ["/", "/services", "/audit", "/trust", "/coverage", "/book", "/blog"];

const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  env: { ...process.env, NEXT_DIST_DIR: ".next-build" },
  stdio: "ignore",
});
const stop = () => server.kill("SIGTERM");

async function waitUp() {
  for (let i = 0; i < 60; i++) {
    try {
      await fetch(`http://127.0.0.1:${PORT}/robots.txt`);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error("server did not start");
}

const failures = [];
try {
  await waitUp();
  for (const path of PAGES) {
    const html = await (await fetch(`http://127.0.0.1:${PORT}${path}`)).text();
    const main = html.slice(html.indexOf('<main'));
    const start = main.indexOf("<section");
    const section = main.slice(start, main.indexOf("</section>", start));
    const hidden = [...section.matchAll(/<([a-z0-9]+)[^>]*style="[^"]*opacity:\s*0(?![.\d])[^"]*"[^>]*>/gi)];
    for (const m of hidden) failures.push(`${path}: <${m[1]}> ${m[0].slice(0, 110)}…`);
  }
} finally {
  stop();
}
if (failures.length) {
  console.error(`check-hidden: FAIL, ${failures.length} hidden-until-JS elements in the first section:\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.log(`check-hidden: PASS (${PAGES.length} pages)`);
