# Design System — "The Editorial Monograph"

## 1. Overview & Creative Direction

**North Star: "The Living Archive."**

The site is a digital broadsheet: a 1920s print-journalism aesthetic translated into a premium portfolio experience. Where modern SaaS leans on cards, shadows, and rounded corners, this system treats the interface as layers of ink-pressed paper — intentional asymmetry, dense information hierarchy, and a type-first editorial grid. The portfolio reads like a curated index of published work rather than a gallery of thumbnails.

Every interaction should feel like an act of curation: authoritative, human, and historically grounded.

## 2. Design Principles

1. **Type-first hierarchy** — Solve layout problems with typographic scale before reaching for boxes, fills, or borders.
2. **Scannability** — The projects ledger is the heart of the portfolio. Content must read in a single left-to-right sweep: title → one-line description → metadata. Consistent left edges beat clever layouts.
3. **Restraint** — No shadows, no rounded corners, no pure black, no heavy borders. Separation comes from tonal shifts and whitespace.
4. **Craft** — Paper grain, sepia accents, and a grayscale→color reveal on hover give the archive a tactile, physical quality.

## 3. Color Tokens

All colors are defined once in `src/theme/theme.js` and exposed as MUI palette tokens. **Use tokens in components; never hard-code hex.** Values below are the implemented tokens.

| Token | Light | Dark | Usage |
| --- | --- | --- | --- |
| `primary.main` | `#5f5e5e` | `#fdffda` | Ink black; primary buttons, active states |
| `primary.dark` | `#38392e` | `#f1f3c3` | Deep ink; gradients, hover states |
| `primary.contrastText` | `#fdffda` | `#38392e` | Text on primary surfaces |
| `secondary.main` | `#7d5d53` | `#a6827a` | Sepia; accents, italic years, links, arrows |
| `background.default` / `.paper` | `#fdffda` | `#282a21` | Parchment canvas / card surfaces |
| `text.primary` | `#38392e` | `#fdffda` | Body ink |
| `text.secondary` | `#7d5d53` | `#a6827a` | Muted meta, labels |
| `divider` | `rgba(56,57,46,.10)` | `rgba(253,255,218,.15)` | The "ghost border" — hairline rules only |

### Rules

- **No pure black.** `#38392e` is the darkest ink — it retains an organic softness that avoids digital eye strain.
- **The ghost border.** Sectioning uses the `divider` token (≤15% opacity), never a strong 1px stroke. A boundary should feel like a faint indentation in the paper.
- **Tonal separation.** Use `divider` and `action.hover` (subtle background shifts) instead of borders to define surfaces.

## 4. Typography

Three families, loaded via `@fontsource` in `src/main.jsx`. Typography is the primary hierarchy tool.

| Role | Family | Weights loaded | Usage |
| --- | --- | --- | --- |
| Display / headlines | Newsreader | 400, 700, 800, 400-italic | Masthead, section titles, project titles, italic year medallions |
| Body | Noto Serif | 400, 700 | `body1`/`body2` reading text, taglines, README content |
| Labels / meta | Work Sans Variable | variable | Buttons, `caption`, `overline` — uppercase with letter-spacing |

MUI variant map (from the theme): `h1`–`h6` use Newsreader (weights 800/700/700/600/600/600, negative letter-spacing on `h1`/`h2`); `body1`/`body2` use Noto Serif; `button`, `caption`, and `overline` use Work Sans.

### Usage notes

- **The masthead** uses Newsreader, centered, flanked by hairline rules above and below.
- **Meta lines** (category, year, language) are `overline`-style Work Sans: uppercase, `0.68–0.75rem`, letter-spacing `0.12–0.15em`. This is the "classifieds" voice — the contrast to the serif headlines is what makes scanning work.
- **No center-aligned body text.** Left-align or justify with good hyphenation.

## 5. Layout & Spacing

- **Spacing scale:** MUI's 8px base (`theme.spacing(n)`). The ledger uses `mb: 12` (96px) between year groups, `py: 3.5` (28px) within rows, `gap: 4` (32px) between row elements.
- **Embrace whitespace** at the `20`–`24` spacing levels to let the ink breathe.
- **Asymmetry is allowed — misalignment is not.** Editorial offsets and centered medallions create character; every list row keeps one consistent left edge for scanning.

### The Project Ledger (signature component)

- Full-width rows on desktop, grouped under circular **year medallions** (italic Newsreader year, hairline ring) on a central timeline rule.
- Each row: entry number (`No. 01`) → square thumbnail (grayscale, colorizes on hover) → Newsreader title → two-line tagline (clamped) → `overline` meta (`CATEGORY · YEAR · LANGUAGE`).
- Rows are separated by ghost hairlines; hover lifts the row with a subtle `action.hover` background and slides the arrow.
- On mobile: the timeline and entry numbers disappear, thumbnails shrink, rows stack.

## 6. Elevation & Texture

- **No shadows.** Depth comes from tonal layering (see §3) and, where an element must float, a wide diffused shadow at low opacity is the *only* exception.
- **Paper grain:** a `noise.webp` texture is blended (`soft-light`) onto the body background.
- **Vellum effect:** floating surfaces (the app bar) use `background` at ~85% opacity with `backdrop-filter: blur(12px)` so underlying newsprint bleeds through.
- **Grayscale→color reveal:** project thumbnails render `grayscale(100%) contrast(115%)` and restore full color on hover — a quiet "catalog → artifact" transition.

## 7. Components

| Component | Rules |
| --- | --- |
| **Buttons** | Primary: ink gradient (`primary.main → primary.dark`), sharp corners, no shadow. Secondary: `outline` frame at 20% opacity. Tertiary: text with a hairline underline that expands on hover. |
| **Cards & lists** | No divider lines between items — separate with whitespace or the ghost border. The ledger row (see §5) is the canonical list item. |
| **Inputs** | Bottom-only hairline rule; on focus the line shifts to `primary` and the label to sepia. |
| **Chips** | Work Sans, uppercase, letter-spacing `0.1em`, square corners. |
| **Links** | Inherit text color, hairline underline offset 4px; underline darkens on hover. |

## 8. Content Guidelines (Portfolio)

The design only shines if the content is curated. Follow the content model in [AGENTS.md](./AGENTS.md):

- **Taglines** are the most-scanned text on the page — one plain-language sentence about *what the project is*, ≤ ~110 chars, no markdown, no "click here."
- **Categories** are a closed set: `Web App`, `Browser Extension`, `Game`, `AI Tool`, `Computer Vision`.
- **Thumbnails** should be square logos/icons that read at 88px on a light plate.
- **Asset URLs** (READMEs, thumbnails) track each repo's **default branch**, so the site always shows the latest content. Update `githubImg`/`githubContentPath` if a file is ever moved or renamed.

## 9. Accessibility & Performance

- Ink-on-parchment contrast meets WCAG AA in both themes; hover is always an *enhancement*, never the only signal (rows remain clickable and visually distinct).
- All images carry `alt` text; thumbnails are `loading="lazy"`.
- Typography is fontsource-subsetted; the build splits vendor chunks and lazy-loads routes.
- Preserve existing motion patterns (`motion` + `whileInView`) — animations are entrance-only and subtle; don't add continuous or looping motion.

## 10. Do's and Don'ts

**Do:**
- Solve layout with type scale first; use whitespace (`20`–`24`) generously.
- Keep list content left-aligned and consistent for fast scanning.
- Use palette tokens and the ghost-border `divider` everywhere.

**Don't:**
- Rounded corners (`0px` is absolute — it preserves the cut-paper aesthetic).
- Heavy shadows, pure black (`#000000`), or center-aligned body text.
- Strong 1px borders for sectioning — use tonal shifts or the 10–15% ghost border.
- Add container chrome around content the type hierarchy can carry alone.
