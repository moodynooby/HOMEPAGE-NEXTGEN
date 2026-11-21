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

const SEARCH_PRESETS = [
	{ id: "react", name: "React", keywords: "react", query: "React" },
	{ id: "python", name: "Python", keywords: "python", query: "Python" },
	{
		id: "ml",
		name: "Machine Learning",
		keywords: "machine learning ml",
		query: "Machine Learning",
	},
	{
		id: "web3",
		name: "Web3",
		keywords: "web3 crypto blockchain",
		query: "Web3",
	},
	{ id: "rust", name: "Rust", keywords: "rust", query: "Rust" },
];

const icon = (Icon, size = 16) =>
	Icon ? <Icon size={size} strokeWidth={1.5} /> : null;

export function buildCommandActions({
	navigate,
	setMode,
	setShortcutsOpen,
	handleJumpToSection,
	copyToClipboard,
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

	const searchActions = SEARCH_PRESETS.map((preset) => ({
		id: `filter-${preset.id}`,
		name: `Filter Projects: ${preset.name}`,
		keywords: preset.keywords,
		perform: () => navigate(`/projects?q=${preset.query}`),
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
