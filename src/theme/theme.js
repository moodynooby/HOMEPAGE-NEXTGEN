import { alpha, createTheme } from "@mui/material/styles";

const getDesignTokens = (mode) => {
	const isLight = mode === "light";

	return {
		palette: {
			mode,
			primary: {
				main: isLight ? "#5f5e5e" : "#fdffda",
				dark: isLight ? "#38392e" : "#f1f3c3",
				contrastText: isLight ? "#fdffda" : "#38392e",
			},
			secondary: {
				main: isLight ? "#7d5d53" : "#a6827a",
			},
			background: {
				default: isLight ? "#fdffda" : "#282a21",
				paper: isLight ? "#fdffda" : "#282a21",
			},
			text: {
				primary: isLight ? "#38392e" : "#fdffda",
				secondary: isLight ? "#7d5d53" : "#a6827a",
			},
			divider: isLight ? "rgba(56, 57, 46, 0.1)" : "rgba(253, 255, 218, 0.15)",
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
			borderRadius: 0,
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
						backgroundImage: 'url("/noise.webp")',
						backgroundBlendMode: "soft-light",
						backgroundSize: "150px 150px",
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
					root: () => ({
						borderRadius: 0,
						padding: "8px 20px",
						boxShadow: "none",
						"&:hover": {
							boxShadow: "none",
							transform: "translateY(-1px)",
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
						boxShadow: "none",
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
						backdropFilter: "blur(12px)",
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
						borderRadius: 0,
						border: `1px solid ${_theme.palette.divider}`,
						backgroundColor: _theme.palette.background.paper,
						transition:
							"border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease",
						"&:hover": {
							borderColor: alpha(_theme.palette.primary.main, 0.3),
							backgroundColor: alpha(_theme.palette.divider, 0.05),
						},
					}),
				},
			},
			MuiChip: {
				styleOverrides: {
					root: ({ theme: _theme }) => ({
						borderRadius: 0,
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
		},
	};
};

export const getTheme = (mode) => createTheme(getDesignTokens(mode));
