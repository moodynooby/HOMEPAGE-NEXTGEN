import { Monitor, Moon, Sun } from "lucide-react";

export const THEME_MODES = ["light", "system", "dark"];
export const DEFAULT_THEME_MODE = "system";
export const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export const THEME_MODE_LABELS = {
	light: "Light",
	system: "System",
	dark: "Dark",
};

export const THEME_MODE_SHORTCUTS = {
	light: ["t", "l"],
	system: ["t", "s"],
	dark: ["t", "d"],
};

export const THEME_MODE_ICONS = {
	light: Sun,
	system: Monitor,
	dark: Moon,
};
