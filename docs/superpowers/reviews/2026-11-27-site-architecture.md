# Site architecture review (2026-11-27)

Small-business service site, 2 levels deep, every page within 2 clicks of home.

```
Home (/)
├── Services & Pricing (/services)      #plans #compare #repairs
├── The 30-Point Audit (/audit)         #console #flags
├── Trust & Security (/trust)           #keys #video #society
├── Coverage Areas (/coverage)          #areas #climate
├── Owner guides (/blog)
│   └── Article (/blog/{slug})
└── Book (/book, ?plan=pilot|spot|essential|vip)   ← header CTA on every page
```

| Page | URL | Header | Footer | Priority |
|---|---|---|---|---|
| Home | `/` | logo | — | High |
| Services & Pricing | `/services` | mega menu 1 | Evaluate | High |
| 30-Point Audit | `/audit` | mega menu 2 | Evaluate | High |
| Trust & Security | `/trust` | mega menu 3 | Evaluate | High |
| Coverage | `/coverage` | mega menu 4 | Evaluate | Medium |
| Owner guides | `/blog`, `/blog/{slug}` | Coverage menu footer link | Evaluate | Medium |
| Book | `/book` | CTA button | Evaluate | High |

## Checks

- Internal links: 20 distinct targets in `src`, all 200; all 9 `#section` anchors exist on their pages.
- Orphans: none. Every page is linked from the header or footer and the home page.
- URLs: lowercase, hyphenated, no dates or IDs; `/book?plan=` canonicalises to `/book`.
- Sitemap: all 7 pages plus each published article.

## Fixed

- Blog articles now emit `BreadcrumbList` structured data (Home › Owner guides › Article).

## For the owner to decide

1. **Blog in the header.** It is reachable from the footer, the home page and the Coverage menu, but not from the top level of the navbar. A fifth top-level link ("Guides") would make it easier to find; it fits the 4–7 item guideline.
2. **Privacy and Terms pages.** None exist yet; the booking flow collects details over WhatsApp. They need the registered company name and address, so they wait for those details.
