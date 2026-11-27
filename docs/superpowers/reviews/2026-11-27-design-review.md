# Final design review (2026-11-27)

Skill: design-review. Pages checked in the built-in browser at 375 px (every section of `/`, `/book` steps) and 1440 px (`/services`, `/`), plus the automated audit from the UI pass at 320/375 px on all pages. The gstack screenshot tool needs a Playwright browser download, so the built-in browser was used instead.

## First impression
The site communicates **calm competence**: dark editorial hero, one serif headline, a clear gold primary action. My eye goes to the headline, then "Book Pilot Audit", then the WhatsApp button. One word: **trustworthy**.

## Findings and fixes
| # | Impact | Page | Finding | Fix | Commit |
|---|---|---|---|---|---|
| 001 | Medium | `/book` plan step (phones) | "Best fit for your 1–2BHK apartment" badge wrapped to two lines inside its pill and crowded the plan rows | Badge reads "Best fit" on phones (full text from `sm`), badges never wrap | 491b617 |
| 002 | Polish | `/` "locked year" grid (phones) | Forced 220 px row height left an empty gap between title and text in short cards | Minimum row height only from `md` up | 68d64e7 |

Both verified in the browser after the fix (badge single line, 21 px; card height 175 px, no gap).

## Checked, no change needed
- Hero photo, headline and CTAs on phones and desktop; report card on desktop.
- Section rhythm and reveals on `/` at 375 px: every section visible after scroll, no stuck content.
- Plan cards on `/services` (1440 px): Choose buttons aligned at card bottoms, recommended card emphasised.
- Footer at 375 px: 44 px link rows, readable.
- No horizontal scroll at 320/360/375 px on any page (UI pass and booking test).

## Deferred (owner's call)
- Blog link at the top level of the navbar; Privacy and Terms pages (see site-architecture review).
