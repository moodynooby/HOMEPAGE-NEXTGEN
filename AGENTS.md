# AGENTS.md — Project Guide

## Project Overview

`modern-portfolio` is the personal portfolio website of **Manas Doshi** (GitHub: [`moodynooby`](https://github.com/moodynooby)). Its purpose is to present the owner's work — browser extensions, web apps, games, and experiments — as an editorial "living archive."

The site is **content-driven**: all portfolio data (projects, gallery, social links) lives as JSON under `src/content`, and the UI is a thin presentation layer over it. When asked to "add a project" or "update the portfolio," edit the JSON, not the components.

The visual language is documented in [DESIGN.md](./DESIGN.md) — read it before making any UI change. Its rules are non-negotiable: **0px corner radius, no pure black (`#38392e` is the ink), serif display type (Newsreader), and Work Sans for labels/meta.**

To keep the site from reading as AI-generated, every UI change must pass the [DESIGN.md §10 "Never" ban list](./DESIGN.md) before finishing — no scrolling metric tickers, glassmorphism on gradients, floating action buttons, full-screen gradient backgrounds, icons standing in for headings, filler metadata, or hard-coded hex outside `src/theme/`.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Generate palette CSS, then start Vite (port **5173**, strict, opens browser) |
| `pnpm build` | Generate palette CSS, then build to `dist/` (must pass before finishing) |
| `pnpm generate:palette` | Regenerate `src/theme/palette.generated.css` from `palette.js` |
| `pnpm lint` | Biome: auto-fix lint + format |
| `pnpm biome check <files>` | Check specific files without modifying them |
| `pnpm test` | Vitest suite |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm run preview` | Serve the built output |

Run `pnpm biome check` on changed files and `pnpm build` to verify any non-trivial change. The pre-commit hook runs lint, typecheck and tests.

## Architecture

**Stack:** React 19 + Vite 8 SPA, React Router 7, Astryx Design System (`@astryxdesign/core`, `@astryxdesign/theme-neutral`), `lucide-react`, `motion` (animations), `kbar` (command palette), `react-markdown` + `remark-gfm` (README rendering), Cloudinary (gallery assets), `yet-another-react-lightbox` (gallery lightbox), React Compiler (via `babel-plugin-react-compiler`).

- Path alias: `@/*` → `src/*` (see `vite.config.js`, `jsconfig.json`)
- Routing: `BrowserRouter` in `src/main.jsx`; routes are lazy-loaded behind `Suspense` + `RouteLoader`

| Route | Component | Notes |
| --- | --- | --- |
| `/` | `LandingPage` | Hero + CTA, embeds `Gallery` (limit 4) |
| `/projects` | `Projects` | "The Project Ledger" — year-grouped scannable list |
| `/projects/:projectName` | `ProjectDetail` | Renders pinned README markdown |
| `/links` | `LinkTree` | Social/contact links |
| `/gallery` | `Gallery` | Cloudinary media with lightbox |

### Source layout

```
src/
├── components/     Orchestrators (Projects, ProjectDetail, LandingPage,
│                   ProjectTimeline, CommandPalette) + focused presentational pieces
├── content/        projects.json, gallery.json, socialLinks.json,
│                   techRadar.json, timelineMilestones.json  ← edit content here
├── contexts/       ThemeContext, BookmarksContext
├── hooks/          useProjectsData, useProjectFilters, useProjectHealth,
│                    useProjectDetail, useLandingStats, useTimelineFilters,
│                    useShortcutsModal, useIsMobile
├── theme/          palette.js (only authored palette), paletteTokens.js,
│                    astryxTheme.js, palette.generated.css (generated)
├── utils/          githubUtils.js, socialIcons.js, cache.js, projects.js, ...
├── index.css       Global editorial styles (consumes palette tokens)
└── main.jsx        Entry: generated palette CSS, fonts, Theme, router, kbar
scripts/
└── generate-palette-css.js  Emits palette.generated.css before dev/build
```

### Data flow

- **`useProjectsData`** enriches `projects.json` with GitHub metadata (`fetchRepoMetadata`: creation year, primary language) via the GitHub API, cached in `localStorage` for 7 days. Cache keys are versioned (`github_meta_v3_*`) — bump the version when the shape of cached data changes.
- **`useProjectFilters`** owns the ledger's search/category/language/sort state and derived grouping. **`ProjectCard`** subscribes to `useProjectHealth`, a shared external store that dedupes health fetches and state across every row.
- **`useProjectDetail`** fetches the README from the repo's default branch (`githubContentPath`), cached 24h, with an `AbortController` to cancel stale requests.

## Content Model (Portfolio)

### Adding a project — `src/content/projects.json`

Each entry is an object with these fields:

| Field | Required | Notes |
| --- | --- | --- |
| `githubName` | ✅ | Repo name; also the route segment and the card title. Must be URL-safe and unique. |
| `githubContentPath` | ✅ | Raw README URL on the repo's **default branch** (e.g. `/main/README.md` or `/master/readme.md`) so the page always shows the latest version. |
| `githubImg` | ✅ | Logo/thumbnail URL. Should read clearly at 88px on a light background. |
| `tagline` | ✅ | One plain-language sentence — *what it is*, not "click here". ~110 chars max, no markdown. |
| `category` | ✅ | One of: `Web App`, `Browser Extension`, `Game`, `AI Tool`, `Computer Vision`. |
| `addonId` | Optional | Firefox add-on slug, when the project is published on AMO. |

Guidelines: the tagline is the most-scanned text on the page — write it for someone skimming. When the project has a product name distinct from the repo name (e.g. `modern-darkreader` → "Lean Dark+"), mention it in the tagline.

### Gallery — `src/content/gallery.json`

Cloudinary API export (`resources[]`). Images/videos can carry captions in `context.custom`. Regenerate via the Cloudinary console rather than hand-editing.

### Social links — `src/content/socialLinks.json`

Array of `{ "link", "alt" }` rendered in the header/footer and `/links`.

## Design System

Full documentation: [DESIGN.md](./DESIGN.md). Quick reference:

- **Colors** are authored only in `src/theme/palette.js`. `scripts/generate-palette-css.js` emits `palette.generated.css` before dev/build, and `astryxTheme.js` derives the Astryx tokens from the same map via `paletteTokens.js`. Styles consume CSS custom properties (`--color-text-primary`, `--color-background-body`, `--color-border`, …) — never hard-code hex.
- **Typography**: Newsreader (headlines, 600–800), Noto Serif (body), Work Sans Variable (labels/buttons/meta, uppercase with letter-spacing).
- **Borders**: hairline rules only, via the `--color-border` token. No heavy borders, 0px rounded corners, no heavy drop shadows.

## Code Conventions

- **Language:** ES2024, JSX. Files use tabs (2-space visual indent).
- **Imports:** organized builtin → external → internal; double quotes; the `@/` alias for internal paths.
- **Exports:** each component file has a single default export (PascalCase). Keep named exports for utilities (`githubUtils.js`).
- **Naming:** PascalCase components, camelCase functions/variables.
- **PropTypes:** required on every component (`react/prop-types: error`).
- **Unused vars:** error (arguments starting with `_` are exempt).
- **Spacing/style:** spaces inside object braces and around arrows; semicolons always.
- **Hooks:** biome enforces Rules of Hooks; `exhaustive-deps` is a warning — honor it where reasonable. Keep data/state logic in `src/hooks/` and components focused on presentation.
- **Console:** warn-level — remove debug logs before finishing.
- **React Refresh:** component files should export components/constants so HMR keeps working.

## Quality Gates

1. `pnpm biome check <changed files>` — no errors (lint + format + organize imports).
2. `pnpm build` — completes successfully.
3. `pnpm test` and `pnpm typecheck` — green (also enforced by the pre-commit hook).
4. No `console.log` left behind; no hard-coded colors that bypass theme tokens.
