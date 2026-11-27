# Richer motion and fast mobile loading: design

Date: 2026-11-27. Site: axior-web (Next.js 16, React 19, Tailwind v4, framer-motion, hosted on Cloudflare Workers via OpenNext).

## Intent

The owner's words: "the animations feel basic and the site loads slow on mobile." Visitors are Gulf NRIs, mostly on phones, often on mobile data. The site sells trust and care for an empty home, so it should feel calm, considered and premium (an Apple-like standard), and it must open fast on a phone.

## What we measured (live site, phone size, 2026-11-27)

- Main hero text is the largest element and appears at **4.7 s** (Google's "good" line is 2.5 s). It is rendered with `opacity: 0` and only fades in after framer-motion has loaded and hydrated.
- Time to first byte **1.8 s**: the home page is rendered on every request because `LatestPosts` reads D1 (`connection()`), so `/` is fully dynamic.
- Scripts **~246 KB** compressed in 11 files; framer-motion is a large share. Photos 320 KB and fonts 70 KB are acceptable.
- Motion today: `HomeHero` (entrance + scroll parallax), `Reveal` and `ParallaxShot` in `blocks.tsx`, `InspectionWalkthrough` (step transitions), navbar (mega panels, hide-on-scroll, mobile drawer). All fade/slide with one easing; no stagger, no spring, no page transitions.

## Goals

1. Motion that feels deliberate and premium: choreographed entrances with stagger, spring physics on interactive elements, depth on scroll, smooth transitions between pages and inside the booking flow.
2. Phone load, measured on the live site at 375 px with the browser's own timings:
   - main content (LCP) **≤ 2.5 s**, target ~1.8 s;
   - time to first byte on the home page **≤ 0.6 s**;
   - layout shift (CLS) **< 0.05**;
   - initial JavaScript no larger than today (≤ 246 KB compressed), ideally lower.
3. Smooth on a mid-range Android phone: animations stay at 60 fps (transform and opacity only, no layout-property animation).
4. Responsive at 360, 375, 414, 768, 1024, 1280 and 1440 px with no horizontal scroll.

## Non-goals

- No redesign of brand, colours, typography or copy (beyond fixes the design review finds).
- No new pages or content sections.
- No change to the admin console.

## Anti-goals (a failure even if it "works")

- Any text or button that is invisible until JavaScript runs (that is what makes LCP slow now).
- Motion that delays reading or tapping: entrances finish within ~600 ms, nothing blocks scrolling, no scroll-jacking.
- Ignoring `prefers-reduced-motion`: with it on, content appears instantly and parallax is off.
- Jank on scroll or a layout shift caused by an animation.

## Approaches considered

- **A. Speed-first, motion mostly in CSS** (browser-native scroll animations, framer-motion only for interactive parts). Fastest, but the owner wants the richer choreography a motion library gives.
- **B. Richer framer-motion everywhere, with the load cost engineered away. Chosen by the owner.**
- C. Fix speed only, keep current motion. Rejected: doesn't address "animations feel basic".

## Design (approach B)

### 1. Load framer-motion lazily, so richer motion doesn't cost first load
- Replace `motion.*` with the lightweight `m.*` components inside `<LazyMotion features={...} strict>` in `Providers.tsx` (keeping `MotionConfig reducedMotion="user"`).
- Load the feature bundle asynchronously (`features={() => import("./motion-features").then(r => r.default)}` exporting `domMax`, which includes layout animations and drag). The page paints before it arrives.

### 2. Never hide the LCP or above-the-fold text behind JavaScript
- The hero headline, intro paragraph and CTAs get their entrance from CSS keyframes (with the same easing and stagger values as the motion system), so they animate on first paint, before hydration. framer-motion then takes over only for scroll-linked effects (parallax, scale-on-scroll).
- Any `initial={{ opacity: 0 }}` on content that can be in the first screen is removed or replaced with the CSS entrance.

### 3. One shared motion system
A small module, `src/lib/motion.ts`, holds the vocabulary every component uses:
- durations (fast 0.2 s, base 0.45 s, slow 0.7 s), easings (`easeOutExpo` for entrances, a soft spring `{ type: "spring", stiffness: 260, damping: 30 }` for interactive feedback);
- variants: `fadeUp`, `fadeIn`, `scaleIn`, `stagger(children, delay)`, `maskReveal` for photos (clip-path inset to 0);
- a `useScrollDepth()` helper for parallax that returns static values under reduced motion.

### 4. Where the richer motion goes
- **Hero (home):** staggered headline words (CSS), photo slowly settling from 1.06 to 1 scale on load, parallax depth on scroll; the report card floats in with a spring and its status dot pulses.
- **Section entrances:** `Reveal` becomes staggered (heading, then text, then items, 60–80 ms apart), triggered once at ~20% into view.
- **Photos:** mask reveal (clip-path) on enter plus gentle parallax via `ParallaxShot`.
- **Cards and buttons:** spring hover/press (`whileHover` lift 2–4 px, `whileTap` scale 0.98) on plan cards, blog cards, booking options; transform only.
- **Plans (/services):** switching property animates prices (number cross-fade) and moves the "Best fit" highlight between cards with a shared `layoutId`.
- **Booking (/book):** steps slide horizontally with direction (forward or back), the progress bar fills with a spring, the selected option's check animates in; the left price card cross-fades when the plan changes.
- **Inspection walkthrough:** keep, retime to the shared system.
- **Navbar:** keep behaviour; panel and drawer move to springs; mobile drawer items stagger in.
- **Page transitions:** a short fade-up of `<main>` content on route change (a `template.tsx` entrance animation, ≤ 300 ms, with no exit animation so it never delays the next page) so navigation feels continuous without delaying content.

### 5. Speed fixes that motion doesn't cover
- **Home page static again:** move the latest-posts strip to load after the page (a small client component calling `/api/published`-style endpoint for blog, or a cached server read), so `/` is prerendered and served without a per-request render. Same check for every route: only `/book` (reads `?plan`), `/blog`, `/blog/[slug]`, `/api/*` and `/sitemap.xml` stay dynamic.
- **Hero photo:** `priority`, correct `sizes`, AVIF/WebP from the image resizer, and a small blurred placeholder so the photo area is never blank.
- **Fonts:** keep `next/font` (self-hosted); check only the needed weights load and `display: swap`.
- **Below-the-fold scripts:** the inspection walkthrough and FAQ load after first paint (dynamic import) if they are large.

### 6. How we know it's done
- Before/after numbers for LCP, TTFB, CLS and script size from the live site at phone size, plus a production-build check locally.
- Every page checked at the breakpoints in Goal 4 in the browser; with reduced motion on; and keyboard focus still visible.
- `npx tsc`, `npm run lint`, `npx opennextjs-cloudflare build` all clean.

## Process (the owner's requested order)

1. Site-architecture review: pages, navigation, internal links, URLs; fix anything broken or confusing first.
2. Apple-design and frontend-UI-engineering pass: spacing, hierarchy, touch targets (≥ 44 px), states, accessibility.
3. Motion-performance audit of existing motion (before adding any).
4. Speed fixes (section 5) and lazy motion (section 1–2).
5. Animation plan (improve-animations) then build it with framer-motion (sections 3–4).
6. Final design review in the browser at every breakpoint; fix what it finds.
7. Verify (section 6) and report numbers.

## Left to the builder

- Exact motion values within the system above; component file layout; whether the blog strip uses a client fetch or a cached server read (whichever keeps `/` static).
- Deploy: changes are pushed only after the D1 database ID is set (pending from the owner), since every push deploys.
