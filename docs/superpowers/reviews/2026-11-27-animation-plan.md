# Animation plan (improve-animations, 2026-11-27)

Recon: Next.js 16, framer-motion 14 through `LazyMotion` + `m` (features `domMax`, loaded after paint). Shared vocabulary in `src/lib/motion.ts`: `DUR {fast .2, base .45, slow .7}`, `EASE_OUT [0.16, 1, 0.3, 1]`, `SPRING {stiffness 260, damping 30}`, variants `fadeUp`, `fadeIn`, `scaleIn`, `maskReveal`, `stagger()`, `useScrollDepth()`. First screen uses the CSS `rise` keyframe. Tailwind v4 `hover:` already only applies on hover-capable devices. Personality: calm, premium, trustworthy; crisp rather than bouncy.

Frequency: navbar and cards are hit often (keep motion short, CSS where predetermined); booking steps and property switches are occasional (standard motion); page transitions every navigation (≤ 300 ms, no exit).

## Findings (vetted, by leverage)

| # | Sev | Category | Location | Finding | Fix |
|---|---|---|---|---|---|
| 1 | MED | Missed opportunity | `PricingSection.tsx` prices, "Best fit" badge | Switching property teleports every price and jumps the badge between cards | Price cross-fade keyed on value; badge shared `layoutId` |
| 2 | MED | Missed opportunity | `BookingForm.tsx` step body, progress, price card | Steps swap instantly; the price card changes without any cue | Directional slide, progress fill, price cross-fade |
| 3 | MED | Physicality | plan cards, `BlogCard`, booking options | No hover or press feedback on the site's most clicked surfaces | CSS lift + press scale |
| 4 | MED | Cohesion | `blocks.tsx` `Reveal` | Sections arrive all at once (no stagger), 0.8 s each | `stagger` prop: children 60 ms apart, 0.45 s |
| 5 | MED | Easing & duration | `ui/navbar.tsx` mega panel 0.35 s, mobile sub-menus default ease | Over the 150–250 ms dropdown budget; easing not shared | 0.25 s `EASE_OUT`; drawer items stagger 40 ms |
| 6 | LOW | Missed opportunity | `ParallaxShot` | Photos only drift | One-shot `maskReveal` when entering view |
| 7 | LOW | Missed opportunity | route changes | Pages swap with no continuity | `template.tsx` fade-up 0.28 s on client navigation only |

## Plans (exact values)

1. **Pricing switch** (`src/components/PricingSection.tsx`). Wrap each price in `AnimatePresence mode="popLayout" initial={false}` with an `m.span` keyed `${property}-${currency}-${key}`: enter `{opacity: 0, y: 8, filter: "blur(2px)"}` → `{opacity: 1, y: 0, filter: "blur(0px)"}`, exit `{opacity: 0, y: -8}`, `duration: DUR.fast, ease: EASE_OUT`. "Best fit" badge becomes `m.span layoutId="best-fit"` with `transition: { type: "spring", duration: 0.5, bounce: 0.15 }`. Under reduced motion: no y, no layout animation (opacity only).
2. **Booking** (`src/components/BookingForm.tsx`). Step body: `AnimatePresence mode="popLayout" initial={false} custom={dir}`; enter `x: 24 * dir, opacity: 0` → `x: 0, opacity: 1`; exit `x: -24 * dir, opacity: 0`; `duration: 0.25, ease: EASE_OUT`; container `overflow-hidden` so nothing widens the page. Progress segments fill with `scaleX` 0→1, `transform-origin: left`, CSS `transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1)`. Left price card: price cross-fade like plan 1, keyed on `plan + property + currency`. Reduced motion: opacity only.
3. **Card feedback** (CSS, predetermined motion): plan cards and `BlogCard` `transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.99]`; booking options `active:scale-[0.99]` with `transition-[transform,border-color,background-color] duration-150`. `motion-reduce:transform-none`.
4. **Reveal** (`src/components/blocks.tsx`). Add `stagger?: boolean`. With it: parent `m.div variants={stagger(0.06, delay)} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10% 0px" }}`; each direct child wrapped in `m.div variants={fadeUp}`. Without it: one element, `fadeUp` timing (0.45 s). Apply `stagger` to card grids on home, /services, /trust, /audit where `Reveal` wraps lists.
5. **Navbar** (`src/components/ui/navbar.tsx`). Mega panel and mobile drawer `transition: { duration: reduce ? 0 : 0.25, ease: EASE_OUT }`; mobile sub-menus the same at 0.2 s. Drawer menu rows: `stagger(0.04)` + `fadeUp` with `y: 8`.
6. **Photo reveal** (`ParallaxShot`). Outer `m.div variants={maskReveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-15% 0px" }}`; parallax unchanged on the inner element. Reduced motion: skip (render shown).
7. **Page transitions** (`src/app/template.tsx`, new). `m.div` `initial={first ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: EASE_OUT }}` where `first` is a module-level flag cleared after the first mount, so the server HTML and first load never start hidden. No exit animation. Reduced motion: `y: 0`.

## Feel checks
- Slow the animation 4x in DevTools (Animations panel) for the price swap and booking slide: no double-exposure, no horizontal scroll at 360 px.
- Click five nav links quickly: each page shows within ~300 ms, nothing stacks.
- Reduced motion on: everything appears, nothing slides.

Ruling recorded: plan lives here (the implementation plan names this path) instead of the skill's default `plans/` folder.
