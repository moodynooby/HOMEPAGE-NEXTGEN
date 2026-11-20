import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import { META_THEME_COLORS } from "@/theme/palette";

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
			effectiveMode: "light",
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
		if (highContrast) {
			document.documentElement.setAttribute("data-high-contrast", "true");
		} else {
			document.documentElement.removeAttribute("data-high-contrast");
		}
	}, [highContrast]);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
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
