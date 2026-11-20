import { Theme } from "@astryxdesign/core/theme";
import isPropValid from "@emotion/is-prop-valid";
import { CssBaseline } from "@mui/material";
import { MotionConfig } from "motion/react";
import { StrictMode, Suspense } from "react";
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
import RouteLoader from "@/components/RouteLoader";
import { BookmarksContextProvider } from "@/contexts/BookmarksContext";
import { ThemeContextProvider } from "@/contexts/ThemeContext";
import { APP_ROUTES } from "@/routes";
import { defaultThemeSlug, themes } from "./astryx-themes";

const AppContent = () => (
	<>
		<CssBaseline />
		<BrowserRouter>
			<MotionConfig isValidProp={isPropValid}>
				<CommandPalette>
					<ErrorBoundary>
						<Suspense fallback={<RouteLoader />}>
							<Routes>
								{APP_ROUTES.map((route) => (
									<Route
										key={route.path}
										path={route.path}
										element={route.element}
									/>
								))}
							</Routes>
						</Suspense>
					</ErrorBoundary>
				</CommandPalette>
			</MotionConfig>
		</BrowserRouter>
	</>
);

const root = createRoot(document.getElementById("root"));

root.render(
	<StrictMode>
		<Theme theme={themes[defaultThemeSlug]}>
			<ThemeContextProvider>
				<BookmarksContextProvider>
					<AppContent />
				</BookmarksContextProvider>
			</ThemeContextProvider>
		</Theme>
	</StrictMode>,
);
