import { CssBaseline, ThemeProvider } from "@mui/material";
import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/700.css";
import "@fontsource/newsreader/800.css";
import "@fontsource/newsreader/400-italic.css";
import "@fontsource/noto-serif/400.css";
import "@fontsource/noto-serif/700.css";
import "@fontsource-variable/work-sans";

import "./index.css";
import CommandPalette from "@/components/CommandPalette";
import ErrorBoundary from "@/components/ErrorBoundary";
import LandingPage from "@/components/LandingPage";
import RouteLoader from "@/components/RouteLoader";
import { ThemeContextProvider, useThemeContext } from "@/contexts/ThemeContext";
import { getTheme } from "@/theme/theme";

const SpeedDial = lazy(() => import("@/components/Projects"));
const ProjectDetail = lazy(() => import("@/components/ProjectDetail"));
const LinkTree = lazy(() => import("@/components/LinkTree"));
const Gallery = lazy(() => import("@/components/Gallery"));

const AppContent = () => {
	const { mode } = useThemeContext();
	const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
		.matches
		? "dark"
		: "light";
	const effectiveMode = mode === "system" ? systemPreference : mode;
	const theme = getTheme(effectiveMode);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<CommandPalette>
					<ErrorBoundary>
						<Suspense fallback={<RouteLoader />}>
							<Routes>
								<Route path="/" element={<LandingPage />} />
								<Route path="/projects" element={<SpeedDial />} />
								<Route
									path="/projects/:projectName"
									element={<ProjectDetail />}
								/>
								<Route path="/links" element={<LinkTree />} />
								<Route path="/gallery" element={<Gallery />} />
							</Routes>
						</Suspense>
					</ErrorBoundary>
				</CommandPalette>
			</BrowserRouter>
		</ThemeProvider>
	);
};

const root = createRoot(document.getElementById("root"));

root.render(
	<StrictMode>
		<ThemeContextProvider>
			<AppContent />
		</ThemeContextProvider>
	</StrictMode>,
);
