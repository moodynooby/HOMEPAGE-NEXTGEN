import {
	AccountTree,
	Brightness4,
	Brightness7,
	BrightnessAuto,
	Collections,
	Email,
	FilterList,
	GitHub,
	Home,
	Info,
	Keyboard,
	Language,
	LinkedIn,
	Link as LinkIcon,
	Person,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
	Box,
	Fade,
	IconButton,
	Modal,
	Typography,
	useTheme,
} from "@mui/material";
import {
	KBarAnimator,
	KBarPortal,
	KBarPositioner,
	KBarProvider,
	KBarResults,
	KBarSearch,
	useMatches,
} from "kbar";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useThemeContext } from "@/contexts/ThemeContext";

export default function CommandPalette({ children }) {
	const navigate = useNavigate();
	const location = useLocation();
	const { setThemeMode } = useThemeContext();
	const theme = useTheme();
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
				const element = document.getElementById(sectionId);
				if (element) {
					element.scrollIntoView({ behavior: "smooth" });
				}
			}, 100);
		} else {
			const element = document.getElementById(sectionId);
			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
			}
		}
	};

	const copyToClipboard = (text, _message) => {
		navigator.clipboard.writeText(text);
		// Assuming there is some global notification system or simple alert
		// alert(message);
	};

	const actions = [
		{
			id: "home",
			name: "Home",
			shortcut: ["h"],
			keywords: "go-home",
			perform: () => navigate("/"),
			icon: <Home />,
		},
		{
			id: "projects",
			name: "Projects",
			shortcut: ["p"],
			keywords: "go-projects",
			perform: () => navigate("/projects"),
			icon: <AccountTree />,
		},
		{
			id: "profile",
			name: "Profile / Links",
			shortcut: ["l"],
			keywords: "go-links-profile",
			perform: () => navigate("/links"),
			icon: <Person />,
		},
		{
			id: "gallery",
			name: "Media Gallery",
			shortcut: ["g"],
			keywords: "go-gallery-photos-videos",
			perform: () => navigate("/gallery"),
			icon: <Collections />,
		},
		{
			id: "theme-light",
			name: "Theme: Light",
			shortcut: ["t", "l"],
			keywords: "theme-light-mode",
			perform: () => setThemeMode("light"),
			icon: <Brightness7 />,
		},
		{
			id: "theme-dark",
			name: "Theme: Dark",
			shortcut: ["t", "d"],
			keywords: "theme-dark-mode",
			perform: () => setThemeMode("dark"),
			icon: <Brightness4 />,
		},
		{
			id: "theme-system",
			name: "Theme: System",
			shortcut: ["t", "s"],
			keywords: "theme-system-auto",
			perform: () => setThemeMode("system"),
			icon: <BrightnessAuto />,
		},
		{
			id: "shortcuts",
			name: "Keyboard Shortcuts",
			shortcut: ["?"],
			keywords: "shortcuts cheatsheet help",
			perform: () => setShortcutsOpen(true),
			icon: <Keyboard />,
		},
		{
			id: "filter-react",
			name: "Filter Projects: React",
			keywords: "react",
			perform: () => navigate("/projects?q=React"),
			icon: <FilterList />,
		},
		{
			id: "filter-python",
			name: "Filter Projects: Python",
			keywords: "python",
			perform: () => navigate("/projects?q=Python"),
			icon: <FilterList />,
		},
		{
			id: "filter-ml",
			name: "Filter Projects: Machine Learning",
			keywords: "machine learning ml",
			perform: () => navigate("/projects?q=Machine Learning"),
			icon: <FilterList />,
		},
		{
			id: "filter-web3",
			name: "Filter Projects: Web3",
			keywords: "web3 crypto blockchain",
			perform: () => navigate("/projects?q=Web3"),
			icon: <FilterList />,
		},
		{
			id: "filter-rust",
			name: "Filter Projects: Rust",
			keywords: "rust",
			perform: () => navigate("/projects?q=Rust"),
			icon: <FilterList />,
		},
		{
			id: "copy-link",
			name: "Copy Portfolio Link",
			keywords: "copy link url share",
			perform: () =>
				copyToClipboard(window.location.origin, "Portfolio link copied!"),
			icon: <LinkIcon />,
		},
		{
			id: "copy-email",
			name: "Copy Email",
			keywords: "copy email contact",
			perform: () => copyToClipboard("doshimanas27@gmail.com", "Email copied!"),
			icon: <Email />,
		},
		{
			id: "jump-projects",
			name: "Jump to Section: Projects",
			keywords: "jump navigate section projects featured",
			perform: () => handleJumpToSection("projects-section"),
			icon: <AccountTree />,
		},
		{
			id: "jump-experience",
			name: "Jump to Section: Experience",
			keywords: "jump navigate section experience visual archive",
			perform: () => handleJumpToSection("experience-section"),
			icon: <Collections />,
		},
		{
			id: "jump-about",
			name: "Jump to Section: About",
			keywords: "jump navigate section about intro",
			perform: () => handleJumpToSection("about-section"),
			icon: <Info />,
		},
		{
			id: "github",
			name: "GitHub Profile",
			shortcut: ["g"],
			keywords: "external-github",
			perform: () =>
				window.open("https://github.com/moodynooby", "_blank", "noopener"),
			icon: <GitHub />,
		},
		{
			id: "linkedin",
			name: "LinkedIn Profile",
			shortcut: ["i"],
			keywords: "external-linkedin",
			perform: () =>
				window.open(
					"https://www.linkedin.com/in/manas-doshi-644751363",
					"_blank",
					"noopener",
				),
			icon: <LinkedIn />,
		},
		{
			id: "addons",
			name: "Mozilla Add-ons Profile",
			shortcut: ["a"],
			keywords: "external-mozilla-addons",
			perform: () =>
				window.open(
					"https://addons.mozilla.org/en-US/firefox/user/17859963/",
					"_blank",
					"noopener",
				),
			icon: <Language />,
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
							background: theme.palette.background.paper,
							color: theme.palette.text.primary,
							borderRadius: "0px",
							border: `1px solid ${theme.palette.text.primary}`,
							overflow: "hidden",
							boxShadow: "none",
						}}
					>
						<Box
							sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}
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
									color: theme.palette.text.primary,
									fontFamily: '"Work Sans Variable", "Work Sans", sans-serif',
									letterSpacing: "0.02em",
								}}
								placeholder="Type a command…"
							/>
						</Box>
						<RenderResults />
					</KBarAnimator>
				</KBarPositioner>
			</KBarPortal>
			{children}

			<Modal
				open={shortcutsOpen}
				onClose={() => setShortcutsOpen(false)}
				aria-labelledby="shortcuts-modal-title"
				aria-describedby="shortcuts-modal-description"
				closeAfterTransition
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 10000,
					backdropFilter: "blur(4px)",
				}}
			>
				<Fade in={shortcutsOpen}>
					<Box
						sx={{
							bgcolor: "background.paper",
							border: `1px solid ${theme.palette.text.primary}`,
							boxShadow: 24,
							p: 4,
							maxWidth: 500,
							width: "90%",
							borderRadius: 0,
							outline: "none",
						}}
					>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								mb: 3,
							}}
						>
							<Typography
								id="shortcuts-modal-title"
								variant="h4"
								component="h2"
							>
								Keyboard Shortcuts
							</Typography>
							<IconButton
								onClick={() => setShortcutsOpen(false)}
								sx={{ color: "text.primary" }}
								aria-label="Close shortcuts modal"
							>
								<CloseIcon />
							</IconButton>
						</Box>
						<Box
							id="shortcuts-modal-description"
							sx={{ display: "flex", flexDirection: "column", gap: 2 }}
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
								<Box
									key={sc.desc}
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										borderBottom: `1px solid ${theme.palette.divider}`,
										pb: 1,
									}}
								>
									<Typography variant="body1">{sc.desc}</Typography>
									<Box sx={{ display: "flex", gap: 0.5 }}>
										{sc.key.split(" ").map((k) => (
											<Box
												key={`${sc.desc}-${k}`}
												sx={{
													px: 1,
													py: 0.5,
													bgcolor: "action.selected",
													fontSize: "0.75rem",
													fontWeight: 600,
													textTransform: "uppercase",
													border: `1px solid ${theme.palette.divider}`,
												}}
											>
												{k}
											</Box>
										))}
									</Box>
								</Box>
							))}
						</Box>
					</Box>
				</Fade>
			</Modal>
		</KBarProvider>
	);
}

function RenderResults() {
	const { results } = useMatches();
	const theme = useTheme();

	return (
		<KBarResults
			items={results}
			onRender={({ item, active }) =>
				typeof item === "string" ? (
					<Box sx={{ px: 3, pt: 2, pb: 1 }}>
						<Typography variant="overline" color="text.secondary">
							{item}
						</Typography>
					</Box>
				) : (
					<Box
						sx={{
							px: 3,
							py: 1.75,
							background: active ? theme.palette.action.hover : "transparent",
							borderLeft: `2px solid ${active ? theme.palette.secondary.main : "transparent"}`,
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							cursor: "pointer",
							transition: "background 0.15s ease, border-color 0.15s ease",
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							{item.icon && (
								<Box sx={{ display: "flex", opacity: 0.7 }}>{item.icon}</Box>
							)}
							<Typography variant="body2">{item.name}</Typography>
						</Box>
						{item.shortcut?.length > 0 && (
							<Box sx={{ display: "flex", gap: 0.5 }}>
								{item.shortcut.map((sc) => (
									<Box
										key={sc}
										sx={{
											px: 0.75,
											py: 0.25,
											bgcolor: theme.palette.action.selected,
											fontSize: "0.65rem",
											fontWeight: 600,
											fontFamily:
												'"Work Sans Variable", "Work Sans", sans-serif',
											textTransform: "uppercase",
											letterSpacing: "0.08em",
										}}
									>
										{sc}
									</Box>
								))}
							</Box>
						)}
					</Box>
				)
			}
		/>
	);
}

CommandPalette.propTypes = {
	children: PropTypes.node,
};
