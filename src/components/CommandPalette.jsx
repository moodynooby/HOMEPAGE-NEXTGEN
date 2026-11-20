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
	Link as LinkIcon,
	Lock,
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
			id: "admin",
			name: "Admin Dashboard",
			keywords: "admin dashboard manage edit projects login",
			perform: () => navigate("/admin"),
			icon: <Lock size={16} strokeWidth={1.5} />,
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
			icon: <LinkIcon size={16} strokeWidth={1.5} />,
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
				<KBarPositioner
					style={{
						zIndex: 9999,
						backdropFilter: "blur(4px)",
						background: "rgba(0, 0, 0, 0.4)",
					}}
				>
					<KBarAnimator
						style={{
							maxWidth: "560px",
							width: "100%",
							background: "var(--color-background-surface, #fdffda)",
							color: "var(--color-text-primary, #38392e)",
							borderRadius: "0px",
							border: "1px solid var(--color-text-primary, #38392e)",
							overflow: "hidden",
							boxShadow: "none",
						}}
					>
						<div
							style={{
								padding: "1rem",
								borderBottom:
									"1px solid var(--color-border, rgba(56, 57, 46, 0.10))",
							}}
						>
							<KBarSearch
								style={{
									padding: "10px 12px",
									fontSize: "15px",
									width: "100%",
									boxSizing: "border-box",
									outline: "none",
									border: "none",
									background: "transparent",
									color: "var(--color-text-primary, #38392e)",
									fontFamily:
										"var(--font-family-code, 'Work Sans', sans-serif)",
									letterSpacing: "0.02em",
								}}
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
					style={{
						position: "fixed",
						inset: 0,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 10000,
						backdropFilter: "blur(4px)",
						background: "rgba(0, 0, 0, 0.4)",
					}}
					onClick={(e) => {
						if (e.target === e.currentTarget) setShortcutsOpen(false);
					}}
				>
					<div
						style={{
							background: "var(--color-background-surface, #fdffda)",
							border: "1px solid var(--color-text-primary, #38392e)",
							padding: "2rem",
							maxWidth: "500px",
							width: "90%",
							borderRadius: 0,
							outline: "none",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "1.5rem",
							}}
						>
							<h2
								id="shortcuts-modal-title"
								style={{
									margin: 0,
									fontFamily:
										"var(--font-family-heading, 'Newsreader', Georgia, serif)",
									fontSize: "1.5rem",
									fontWeight: 700,
									color: "var(--color-text-primary, #38392e)",
								}}
							>
								Keyboard Shortcuts
							</h2>
							<button
								type="button"
								onClick={() => setShortcutsOpen(false)}
								aria-label="Close shortcuts modal"
								style={{
									background: "none",
									border: "none",
									cursor: "pointer",
									color: "var(--color-text-primary)",
									padding: "4px",
									display: "flex",
									alignItems: "center",
								}}
							>
								<X size={18} strokeWidth={1.5} />
							</button>
						</div>
						<div
							id="shortcuts-modal-description"
							style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
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
								<div
									key={sc.desc}
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										borderBottom:
											"1px solid var(--color-border, rgba(56, 57, 46, 0.10))",
										paddingBottom: "0.5rem",
									}}
								>
									<span
										style={{
											fontFamily:
												"var(--font-family-body, 'Noto Serif', serif)",
											fontSize: "0.875rem",
											color: "var(--color-text-primary)",
										}}
									>
										{sc.desc}
									</span>
									<div style={{ display: "flex", gap: "4px" }}>
										{sc.key.split(" ").map((k) => (
											<span
												key={`${sc.desc}-${k}`}
												style={{
													padding: "2px 6px",
													background:
														"var(--color-overlay-pressed, rgba(56, 57, 46, 0.08))",
													fontSize: "0.75rem",
													fontWeight: 600,
													textTransform: "uppercase",
													border: "1px solid var(--color-border)",
													fontFamily:
														"var(--font-family-code, 'Work Sans', sans-serif)",
												}}
											>
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
					<div
						style={{
							padding: "1rem 1.5rem 0.5rem",
							fontFamily: "var(--font-family-code, 'Work Sans', sans-serif)",
							fontSize: "0.7rem",
							letterSpacing: "0.15em",
							textTransform: "uppercase",
							color: "var(--color-text-secondary, #7d5d53)",
						}}
					>
						{item}
					</div>
				) : (
					<div
						style={{
							padding: "0.75rem 1.5rem",
							background: active
								? "var(--color-overlay-hover, rgba(56, 57, 46, 0.06))"
								: "transparent",
							borderLeft: `2px solid ${active ? "var(--color-accent, #7d5d53)" : "transparent"}`,
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							cursor: "pointer",
							transition: "background 0.15s ease",
						}}
					>
						<div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
							{item.icon && (
								<span style={{ display: "flex", opacity: 0.7 }}>
									{item.icon}
								</span>
							)}
							<span
								style={{
									fontFamily:
										"var(--font-family-body, 'Noto Serif', Georgia, serif)",
									fontSize: "0.875rem",
									color: "var(--color-text-primary, #38392e)",
								}}
							>
								{item.name}
							</span>
						</div>
						{item.shortcut?.length > 0 && (
							<div style={{ display: "flex", gap: "4px" }}>
								{item.shortcut.map((sc) => (
									<span
										key={sc}
										style={{
											padding: "2px 6px",
											background:
												"var(--color-overlay-pressed, rgba(56, 57, 46, 0.08))",
											fontSize: "0.65rem",
											fontWeight: 600,
											fontFamily:
												"var(--font-family-code, 'Work Sans', sans-serif)",
											textTransform: "uppercase",
											letterSpacing: "0.08em",
											border: "1px solid var(--color-border)",
										}}
									>
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
