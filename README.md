# Manas Doshi — Portfolio

An editorial "living archive" of browser extensions, web apps, games and experiments. Built with React 19, Vite 8 and the Astryx design system.

## Getting started

```bash
pnpm install
pnpm dev
```

`pnpm dev` regenerates `src/theme/palette.generated.css` from `src/theme/palette.js`, then starts Vite on port 5173.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Dev server (port 5173) |
| `pnpm build` | Production build to `dist/` (regenerates palette CSS first) |
| `pnpm run preview` | Serve the built output |
| `pnpm generate:palette` | Regenerate the palette CSS only |
| `pnpm test` | Vitest suite |
| `pnpm lint` | Biome lint + format (auto-fix) |
| `pnpm typecheck` | `tsc --noEmit` |

The pre-commit hook runs lint, typecheck and tests.

## Routes

| Path | Page |
| --- | --- |
| `/` | Landing page — hero, featured work, tech radar, timeline, gallery |
| `/projects` | The Project Ledger — filterable, sortable, year-grouped |
| `/projects/:projectName` | Article page with the repo's README |
| `/links` | Social and contact links |
| `/gallery` | Cloudinary media with lightbox |

## Where things live

- **Portfolio content** — `src/content/*.json`. Add projects to `projects.json`; the UI is a thin layer over this data. See [AGENTS.md](./AGENTS.md) for the content model.
- **Design rules** — [DESIGN.md](./DESIGN.md). Palette values are authored once in `src/theme/palette.js`; a build step emits CSS custom properties, and the Astryx theme is derived from the same map.
- **Data/state logic** — `src/hooks/`. Components in `src/components/` are mostly presentation; page-level components orchestrate hooks and presentational pieces.
