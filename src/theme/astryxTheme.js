import { defineTheme } from "@astryxdesign/core/theme";
import { defaultThemeSlug, themes } from "@/astryx-themes";

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
		"--color-text-primary": ["#38392e", "#fdffda"],
		"--color-text-secondary": ["#7d5d53", "#a6827a"],
		"--color-accent": ["#7d5d53", "#a6827a"],
		"--color-background-body": ["#fdffda", "#282a21"],
		"--color-background-surface": ["#fdffda", "#282a21"],
		"--color-border": ["rgba(56, 57, 46, 0.10)", "rgba(253, 255, 218, 0.15)"],
		"--color-overlay-hover": [
			"rgba(56, 57, 46, 0.05)",
			"rgba(253, 255, 218, 0.06)",
		],
		"--color-overlay-pressed": [
			"rgba(56, 57, 46, 0.10)",
			"rgba(253, 255, 218, 0.10)",
		],
	},
	onDark: {
		tokens: {
			"--color-text-primary": "#fdffda",
			"--color-text-secondary": "#a6827a",
			"--color-accent": "#a6827a",
			"--color-background-body": "#282a21",
			"--color-background-surface": "#282a21",
			"--color-border": "rgba(253, 255, 218, 0.15)",
			"--color-overlay-hover": "rgba(253, 255, 218, 0.06)",
			"--color-overlay-pressed": "rgba(253, 255, 218, 0.10)",
		},
	},
});
