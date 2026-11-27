import { Filter, Keyboard, Link, Mail } from "lucide-react";
import { JUMP_SECTIONS } from "@/config/sections";
import { HELP_SHORTCUT } from "@/config/shortcuts";
import { emailLink, socialCommands } from "@/content/socialLinks";
import { NAV_ITEMS } from "@/routes";
import {
	THEME_MODE_ICONS,
	THEME_MODE_LABELS,
	THEME_MODE_SHORTCUTS,
	THEME_MODES,
} from "@/theme/themeConfig";

const icon = (Icon, size = 16) =>
	Icon ? <Icon size={size} strokeWidth={1.5} /> : null;

function buildSearchPresets(projects = []) {
	const counts = new Map();
	for (const project of projects) {
		for (const term of [project.language, project.category]) {
			const clean = term?.trim();
			if (!clean) continue;
			counts.set(clean, (counts.get(clean) || 0) + 1);
		}
	}
	return Array.from(counts.entries())
		.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
		.slice(0, 6)
		.map(([term]) => ({
			id: term.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
			name: term,
			keywords: term.toLowerCase(),
			query: term,
		}));
}

export function buildCommandActions({
	navigate,
	setMode,
	setShortcutsOpen,
	handleJumpToSection,
	copyToClipboard,
	projects = [],
}) {
	const navActions = NAV_ITEMS.map((item) => ({
		id: `nav-${item.path}`,
		name: item.label,
		description: `Go to ${item.label}`,
		shortcut: item.shortcut ? [item.shortcut] : [],
		keywords: item.keywords,
		perform: () => navigate(item.path),
		icon: icon(item.icon),
	}));

	const themeActions = THEME_MODES.map((mode) => ({
		id: `theme-${mode}`,
		name: `Theme: ${THEME_MODE_LABELS[mode]}`,
		shortcut: THEME_MODE_SHORTCUTS[mode],
		keywords: `theme-${mode}-mode`,
		perform: () => setMode(mode),
		icon: icon(THEME_MODE_ICONS[mode]),
	}));

	const searchActions = buildSearchPresets(projects).map((preset) => ({
		id: `filter-${preset.id}`,
		name: `Filter Projects: ${preset.name}`,
		keywords: preset.keywords,
		perform: () => navigate(`/projects?q=${encodeURIComponent(preset.query)}`),
		icon: icon(Filter),
	}));

	const jumpActions = JUMP_SECTIONS.map((section) => ({
		id: `jump-${section.id}`,
		name: section.name,
		keywords: section.keywords,
		perform: () => handleJumpToSection(section.id),
		icon: icon(section.Icon),
	}));

	const socialActions = socialCommands.map((entry) => ({
		id: entry.key,
		name: entry.name,
		shortcut: entry.shortcut,
		keywords: entry.keywords,
		perform: () => window.open(entry.link, "_blank", "noopener"),
		icon: icon(entry.Icon),
	}));

	return [
		...navActions,
		...themeActions,
		{
			id: "shortcuts",
			name: "Keyboard Shortcuts",
			description: "Toggle this cheatsheet",
			shortcut: [HELP_SHORTCUT],
			keywords: "shortcuts cheatsheet help",
			perform: () => setShortcutsOpen(true),
			icon: icon(Keyboard),
		},
		...searchActions,
		{
			id: "copy-link",
			name: "Copy Portfolio Link",
			keywords: "copy link url share",
			perform: () => copyToClipboard(window.location.origin),
			icon: icon(Link),
		},
		{
			id: "copy-email",
			name: "Copy Email",
			keywords: "copy email contact",
			perform: () => copyToClipboard(emailLink),
			icon: icon(Mail),
		},
		...jumpActions,
		...socialActions,
	];
}
