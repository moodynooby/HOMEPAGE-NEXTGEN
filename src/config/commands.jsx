import {
	Filter,
	FolderGit2,
	Globe,
	Image,
	Info,
	Keyboard,
	Link,
	Mail,
	Monitor,
	Moon,
	Sun,
} from "lucide-react";
import socialLinks from "@/content/socialLinks.json";
import { NAV_ITEMS } from "@/nav";
import { socialIcons } from "@/utils/socialIcons";

const socialByAlt = Object.fromEntries(
	socialLinks.map((entry) => [entry.alt, entry]),
);
const socialEmail = socialByAlt.Email?.link.replace(/^mailto:/, "");
const socialGithub = socialByAlt.GitHub?.link;
const socialLinkedIn = socialByAlt.LinkedIn?.link;
const socialAddons = socialByAlt["Addons Profile"]?.link;

const GitHubIcon = socialIcons.GitHub;
const LinkedInIcon = socialIcons.LinkedIn;

export function buildCommandActions({
	navigate,
	setMode,
	setShortcutsOpen,
	handleJumpToSection,
	copyToClipboard,
}) {
	const navActions = NAV_ITEMS.map((item) => {
		const Icon = item.icon;
		return {
			id: `nav-${item.to}`,
			name: item.label,
			shortcut: item.shortcut ? [item.shortcut] : [],
			keywords: item.keywords,
			perform: () => navigate(item.to),
			icon: <Icon size={16} strokeWidth={1.5} />,
		};
	});

	return [
		...navActions,
		{
			id: "theme-light",
			name: "Theme: Light",
			shortcut: ["t", "l"],
			keywords: "theme-light-mode",
			perform: () => setMode("light"),
			icon: <Sun size={16} strokeWidth={1.5} />,
		},
		{
			id: "theme-dark",
			name: "Theme: Dark",
			shortcut: ["t", "d"],
			keywords: "theme-dark-mode",
			perform: () => setMode("dark"),
			icon: <Moon size={16} strokeWidth={1.5} />,
		},
		{
			id: "theme-system",
			name: "Theme: System",
			shortcut: ["t", "s"],
			keywords: "theme-system-auto",
			perform: () => setMode("system"),
			icon: <Monitor size={16} strokeWidth={1.5} />,
		},
		{
			id: "shortcuts",
			name: "Keyboard Shortcuts",
			shortcut: ["?"],
			keywords: "shortcuts cheatsheet help",
			perform: () => setShortcutsOpen(true),
			icon: <Keyboard size={16} strokeWidth={1.5} />,
		},
		{
			id: "filter-react",
			name: "Filter Projects: React",
			keywords: "react",
			perform: () => navigate("/projects?q=React"),
			icon: <Filter size={16} strokeWidth={1.5} />,
		},
		{
			id: "filter-python",
			name: "Filter Projects: Python",
			keywords: "python",
			perform: () => navigate("/projects?q=Python"),
			icon: <Filter size={16} strokeWidth={1.5} />,
		},
		{
			id: "filter-ml",
			name: "Filter Projects: Machine Learning",
			keywords: "machine learning ml",
			perform: () => navigate("/projects?q=Machine Learning"),
			icon: <Filter size={16} strokeWidth={1.5} />,
		},
		{
			id: "filter-web3",
			name: "Filter Projects: Web3",
			keywords: "web3 crypto blockchain",
			perform: () => navigate("/projects?q=Web3"),
			icon: <Filter size={16} strokeWidth={1.5} />,
		},
		{
			id: "filter-rust",
			name: "Filter Projects: Rust",
			keywords: "rust",
			perform: () => navigate("/projects?q=Rust"),
			icon: <Filter size={16} strokeWidth={1.5} />,
		},
		{
			id: "copy-link",
			name: "Copy Portfolio Link",
			keywords: "copy link url share",
			perform: () => copyToClipboard(window.location.origin),
			icon: <Link size={16} strokeWidth={1.5} />,
		},
		{
			id: "copy-email",
			name: "Copy Email",
			keywords: "copy email contact",
			perform: () => copyToClipboard(socialEmail),
			icon: <Mail size={16} strokeWidth={1.5} />,
		},
		{
			id: "jump-projects",
			name: "Jump to Section: Projects",
			keywords: "jump navigate section projects featured",
			perform: () => handleJumpToSection("projects-section"),
			icon: <FolderGit2 size={16} strokeWidth={1.5} />,
		},
		{
			id: "jump-experience",
			name: "Jump to Section: Experience",
			keywords: "jump navigate section experience visual archive",
			perform: () => handleJumpToSection("experience-section"),
			icon: <Image size={16} strokeWidth={1.5} />,
		},
		{
			id: "jump-about",
			name: "Jump to Section: About",
			keywords: "jump navigate section about intro",
			perform: () => handleJumpToSection("about-section"),
			icon: <Info size={16} strokeWidth={1.5} />,
		},
		{
			id: "github",
			name: "GitHub Profile",
			shortcut: ["g"],
			keywords: "external-github",
			perform: () => window.open(socialGithub, "_blank", "noopener"),
			icon: GitHubIcon ? <GitHubIcon size={16} /> : null,
		},
		{
			id: "linkedin",
			name: "LinkedIn Profile",
			shortcut: ["i"],
			keywords: "external-linkedin",
			perform: () => window.open(socialLinkedIn, "_blank", "noopener"),
			icon: LinkedInIcon ? <LinkedInIcon size={16} /> : null,
		},
		{
			id: "addons",
			name: "Mozilla Add-ons Profile",
			shortcut: ["a"],
			keywords: "external-mozilla-addons",
			perform: () => window.open(socialAddons, "_blank", "noopener"),
			icon: <Globe size={16} strokeWidth={1.5} />,
		},
	];
}
