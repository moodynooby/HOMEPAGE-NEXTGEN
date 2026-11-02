import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const getSystemPreference = () => {
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
};

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
	const [mode, setMode] = useState(() => {
		const savedMode = localStorage.getItem("themeMode");
		if (savedMode) return savedMode;
		return "system";
	});

	const [highContrast, setHighContrast] = useState(() => {
		return localStorage.getItem("highContrast") === "true";
	});

	useEffect(() => {
		localStorage.setItem("themeMode", mode);

		const effectiveMode = mode === "system" ? getSystemPreference() : mode;
		document.documentElement.setAttribute("data-theme", effectiveMode);
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
		const handleChange = (e) => {
			if (mode === "system") {
				document.documentElement.setAttribute(
					"data-theme",
					e.matches ? "dark" : "light",
				);
			}
		};
		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [mode]);

	const toggleColorMode = () => {
		setMode((prevMode) => {
			if (prevMode === "system") {
				return getSystemPreference() === "light" ? "dark" : "light";
			}
			return prevMode === "light" ? "dark" : "light";
		});
	};

	const setThemeMode = (newMode) => {
		setMode(newMode);
	};

	const toggleHighContrast = () => {
		setHighContrast((prev) => !prev);
	};

	const value = {
		mode,
		toggleColorMode,
		setThemeMode,
		highContrast,
		toggleHighContrast,
		setHighContrast,
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};

ThemeContextProvider.propTypes = {
	children: PropTypes.node,
};
