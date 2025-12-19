# Agent Guidelines for HOMEPAGE-NEXTGEN
## Design Philosophy 
- It is made with the intention of being vibrant and playful yet professional
## Commands
- **Dev server**: `bun run dev` or `npm run dev` (Vite dev server with HMR)
- **Build**: `bun run build` or `npm run build` (production build)
- **Lint**: `bun run lint` or `npm run lint` (ESLint)
- **Preview**: `bun run preview` (preview production build)
- **No test framework configured** - do not assume one exists

## Architecture
- **Stack**: React 19 + Vite + Material-UI (MUI) + React Router + Framer Motion
- **Build tool**: Vite with SWC (fast refresh)
- **Package manager**: Bun (has bun.lock)
- **Structure**: `/src/Components/` (Header, LandingPage, Projects, ProjectDetail), `/src/Content/` (projects.json, socialLinks.json), `/src/Assets/` (static files)
- **Routing**: React Router with routes in `main.jsx` (/, /projects, /projects/:projectName)
- **Theme**: MUI custom theme (indigo primary, amber secondary) defined in `main.jsx`
- **Content**: Projects and social links stored as JSON, project details fetched from GitHub and rendered with ReactMarkdown

## Code Style
- **Imports**: Order by builtin → external → internal → parent → sibling → index with newlines between groups
- **Quotes**: Single quotes (`'`)
- **Semicolons**: Required (`;`)
- **PropTypes**: Required - use `prop-types` for all component props
- **React**: No React import needed in JSX (React 17+)
- **Naming**: PascalCase for components, camelCase for functions/variables
- **MUI patterns**: Use `sx` prop for styling, theme hooks (`useTheme`, `useMediaQuery`) for responsive design
- **Icons**: Import from `@mui/icons-material`, map in `iconMap` objects when rendering dynamically
- **No console/unused vars**: Warn on `console.log`, error on unused variables
