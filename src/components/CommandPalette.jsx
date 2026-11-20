import {
	KBarAnimator,
	KBarPortal,
	KBarPositioner,
	KBarProvider,
	KBarResults,
	KBarSearch,
	useMatches,
} from "kbar";
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
	X,
} from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socialLinks from "@/content/socialLinks.json";
import { useThemeContext } from "@/contexts/ThemeContext";
import { NAV_ITEMS } from "@/nav";
import { socialIcons } from "@/utils/socialIcons";

const socialByAlt = Object.fromEntries(
	socialLinks.map((entry) => [entry.alt, entry]),
);
const socialEmail = socialByAlt.Email?.link.replace(/^mailto:/, "");
const socialGithub = socialByAlt.GitHub?.link;
const socialLinkedIn = socialByAlt.LinkedIn?.link;
const socialAddons = socialByAlt["Addons Profile"]?.link;

export default function CommandPalette({ children }) {
	const navigate = useNavigate();
	const location = useLocation();
	const { setMode } = useThemeContext();
	const [shortcutsOpen, setShortcutsOpen] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (
				e.key === "?" &&
				!["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
			) {
				e.preventDefault();
				setShortcutsOpen(true);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const handleJumpToSection = (sectionId) => {
		if (location.pathname !== "/") {
			navigate("/");
			setTimeout(() => {
				document
					.getElementById(sectionId)
					?.scrollIntoView({ behavior: "smooth" });
			}, 100);
		} else {
			document
				.getElementById(sectionId)
				?.scrollIntoView({ behavior: "smooth" });
		}
	};

	const copyToClipboard = (text) => {
		navigator.clipboard?.writeText(text);
	};

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

	const GitHubIcon = socialIcons.GitHub;
	const LinkedInIcon = socialIcons.LinkedIn;

	const actions = [
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

	return (
		<KBarProvider actions={actions}>
			<KBarPortal>
				<KBarPositioner className="kbar-backdrop">
					<KBarAnimator className="kbar-animator">
						<div className="kbar-search-box">
							<KBarSearch
								className="kbar-search-input"
								placeholder="Type a command…"
							/>
						</div>
						<RenderResults />
					</KBarAnimator>
				</KBarPositioner>
			</KBarPortal>
			{children}

			{shortcutsOpen && (
				<div
					role="dialog"
					aria-modal="true"
					aria-labelledby="shortcuts-modal-title"
					tabIndex={-1}
					onKeyDown={(e) => {
						if (e.key === "Escape") setShortcutsOpen(false);
					}}
					className="modal-backdrop"
					onClick={(e) => {
						if (e.target === e.currentTarget) setShortcutsOpen(false);
					}}
				>
					<div className="shortcuts-dialog">
						<div className="flex justify-between items-center mb-6">
							<h3 id="shortcuts-modal-title">Keyboard Shortcuts</h3>
							<button
								type="button"
								onClick={() => setShortcutsOpen(false)}
								aria-label="Close shortcuts modal"
								className="btn-ghost p-1 flex items-center"
							>
								<X size={18} strokeWidth={1.5} />
							</button>
						</div>
						<div
							id="shortcuts-modal-description"
							className="flex flex-col gap-4"
						>
							{[
								{ key: "Cmd/Ctrl + K", desc: "Open Command Palette" },
								{ key: "H", desc: "Go to Home" },
								{ key: "P", desc: "Go to Projects" },
								{ key: "L", desc: "Go to Profile / Links" },
								{ key: "G", desc: "Go to Media Gallery" },
								{ key: "T L", desc: "Theme: Light" },
								{ key: "T D", desc: "Theme: Dark" },
								{ key: "T S", desc: "Theme: System" },
								{ key: "?", desc: "Toggle this cheatsheet" },
							].map((sc) => (
								<div key={sc.desc} className="shortcuts-row">
									<span className="font-body text-primary">{sc.desc}</span>
									<div className="flex gap-1">
										{sc.key.split(" ").map((k) => (
											<span key={`${sc.desc}-${k}`} className="kbd-badge">
												{k}
											</span>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</KBarProvider>
	);
}

function RenderResults() {
	const { results } = useMatches();

	return (
		<KBarResults
			items={results}
			onRender={({ item, active }) =>
				typeof item === "string" ? (
					<div className="kbar-section-header">{item}</div>
				) : (
					<div className={`kbar-result-item ${active ? "active" : ""}`}>
						<div className="flex items-center gap-4">
							{item.icon && <span className="kbar-icon">{item.icon}</span>}
							<span className="font-body text-primary">{item.name}</span>
						</div>
						{item.shortcut?.length > 0 && (
							<div className="flex gap-1">
								{item.shortcut.map((sc) => (
									<span key={sc} className="kbd-sm">
										{sc}
									</span>
								))}
							</div>
						)}
					</div>
				)
			}
		/>
	);
}

CommandPalette.propTypes = {
	children: PropTypes.node,
};
