# Richer Motion and Fast Mobile Loading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the AXIOR website feel premium in motion while its home page shows main content within 2.5 s on a phone.

**Architecture:** framer-motion stays, but loads lazily (`LazyMotion` + `m.*`, features imported async) behind one shared motion vocabulary (`src/lib/motion.ts`). Above-the-fold text animates with CSS keyframes so it paints before hydration. The home page becomes static again by moving the latest-posts strip to a client island fed by a small JSON endpoint.

**Tech Stack:** Next.js 16.4.6 (App Router, `cacheComponents` off), React 19.3, Tailwind v4, framer-motion 14.14.0, OpenNext on Cloudflare Workers.

**Spec:** `docs/superpowers/specs/2026-11-27-motion-and-mobile-speed-design.md`

## Global Constraints

- Phone targets (375 px): LCP ≤ 2.5 s (aim ~1.8 s), home TTFB ≤ 0.6 s, CLS < 0.05, initial JS ≤ 246 KB compressed.
- Animate `transform`, `opacity`, `clip-path` and `filter` only; never width/height/top/left/margin.
- Entrances finish within ~600 ms; page transitions ≤ 300 ms with no exit animation; no scroll-jacking.
- No above-the-fold text or button may be server-rendered with `opacity:0`.
- `prefers-reduced-motion`: content appears instantly, parallax off (`MotionConfig reducedMotion="user"` stays).
- Breakpoints to check: 360, 375, 414, 768, 1024, 1280, 1440 px; no horizontal scroll; touch targets ≥ 44 px.
- Dynamic routes allowed: `/book`, `/blog`, `/blog/[slug]`, `/api/*`, `/sitemap.xml`. Everything else static.
- No brand, colour, type or copy redesign; no admin changes; do not push until the D1 database ID is set.
- Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Visitor with reduced motion on → no movement, nothing stuck invisible (Task 1 `check-hidden.mjs` also runs with motion off in Task 9).
- Slow phone where the motion feature bundle arrives late or fails → `m.*` elements must still render visible content (Task 6 step: block the features chunk in the browser and confirm the page reads).
- Visitor who navigates fast between pages → page transition never stacks or delays content (Task 8 step: rapid nav test).
- Home page with zero published posts → latest-posts strip renders nothing, no layout jump (Task 5 test).
- Booking step change on a 360 px phone → sliding panel causes no horizontal scroll (Task 8 step at 360 px).

---

### Task 1: Baseline and automated guards

**Files:**
- Create: `scripts/perf/check-routes.mjs`, `scripts/perf/check-hidden.mjs`, `scripts/perf/check-motion-imports.mjs`, `docs/superpowers/perf-baseline.md`
- Modify: `package.json` (script `"check:perf": "node scripts/perf/check-routes.mjs && node scripts/perf/check-hidden.mjs && node scripts/perf/check-motion-imports.mjs"`)

**Interfaces:**
- Produces: `npm run check:perf` used as the test in every later task.

- [ ] **Step 1: Write `check-routes.mjs`**: runs `NEXT_DIST_DIR=.next-build next build`, parses the route table, exits 1 if any route other than the allowed dynamic list is marked `ƒ`.
- [ ] **Step 2: Write `check-hidden.mjs`**: starts `next start` on port 3200 from `.next-build`, fetches `/`, `/services`, `/audit`, `/trust`, `/coverage`, `/book`, `/blog`; for each, takes the HTML of the first `<section>` and exits 1 if it contains `opacity:0` in a `style` attribute. Prints the offending tag.
- [ ] **Step 3: Write `check-motion-imports.mjs`**: exits 1 if any file in `src` imports `motion` (not `m`) from `framer-motion`.
- [ ] **Step 4: Run `npm run check:perf`** — Expected now: FAIL (home `/` is `ƒ`; hero and PageHeader text have `opacity:0`; five files import `motion`). Paste the failures into `perf-baseline.md`.
- [ ] **Step 5: Record live baseline** at 375 px with the browser (same JS as the earlier measurement: LCP, TTFB, CLS, script KB) for `/`, `/services`, `/book` into `perf-baseline.md`.
- [ ] **Step 6: Commit** `chore: perf guards and baseline`.

### Task 2: Site-architecture review (skill `site-architecture:site-architecture`)

**Files:** findings in `docs/superpowers/reviews/2026-11-27-site-architecture.md`; fixes in `src/lib/nav.ts`, `src/components/ui/navbar.tsx`, `src/components/Footer.tsx`, `src/app/sitemap.ts` as findings require.

- [ ] **Step 1:** Run the skill against the 7 pages + blog: hierarchy, nav labels, internal links, URL scheme, orphan pages, breadcrumbs, sitemap coverage.
- [ ] **Step 2:** Verify every internal `href` in `src` resolves (script one-off: collect `href="/..."` and `href: "/..."`, request each on the dev server, expect 200 or a known anchor).
- [ ] **Step 3:** Fix findings that are bugs or confusion; list judgement calls in the review file for the owner.
- [ ] **Step 4: Commit** `fix: site architecture review findings`.

### Task 3: Design and UI-engineering pass (skills `apple-design`, `frontend-ui-engineering`)

**Files:** findings in `docs/superpowers/reviews/2026-11-27-ui-pass.md`; fixes in the components they name.

- [ ] **Step 1:** Review each page in the browser at 375 and 1280 px against both skills: hierarchy, spacing rhythm, touch targets ≥ 44 px, focus states, contrast, empty/loading states, form states on `/book`.
- [ ] **Step 2:** Fix findings within the Global Constraints (no rebrand). Record anything that needs the owner's call.
- [ ] **Step 3:** `npx tsc --noEmit && npm run lint` — Expected: clean.
- [ ] **Step 4: Commit** `fix: ui pass findings`.

### Task 4: Motion-performance audit of existing motion (skill `fixing-motion-performance`)

**Files:** findings appended to `docs/superpowers/perf-baseline.md`; fixes in `HomeHero.tsx`, `blocks.tsx`, `InspectionWalkthrough.tsx`, `ui/navbar.tsx`.

- [ ] **Step 1:** Audit: layout-property animation, scroll listeners outside motion values, `will-change` misuse, large blurred/backdrop-filter layers animating, parallax on very tall elements, re-renders per scroll frame.
- [ ] **Step 2:** Fix what the audit finds (e.g. navbar `useMotionValueEvent` setState per frame → threshold-gated).
- [ ] **Step 3:** Commit `perf: fix existing motion hot spots`.

### Task 5: Static home page (latest posts as a client island)

**Files:**
- Create: `src/app/api/posts/route.ts`, `src/components/LatestPosts.tsx`, `src/lib/post-format.ts`
- Modify: `src/app/page.tsx` (remove server `LatestPosts`, render `<LatestPosts />`), `src/components/BlogCard.tsx` (import `postDate` from `post-format`), `src/lib/blog.ts` (re-export `postDate` from `post-format`)

**Interfaces:**
- Produces: `GET /api/posts?limit=3` → `{ posts: Post[] }` (same `Post` type as `lib/blog.ts`), `Cache-Control: public, max-age=60, s-maxage=60`.
- Produces: `postDate(iso: string): string` in `src/lib/post-format.ts` (no Node imports, usable in client components).
- Produces: `<LatestPosts />` client component; renders `null` until loaded and when `posts.length === 0`.

- [ ] **Step 1: Test** — `npm run check:perf` must report `/` as `○` after this task (currently `ƒ`).
- [ ] **Step 2:** Implement route, `post-format.ts`, client island (fetch on mount, then the existing section markup with `BlogCard`).
- [ ] **Step 3: Empty case** — with `../shared/published.json` blog set to `[]` (temp copy via `AXIOR_SHARED_FILE`), home shows no strip and no gap; restore.
- [ ] **Step 4:** `npm run check:perf` route check — Expected: `/` static. Commit `perf: prerender home, load latest posts client-side`.

### Task 6: Lazy motion and the shared motion system

**Files:**
- Create: `src/lib/motion.ts`, `src/components/motion-features.ts`
- Modify: `src/components/Providers.tsx`, every file importing `motion` from framer-motion (`HomeHero.tsx`, `blocks.tsx`, `InspectionWalkthrough.tsx`, `ui/navbar.tsx`, `BookingForm.tsx` when motion is added)

**Interfaces:**
- Produces in `src/lib/motion.ts`: `DUR = { fast: 0.2, base: 0.45, slow: 0.7 }`, `EASE_OUT = [0.16, 1, 0.3, 1]`, `SPRING = { type: "spring", stiffness: 260, damping: 30 }`, variants `fadeUp`, `fadeIn`, `scaleIn`, `maskReveal`, `stagger(step = 0.07, delay = 0): Variants`, hook `useScrollDepth(ref, range = ["-6%", "6%"]): MotionValue<string>` returning a static `"0%"` under reduced motion.
- Produces: `motion-features.ts` default export `domMax`.
- `Providers.tsx`: `<LazyMotion features={() => import("./motion-features").then(r => r.default)} strict><MotionConfig reducedMotion="user">`.

- [ ] **Step 1: Test** — `check-motion-imports.mjs` currently fails (5 files).
- [ ] **Step 2:** Create the two modules; switch Providers; replace `motion.` with `m.` everywhere.
- [ ] **Step 3:** `npm run check:perf` motion-import check passes; `npx tsc --noEmit` clean.
- [ ] **Step 4: Late-features check** — in the browser, block requests to the features chunk (Network request blocking or throttle to slow 3G): pages still show all content.
- [ ] **Step 5:** Compare client JS total vs baseline (from `.open-next/assets/_next/static/chunks`) — Expected: initial ≤ baseline. Commit `perf: lazy-load framer-motion features, shared motion system`.

### Task 7: Above-the-fold text paints before hydration; images and fonts

**Files:**
- Modify: `src/app/globals.css` (keyframes `rise` and utility `.rise` using `--rise-delay`; reduced-motion override sets `animation: none`), `src/components/HomeHero.tsx`, `src/components/blocks.tsx` (`PageHeader` text), `src/components/Photo.tsx` (optional `placeholder="blur"` support), `src/lib/site.ts` (`PHOTOS` gain `blur` data URLs), `next.config.ts` (`images.formats: ["image/avif", "image/webp"]`), `src/app/layout.tsx` (fonts: confirm weights/subsets, `display: "swap"`)
- Create: `scripts/perf/make-blur.mjs` (generates 16 px base64 placeholders for each photo into `src/lib/photo-blur.ts`)

**Interfaces:**
- Produces: CSS class `rise` with custom property `--rise-delay` (seconds); hero/PageHeader lines use `style={{ "--rise-delay": "0.12s" }}`.
- Produces: `PHOTO_BLUR: Record<PhotoKey, string>` in `src/lib/photo-blur.ts`.

- [ ] **Step 1: Test** — `check-hidden.mjs` currently fails on `/` and every PageHeader page.
- [ ] **Step 2:** Implement CSS entrance; keep hero photo settle (scale 1.06→1) and parallax on `m.div` (photo is not the LCP text).
- [ ] **Step 3:** Blur placeholders, AVIF/WebP, `sizes` checked on hero and card images.
- [ ] **Step 4: Below-the-fold code** — if `InspectionWalkthrough` or `FAQ` add > 10 KB compressed to the home page's first-load JS, load them with `next/dynamic` (SSR kept, so content and SEO stay). Record sizes before/after.
- [ ] **Step 5:** `npm run check:perf` — Expected: all three checks PASS. Commit `perf: CSS hero entrance, image placeholders and formats`.

### Task 8: The richer motion (skills `improve-animations`, then `motion-framer`)

**Files:**
- Create: `docs/superpowers/reviews/2026-11-27-animation-plan.md` (output of `improve-animations`), `src/app/template.tsx`
- Modify: `src/components/blocks.tsx` (`Reveal` → staggered children API, `ParallaxShot` + `maskReveal`, `ReportCard` spring entrance + pulsing dot), `src/components/PricingSection.tsx` (price cross-fade keyed on `property+currency`, "Best fit" badge with `layoutId="best-fit"`, card `whileHover`/`whileTap`), `src/components/BlogCard.tsx` (hover lift), `src/components/BookingForm.tsx` (step panels slide by direction with `AnimatePresence mode="popLayout"`, progress bar spring, option check scale-in, price card cross-fade), `src/components/ui/navbar.tsx` (panel/drawer springs, drawer items stagger), `src/components/InspectionWalkthrough.tsx` (retime to `DUR`/`EASE_OUT`)

**Interfaces:**
- Consumes: everything in Task 6's `src/lib/motion.ts`.
- Produces: `Reveal` signature `({ children, className, delay?: number, stagger?: boolean })` — with `stagger`, direct children animate in sequence (`stagger(0.07, delay)`).
- `template.tsx`: `m.div` `initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: EASE_OUT }}`; skipped under reduced motion.

- [ ] **Step 1:** Run `improve-animations` on the current state; save its prioritized plan; reconcile with spec section 4 (spec wins on conflicts).
- [ ] **Step 2:** Implement per the plan with `motion-framer` guidance, in the files above.
- [ ] **Step 3: Rapid-nav test** — click 5 nav links within 2 s: content of the final page is visible within 300 ms of its load, no stacked transitions.
- [ ] **Step 4: 360 px booking test** — walk all 4 steps forward and back: `document.documentElement.scrollWidth === innerWidth` throughout.
- [ ] **Step 5: Reduced-motion test** — emulate `prefers-reduced-motion: reduce`: no transforms animate, all content visible.
- [ ] **Step 6:** `npm run check:perf`, `npx tsc --noEmit`, `npm run lint` — clean. Commit `feat: richer motion system across site`.

### Task 9: Final design review (skill `design-review`) and verification (skill `superpowers:verification-before-completion`)

**Files:** `docs/superpowers/reviews/2026-11-27-design-review.md`; fixes wherever it points.

- [ ] **Step 1:** Run `design-review` on all pages at the seven breakpoints in the built-in browser; fix findings (atomic commits).
- [ ] **Step 2:** `npx opennextjs-cloudflare build` and `npx wrangler dev` (local Workers runtime) — measure LCP, CLS, script KB at 375 px for `/`, `/services`, `/book`; record against baseline in `perf-baseline.md`.
- [ ] **Step 3:** Report to the owner: numbers before/after, what changed, what needs their deploy (D1 ID) to measure TTFB live. Live TTFB is measured after the push.
