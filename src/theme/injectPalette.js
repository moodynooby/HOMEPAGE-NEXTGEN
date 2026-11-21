/**
 * Bridge between `palette.js` and CSS. Astryx scopes its injected tokens to its
 * wrapper element, but document-level rules (`body`, `:root`, high contrast)
 * live above that wrapper. This publishes the same palette once on `:root` so
 * there is exactly one place where palette values are authored.
 */
import { DARK_PALETTE, LIGHT_PALETTE } from "./palette";

export const PALETTE_TOKEN_MAP = {
	textPrimary: "--color-text-primary",
	textSecondary: "--color-text-secondary",
	accent: "--color-accent",
	backgroundBody: "--color-background-body",
	backgroundSurface: "--color-background-surface",
	border: "--color-border",
	overlayHover: "--color-overlay-hover",
	overlayPressed: "--color-overlay-pressed",
	statusActive: "--color-status-active",
	statusMaintenance: "--color-status-maintenance",
	chartAdopt: "--color-chart-adopt",
	chartTrial: "--color-chart-trial",
	chartAssess: "--color-chart-assess",
	chartHold: "--color-chart-hold",
};

export const paletteCss = () =>
	`:root {\n${Object.entries(PALETTE_TOKEN_MAP)
		.map(
			([key, token]) =>
				`\t${token}: light-dark(${LIGHT_PALETTE[key]}, ${DARK_PALETTE[key]});`,
		)
		.join("\n")}\n}`;

export function injectPaletteStyles() {
	if (typeof document === "undefined") return;
	if (document.getElementById("editorial-palette")) return;

	const style = document.createElement("style");
	style.id = "editorial-palette";
	style.textContent = paletteCss();
	document.head.appendChild(style);
}
