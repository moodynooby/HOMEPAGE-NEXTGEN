import { defineTheme } from "@astryxdesign/core/theme";
import { defaultThemeSlug, themes } from "@/astryx-themes";
import { DARK_PALETTE, LIGHT_PALETTE } from "./palette";

export const editorialTheme = defineTheme({
	name: "editorial-monograph",
	extends: themes[defaultThemeSlug],
	tokens: {
		"--radius-none": "0px",
		"--radius-inner": "0px",
		"--radius-element": "0px",
		"--radius-container": "0px",
		"--radius-page": "0px",
		"--radius-full": "0px",
		"--font-family-heading": "Newsreader, Georgia, serif",
		"--font-family-body": "Noto Serif, Georgia, serif",
		"--font-family-code": "Work Sans, monospace",
		"--color-text-primary": [
			LIGHT_PALETTE.textPrimary,
			DARK_PALETTE.textPrimary,
		],
		"--color-text-secondary": [
			LIGHT_PALETTE.textSecondary,
			DARK_PALETTE.textSecondary,
		],
		"--color-accent": [LIGHT_PALETTE.accent, DARK_PALETTE.accent],
		"--color-background-body": [
			LIGHT_PALETTE.backgroundBody,
			DARK_PALETTE.backgroundBody,
		],
		"--color-background-surface": [
			LIGHT_PALETTE.backgroundSurface,
			DARK_PALETTE.backgroundSurface,
		],
		"--color-border": [LIGHT_PALETTE.border, DARK_PALETTE.border],
		"--color-overlay-hover": [
			LIGHT_PALETTE.overlayHover,
			DARK_PALETTE.overlayHover,
		],
		"--color-overlay-pressed": [
			LIGHT_PALETTE.overlayPressed,
			DARK_PALETTE.overlayPressed,
		],
	},
	onDark: {
		tokens: {
			"--color-text-primary": DARK_PALETTE.textPrimary,
			"--color-text-secondary": DARK_PALETTE.textSecondary,
			"--color-accent": DARK_PALETTE.accent,
			"--color-background-body": DARK_PALETTE.backgroundBody,
			"--color-background-surface": DARK_PALETTE.backgroundSurface,
			"--color-border": DARK_PALETTE.border,
			"--color-overlay-hover": DARK_PALETTE.overlayHover,
			"--color-overlay-pressed": DARK_PALETTE.overlayPressed,
		},
	},
});
