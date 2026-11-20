import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider } from "@/components/ui/styles";
import { getTheme } from "@/theme/theme";

const ThemeContext = createContext();

const getSystemPreference = () =>
	window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const useThemeContext = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		return {
			mode: "system",
			setMode: () => {},
			toggleColorMode: () => {},
			highContrast: false,
			toggleHighContrast: () => {},
		};
	}
	return context;
};

export const ThemeContextProvider = ({ children }) => {
	const [mode, setMode] = useState(() => {
		const savedMode = localStorage.getItem("themeMode");
		return savedMode || "system";
	});
	const [highContrast, setHighContrast] = useState(
		() => localStorage.getItem("highContrast") === "true",
	);
	const [systemMode, setSystemMode] = useState(() => getSystemPreference());

	useEffect(() => {
		localStorage.setItem("themeMode", mode);
	}, [mode]);

	useEffect(() => {
		localStorage.setItem("highContrast", highContrast);
		document.documentElement.toggleAttribute(
			"data-high-contrast",
			highContrast,
		);
	}, [highContrast]);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = (event) =>
			setSystemMode(event.matches ? "dark" : "light");
		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	const effectiveMode = mode === "system" ? systemMode : mode;
	const theme = getTheme(effectiveMode, highContrast);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", effectiveMode);
	}, [effectiveMode]);

	const toggleColorMode = () => {
		if (mode === "system") {
			setMode(systemMode === "light" ? "dark" : "light");
		} else {
			setMode(mode === "light" ? "dark" : "light");
		}
	};

	const toggleHighContrast = () => {
		setHighContrast((prev) => !prev);
	};

	const value = {
		mode,
		setMode,
		toggleColorMode,
		highContrast,
		toggleHighContrast,
	};

	return (
		<ThemeContext.Provider value={value}>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</ThemeContext.Provider>
	);
};

ThemeContextProvider.propTypes = {
	children: PropTypes.node,
};
