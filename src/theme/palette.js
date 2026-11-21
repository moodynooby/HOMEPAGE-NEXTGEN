/**
 * Editorial Monograph Design System Palette
 * Single source of truth for runtime and token colors.
 * Non-negotiable: 0px radius, #38392e ink, #fdffda body surface, no pure black.
 */

export const LIGHT_PALETTE = {
	textPrimary: "#38392e",
	textSecondary: "#7d5d53",
	accent: "#7d5d53",
	backgroundBody: "#fdffda",
	backgroundSurface: "#fdffda",
	border: "rgba(56, 57, 46, 0.10)",
	overlayHover: "rgba(56, 57, 46, 0.05)",
	overlayPressed: "rgba(56, 57, 46, 0.10)",
	statusActive: "#4caf50",
	statusMaintenance: "#ff9800",
	chartAdopt: "#93c47d",
	chartTrial: "#93d2c6",
	chartAssess: "#fbcd73",
	chartHold: "#e06666",
};

export const DARK_PALETTE = {
	textPrimary: "#fdffda",
	textSecondary: "#a6827a",
	accent: "#a6827a",
	backgroundBody: "#282a21",
	backgroundSurface: "#282a21",
	border: "rgba(253, 255, 218, 0.15)",
	overlayHover: "rgba(253, 255, 218, 0.06)",
	overlayPressed: "rgba(253, 255, 218, 0.10)",
	statusActive: "#4caf50",
	statusMaintenance: "#ff9800",
	chartAdopt: "#93c47d",
	chartTrial: "#93d2c6",
	chartAssess: "#fbcd73",
	chartHold: "#e06666",
};

export const META_THEME_COLORS = {
	light: LIGHT_PALETTE.backgroundBody,
	dark: DARK_PALETTE.backgroundBody,
};
