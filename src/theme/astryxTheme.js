import { defineTheme } from "@astryxdesign/core/theme";
import { neutralTheme } from "@astryxdesign/theme-neutral/built";
import "@astryxdesign/theme-neutral/theme.css";
import "@astryxdesign/theme-neutral/fonts.css";

import { DARK_PALETTE, LIGHT_PALETTE } from "./palette";
import { PALETTE_TOKEN_MAP } from "./paletteTokens";

const paletteTokens = Object.fromEntries(
	Object.entries(PALETTE_TOKEN_MAP).map(([key, token]) => [
		token,
		[LIGHT_PALETTE[key], DARK_PALETTE[key]],
	]),
);

const darkPaletteTokens = Object.fromEntries(
	Object.entries(PALETTE_TOKEN_MAP).map(([key, token]) => [
		token,
		DARK_PALETTE[key],
	]),
);

export const editorialTheme = defineTheme({
	name: "editorial-monograph",
	extends: neutralTheme,
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
		...paletteTokens,
	},
	onDark: { tokens: darkPaletteTokens },
});
