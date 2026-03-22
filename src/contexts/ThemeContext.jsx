import PropTypes from "prop-types";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

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
		return getSystemPreference();
	});

	useEffect(() => {
		localStorage.setItem("themeMode", mode);
	}, [mode]);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = (e) => {
			if (localStorage.getItem("themeMode") === "system") {
				setMode(e.matches ? "dark" : "light");
			}
		};
		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	const toggleColorMode = useCallback(() => {
		setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
	}, []);

	const setThemeMode = useCallback((newMode) => {
		setMode(newMode);
	}, []);

	const value = useMemo(
		() => ({
			mode,
			toggleColorMode,
			setThemeMode,
		}),
		[mode, toggleColorMode, setThemeMode],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};

ThemeContextProvider.propTypes = {
	children: PropTypes.node,
};
