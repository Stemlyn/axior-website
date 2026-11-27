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
