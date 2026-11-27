# Performance baseline and results

## Before (live site, axior-website.axior-a8f.workers.dev, 375 px, 2026-11-27)

| Page | LCP | TTFB | CLS | JS transferred |
|---|---|---|---|---|
| `/` (cold) | **4,688 ms** (hero intro paragraph) | **1,796 ms** | 0 | 246 KB (11 files) |
| `/services` | not captured (pane in background) | 504 ms | 0 | cached |
| `/book` | not captured | 184 ms | 0 | cached |

Home also loaded: images 321 KB (3, w=750), fonts 70 KB (4 files), CSS 12 KB.

## Automated checks at baseline (`npm run check:perf`)

- check-routes: FAIL — `/` rendered on every request.
- check-hidden: FAIL — 24 elements in the first section are server-rendered with `opacity:0` (home hero lines, CTAs, report card; inner pages' PageHeader).
- check-motion-imports: FAIL — `motion` imported in HomeHero, InspectionWalkthrough, blocks, ui/navbar.
  13   /
   8   /audit
   1   /coverage
   1   /services
   1   /trust

## Motion-performance audit (Task 4, skill fixing-motion-performance)

| Finding | Rule | Fix |
|---|---|---|
| Fixed navbar card had `backdrop-blur-xl` on a 95%-opaque white surface; the blur repainted on every scroll frame and during the card's layout animation, for no visible effect | blur: never on large surfaces | Removed blur; background `white/[0.97]` |
| Full-viewport menu scrim faded in/out with `backdrop-blur-[2px]` | blur: never animate on large surfaces | Plain `bg-night/45` dim |
| Navbar scroll handler called two `setState`s every scroll frame | scroll: no per-frame work | Values tracked in a ref; state set only when a flag flips |
| "Read the coastal climate guide" and mega-panel "Open …" links animated `gap` on hover | mechanism: transform over layout | Arrow moves with `translate` instead |
| Hero and `ParallaxShot` parallax | — | OK: framer-motion motion values, transform only, no React renders |
| `Reveal` | — | OK: IntersectionObserver (`whileInView`), one-shot |
| Mega panel / mobile drawer `height: auto` | layout, one-shot on an isolated fixed element | Kept for now; revisited in Task 8 (springs) |

Checked after the change: navbar still hides on scroll down (logo at −77 px) and returns on scroll up (31 px).

## First-load JavaScript (gzipped, from the production build; `node scripts/perf/js-size.mjs`)

| Page | Before (Task 5 build) | After lazy motion (Task 6) |
|---|---|---|
| `/` | 264 KB, 12 scripts | 233 KB, 14 scripts |
| `/services` | 265 KB | 234 KB |
| `/audit` | 264 KB | 233 KB |
