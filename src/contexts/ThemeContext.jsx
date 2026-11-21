import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/config/storage";
import { META_THEME_COLORS } from "@/theme/palette";
import { DARK_MEDIA_QUERY, DEFAULT_THEME_MODE } from "@/theme/themeConfig";

const ThemeContext = createContext();

const getSystemPreference = () =>
	window.matchMedia(DARK_MEDIA_QUERY).matches ? "dark" : "light";

export const useThemeContext = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error(
			"useThemeContext must be used within a ThemeContextProvider",
		);
	}
	return context;
};

export const ThemeContextProvider = ({ children }) => {
	const [mode, setMode] = useState(
		() => localStorage.getItem(STORAGE_KEYS.themeMode) || DEFAULT_THEME_MODE,
	);
	const [highContrast, setHighContrast] = useState(
		() => localStorage.getItem(STORAGE_KEYS.highContrast) === "true",
	);
	const [systemMode, setSystemMode] = useState(() => getSystemPreference());

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.themeMode, mode);
	}, [mode]);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.highContrast, highContrast);
		if (highContrast) {
			document.documentElement.setAttribute("data-high-contrast", "true");
		} else {
			document.documentElement.removeAttribute("data-high-contrast");
		}
	}, [highContrast]);

	useEffect(() => {
		const mediaQuery = window.matchMedia(DARK_MEDIA_QUERY);
		const handleChange = (event) =>
			setSystemMode(event.matches ? "dark" : "light");
		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	const effectiveMode = mode === "system" ? systemMode : mode;

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", effectiveMode);
		const metaThemeColor = document.querySelector('meta[name="theme-color"]');
		if (metaThemeColor) {
			metaThemeColor.setAttribute(
				"content",
				effectiveMode === "dark"
					? META_THEME_COLORS.dark
					: META_THEME_COLORS.light,
			);
		}
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
		effectiveMode,
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};

ThemeContextProvider.propTypes = {
	children: PropTypes.node,
};
