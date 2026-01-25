# AGENTS.md

## Build & Commands
- **Dev**: `bun dev` or `npm run dev` (Vite dev server)
- **Build**: `bun build` or `npm run build` (Vite production build to `dist/`)
- **Lint**: `eslint .` (check) or `eslint . --fix` (auto-fix)
- **Preview**: `npm run preview` (Vite preview of built output)

## Architecture & Structure
**Frontend**: React 19.2 + Vite 7 SPA with React Router v7
- **src/Components/**: React components (Header, LandingPage, Projects, ProjectDetail, LinkTree, WebDesignServices)
- **src/Content/**: JSON data files (e.g., socialLinks.json)
- **src/Assets/**: Static images/media
- **src/index.css**: Global styles
- **src/main.jsx**: Entry point (Router, Theme setup)
- **MUI 7.3**: Material-UI for components, custom theme in main.jsx
- **Emotion**: CSS-in-JS (@emotion/react, @emotion/styled)
- **Motion**: Framer Motion v12 for animations
- No database, backend, or external APIs

## Code Style & Conventions
- **Language**: ES2024, JSX
- **Imports**: Organized (builtin → external → internal), no default exports from components
- **Quotes**: Single quotes (prefer escape over double quotes)
- **Semicolons**: Always required
- **Indentation**: 2 spaces
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Prop validation**: PropTypes required on all components (`react/prop-types: error`)
- **Unused vars**: Error, except args starting with `_`
- **Spacing**: Always in object braces (`{ }`) and around arrows
- **Hooks**: ESLint enforces Rules of Hooks; deps checked via `exhaustive-deps` (warn)
- **React Refresh**: Exports must be components/const unless `allowConstantExport: true`
- **No console**: Warn (remove debug logs before commit)
