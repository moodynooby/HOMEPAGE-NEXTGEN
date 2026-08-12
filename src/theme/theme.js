import { alpha, createTheme } from "@mui/material/styles";

const getDesignTokens = (mode) => {
	const isLight = mode === "light";

	return {
		palette: {
			mode,
			primary: {
				main: isLight ? "#1f2933" : "#f4efe4",
				dark: isLight ? "#101820" : "#fffaf0",
				contrastText: isLight ? "#fffaf0" : "#1f2933",
			},
			secondary: {
				main: isLight ? "#c06c4f" : "#e0a083",
				light: isLight ? "#e7a98d" : "#f0bba5",
				dark: isLight ? "#934c37" : "#b86e55",
			},
			background: {
				default: isLight ? "#f7f4ed" : "#111820",
				paper: isLight ? "#fffdf8" : "#19232d",
			},
			text: {
				primary: isLight ? "#1f2933" : "#f7f4ed",
				secondary: isLight ? "#66717d" : "#b8c1c9",
			},
			divider: isLight ? "rgba(31, 41, 51, 0.14)" : "rgba(247, 244, 237, 0.16)",
		},
		typography: {
			fontFamily: '"Noto Serif", serif',
			h1: {
				fontFamily: '"Newsreader", serif',
				fontWeight: 800,
				letterSpacing: "-0.04em",
			},
			h2: {
				fontFamily: '"Newsreader", serif',
				fontWeight: 700,
				letterSpacing: "-0.02em",
			},
			h3: {
				fontFamily: '"Newsreader", serif',
				fontWeight: 700,
			},
			h4: {
				fontFamily: '"Newsreader", serif',
				fontWeight: 600,
			},
			h5: {
				fontFamily: '"Newsreader", serif',
				fontWeight: 600,
			},
			h6: {
				fontFamily: '"Newsreader", serif',
				fontWeight: 600,
			},
			body1: {
				fontFamily: '"Noto Serif", serif',
				fontSize: "1.1rem",
				lineHeight: 1.7,
			},
			body2: {
				fontFamily: '"Noto Serif", serif',
				lineHeight: 1.6,
			},
			button: {
				fontFamily: '"Work Sans Variable", "Work Sans", sans-serif',
				fontWeight: 600,
				textTransform: "none",
				letterSpacing: "0.05em",
			},
			caption: {
				fontFamily: '"Work Sans Variable", "Work Sans", sans-serif',
			},
			overline: {
				fontFamily: '"Work Sans Variable", "Work Sans", sans-serif',
			},
		},
		shape: {
			borderRadius: 12,
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: (theme) => ({
					"*": {
						boxSizing: "border-box",
					},
					html: {
						scrollBehavior: "smooth",
					},
					body: {
						margin: 0,
						padding: 0,
						minHeight: "100vh",
						overflowX: "hidden",
						WebkitFontSmoothing: "antialiased",
						MozOsxFontSmoothing: "grayscale",
						transition: "background-color 0.4s ease, color 0.4s ease",
						backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.025)}, transparent 360px), url("/noise.webp")`,
						backgroundBlendMode: "normal, soft-light",
						backgroundSize: "100% 100%, 150px 150px",
					},
					"::-webkit-scrollbar": {
						width: "8px",
					},
					"::-webkit-scrollbar-track": {
						background: theme.palette.background.default,
					},
					"::-webkit-scrollbar-thumb": {
						background: theme.palette.text.secondary,
						border: `2px solid ${theme.palette.background.default}`,
					},
					"::-webkit-scrollbar-thumb:hover": {
						background: theme.palette.text.primary,
					},
					"[kbar-portal]": {
						"--kbar-bg-color": `${theme.palette.background.default} !important`,
						"--kbar-primary-color": `${theme.palette.text.primary} !important`,
					},
				}),
			},
			MuiButton: {
				styleOverrides: {
					root: ({ theme }) => ({
						borderRadius: 8,
						padding: "10px 18px",
						boxShadow: `0 6px 18px ${alpha(theme.palette.primary.main, 0.08)}`,
						transition: "transform 0.2s ease, box-shadow 0.2s ease",
						"&:hover": {
							boxShadow: `0 10px 24px ${alpha(theme.palette.primary.main, 0.14)}`,
							transform: "translateY(-2px)",
						},
					}),
					containedPrimary: ({ theme }) => ({
						background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
						"&:hover": {
							background: theme.palette.primary.dark,
						},
					}),
					outlined: ({ theme }) => ({
						borderColor: alpha(theme.palette.primary.main, 0.2),
						color: theme.palette.primary.main,
						"&:hover": {
							borderColor: theme.palette.primary.main,
							backgroundColor: alpha(theme.palette.primary.main, 0.05),
						},
					}),
					text: ({ theme }) => ({
						borderBottom: "1px solid transparent",
						"&:hover": {
							borderBottom: `1px solid ${theme.palette.primary.main}`,
							backgroundColor: "transparent",
						},
					}),
				},
			},
			MuiPaper: {
				styleOverrides: {
					root: ({ theme }) => ({
						backgroundImage: "none",
						backgroundColor: theme.palette.background.paper,
						boxShadow: `0 10px 30px ${alpha(theme.palette.text.primary, 0.06)}`,
						border: `1px solid ${theme.palette.divider}`,
					}),
					elevation1: {
						boxShadow: "none",
					},
				},
			},
			MuiAppBar: {
				styleOverrides: {
					root: ({ theme }) => ({
						backgroundColor: alpha(theme.palette.background.default, 0.85),
						backdropFilter: "blur(16px) saturate(140%)",
						backgroundImage: "none",
						color: theme.palette.text.primary,
						borderBottom: `1px solid ${theme.palette.divider}`,
						boxShadow: "none",
					}),
				},
			},
			MuiCard: {
				styleOverrides: {
					root: ({ theme: _theme }) => ({
						borderRadius: 16,
						border: `1px solid ${_theme.palette.divider}`,
						backgroundColor: _theme.palette.background.paper,
						boxShadow: `0 12px 40px ${alpha(_theme.palette.text.primary, 0.05)}`,
						transition:
							"border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease",
						"&:hover": {
							borderColor: alpha(_theme.palette.secondary.main, 0.55),
							backgroundColor: alpha(_theme.palette.secondary.main, 0.04),
							boxShadow: `0 18px 48px ${alpha(_theme.palette.text.primary, 0.1)}`,
						},
					}),
				},
			},
			MuiChip: {
				styleOverrides: {
					root: ({ theme: _theme }) => ({
						borderRadius: 999,
						fontFamily: '"Work Sans Variable", sans-serif',
						fontSize: "0.75rem",
						fontWeight: 700,
						textTransform: "uppercase",
						letterSpacing: "0.1em",
					}),
				},
			},
			MuiInputBase: {
				styleOverrides: {
					root: ({ theme: _theme }) => ({
						fontFamily: '"Noto Serif", serif',
						"&:after": {
							borderBottomColor: _theme.palette.primary.main,
						},
					}),
				},
			},
			MuiOutlinedInput: {
				styleOverrides: {
					root: ({ theme }) => ({
						borderRadius: 10,
						backgroundColor: alpha(theme.palette.background.paper, 0.65),
						"&:hover .MuiOutlinedInput-notchedOutline": {
							borderColor: alpha(theme.palette.secondary.main, 0.7),
						},
						"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderWidth: 2,
							borderColor: theme.palette.secondary.main,
						},
					}),
				},
			},
		},
	};
};

export const getTheme = (mode) => createTheme(getDesignTokens(mode));
