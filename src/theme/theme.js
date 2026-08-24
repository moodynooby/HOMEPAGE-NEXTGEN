import { alpha, createTheme } from "@mui/material/styles";

const INK = "#38392e";
const PARCHMENT = "#fdffda";
const SEPIA = "#7d5d53";
const SEPIA_LIGHT = "#a6827a";

const getDesignTokens = (mode) => {
	const isLight = mode === "light";

	return {
		palette: {
			mode,
			primary: {
				main: isLight ? "#5f5e5e" : PARCHMENT,
				dark: isLight ? INK : "#f1f3c3",
				contrastText: isLight ? PARCHMENT : INK,
			},
			secondary: {
				main: isLight ? SEPIA : SEPIA_LIGHT,
				light: isLight ? "#9a7c6e" : "#c2a196",
				dark: isLight ? "#63473d" : "#8a6a61",
			},
			background: {
				default: isLight ? PARCHMENT : "#282a21",
				paper: isLight ? PARCHMENT : "#282a21",
			},
			text: {
				primary: isLight ? INK : PARCHMENT,
				secondary: isLight ? SEPIA : SEPIA_LIGHT,
			},
			divider: isLight ? "rgba(56, 57, 46, 0.10)" : "rgba(253, 255, 218, 0.15)",
			action: {
				hover: isLight
					? "rgba(56, 57, 46, 0.045)"
					: "rgba(253, 255, 218, 0.06)",
				selected: isLight
					? "rgba(56, 57, 46, 0.08)"
					: "rgba(253, 255, 218, 0.10)",
			},
		},
		typography: {
			fontFamily: '"Noto Serif", serif',
			h1: {
				fontFamily: '"Newsreader", serif',
				fontWeight: 800,
				letterSpacing: "-0.02em",
				lineHeight: 1.05,
			},
			h2: {
				fontFamily: '"Newsreader", serif',
				fontWeight: 700,
				letterSpacing: "-0.02em",
				lineHeight: 1.1,
			},
			h3: {
				fontFamily: '"Newsreader", serif',
				fontWeight: 700,
				lineHeight: 1.15,
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
				lineHeight: 1.7,
			},
			body2: {
				fontFamily: '"Noto Serif", serif',
				lineHeight: 1.65,
			},
			button: {
				fontFamily: '"Work Sans Variable", "Work Sans", sans-serif',
				fontWeight: 600,
				textTransform: "uppercase",
				letterSpacing: "0.12em",
				fontSize: "0.78rem",
			},
			caption: {
				fontFamily: '"Work Sans Variable", "Work Sans", sans-serif',
				letterSpacing: "0.06em",
			},
			overline: {
				fontFamily: '"Work Sans Variable", "Work Sans", sans-serif',
				fontSize: "0.72rem",
				fontWeight: 600,
				letterSpacing: "0.14em",
				lineHeight: 1.4,
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
						backgroundImage: `linear-gradient(180deg, ${alpha(
							theme.palette.text.primary,
							0.03,
						)}, transparent 360px), url("/noise.webp")`,
						backgroundBlendMode: "normal, soft-light",
						backgroundSize: "100% 100%, 150px 150px",
					},
					"::selection": {
						backgroundColor: alpha(theme.palette.secondary.main, 0.28),
					},
					"::-webkit-scrollbar": {
						width: "8px",
					},
					"::-webkit-scrollbar-track": {
						background: theme.palette.background.default,
					},
					"::-webkit-scrollbar-thumb": {
						background: alpha(theme.palette.text.primary, 0.35),
						border: `2px solid ${theme.palette.background.default}`,
					},
					"::-webkit-scrollbar-thumb:hover": {
						background: alpha(theme.palette.text.primary, 0.6),
					},
					"[kbar-portal]": {
						"--kbar-bg-color": `${theme.palette.background.paper} !important`,
						"--kbar-primary-color": `${theme.palette.text.primary} !important`,
					},
				}),
			},
			MuiButton: {
				styleOverrides: {
					root: {
						borderRadius: 0,
						boxShadow: "none",
						padding: "10px 22px",
						transition:
							"background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease",
						"&:hover": {
							boxShadow: "none",
						},
					},
					containedPrimary: ({ theme }) => ({
						backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
						color: theme.palette.primary.contrastText,
						"&:hover": {
							backgroundImage: "none",
							backgroundColor: theme.palette.primary.dark,
						},
					}),
					outlined: ({ theme }) => ({
						borderColor: alpha(theme.palette.primary.main, 0.2),
						color: theme.palette.primary.main,
						"&:hover": {
							borderColor: alpha(theme.palette.primary.main, 0.55),
							backgroundColor: "transparent",
						},
					}),
					text: ({ theme }) => ({
						position: "relative",
						paddingLeft: 0,
						paddingRight: 0,
						"&::after": {
							content: '""',
							position: "absolute",
							left: 0,
							bottom: 4,
							width: "100%",
							height: "1px",
							backgroundColor: alpha(theme.palette.text.primary, 0.35),
							transform: "scaleX(0.35)",
							transformOrigin: "left center",
							transition: "transform 0.3s ease, background-color 0.3s ease",
						},
						"&:hover": {
							backgroundColor: "transparent",
							"&::after": {
								transform: "scaleX(1)",
								backgroundColor: theme.palette.text.primary,
							},
						},
					}),
				},
			},
			MuiPaper: {
				styleOverrides: {
					root: ({ theme }) => ({
						backgroundImage: "none",
						backgroundColor: theme.palette.background.paper,
						borderRadius: 0,
						border: `1px solid ${theme.palette.divider}`,
					}),
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
			MuiChip: {
				styleOverrides: {
					root: ({ theme }) => ({
						borderRadius: 0,
						fontFamily: '"Work Sans Variable", "Work Sans", sans-serif',
						fontSize: "0.7rem",
						fontWeight: 600,
						textTransform: "uppercase",
						letterSpacing: "0.1em",
						height: 26,
						"&.MuiChip-outlined": {
							borderColor: theme.palette.divider,
						},
					}),
				},
			},
			MuiInputLabel: {
				styleOverrides: {
					root: ({ theme }) => ({
						"&.Mui-focused": {
							color: theme.palette.secondary.main,
						},
					}),
				},
			},
			MuiInput: {
				styleOverrides: {
					underline: ({ theme }) => ({
						"&:before": {
							borderBottomColor: theme.palette.divider,
							borderBottomWidth: "1px",
						},
						"&:hover:not(.Mui-disabled):before": {
							borderBottomColor: alpha(theme.palette.text.primary, 0.35),
						},
						"&:after": {
							borderBottomColor: theme.palette.primary.main,
							borderBottomWidth: "1px",
						},
					}),
				},
			},
			MuiTooltip: {
				styleOverrides: {
					tooltip: {
						borderRadius: 0,
					},
				},
			},
			MuiMenu: {
				styleOverrides: {
					paper: ({ theme }) => ({
						borderRadius: 0,
						border: `1px solid ${theme.palette.divider}`,
						boxShadow: "none",
						backgroundImage: "none",
					}),
				},
			},
			MuiLinearProgress: {
				styleOverrides: {
					root: ({ theme }) => ({
						backgroundColor: theme.palette.divider,
						height: "1px",
					}),
					bar: {
						backgroundColor: "currentColor",
					},
				},
			},
		},
	};
};

export const getTheme = (mode) => createTheme(getDesignTokens(mode));
