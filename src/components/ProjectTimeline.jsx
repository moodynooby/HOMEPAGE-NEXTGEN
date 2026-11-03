import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import CommitIcon from "@mui/icons-material/Commit";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	Chip,
	Divider,
	Drawer,
	IconButton,
	InputAdornment,
	Paper,
	Stack,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";

export const PROJECT_CONFIG = {
	NotebookForge: {
		name: "NotebookForge",
		shortName: "NotebookForge",
		color: "#6366f1",
		repo: "moodynooby/NotebookForge",
		repoUrl: "https://github.com/moodynooby/NotebookForge",
	},
	"diet-logs": {
		name: "diet-logs",
		shortName: "diet-logs",
		color: "#10b981",
		repo: "moodynooby/diet-logs",
		repoUrl: "https://github.com/moodynooby/diet-logs",
	},
	"whatsapp-web-incognito": {
		name: "whatsapp-web-incognito",
		shortName: "WhatsApp Incognito",
		color: "#06b6d4",
		repo: "moodynooby/whatsapp-web-incognito",
		repoUrl: "https://github.com/moodynooby/whatsapp-web-incognito",
	},
	"notion-lite": {
		name: "notion-lite",
		shortName: "notion-lite",
		color: "#8b5cf6",
		repo: "moodynooby/notion-lite",
		repoUrl: "https://github.com/moodynooby/notion-lite",
	},
	"homepage-nextgen": {
		name: "homepage-nextgen",
		shortName: "HOMEPAGE",
		color: "#f59e0b",
		repo: "moodynooby/HOMEPAGE-NEXTGEN",
		repoUrl: "https://github.com/moodynooby/HOMEPAGE-NEXTGEN",
	},
};

export const TIMELINE_MILESTONES = [
	{
		id: "hp-130",
		project: "homepage-nextgen",
		version: "v1.3.0",
		date: "2026-11-03",
		displayDate: "November 3, 2026",
		title: "Interactive Project Timeline & Release Milestone Changelog Drawer",
		summary:
			"Ecosystem-wide chronological release timeline with multi-repo filter chips, keyword search, and slide-over changelog drawer.",
		badge: "Feature",
		badgeType: "feature",
		commit: "6a81bf2",
		commitUrl: "https://github.com/moodynooby/HOMEPAGE-NEXTGEN/commit/6a81bf2",
		tags: ["React 19", "MUI 9", "Drawer", "Vitest", "Changelog"],
		details: [
			"Unified multi-repository milestone ledger tracking NotebookForge, diet-logs, whatsapp-web-incognito, notion-lite, and homepage-nextgen.",
			"Real-time search across titles, summaries, versions, and tags.",
			"Repository filter chips with instant count indicators.",
			"Interactive slide-over drawer displaying release highlights, commit links, and metadata.",
		],
		breakingChanges: null,
	},
	{
		id: "dl-050",
		project: "diet-logs",
		version: "v0.5.0",
		date: "2026-11-03",
		displayDate: "November 3, 2026",
		title: "Smart Multi-Source Nutrition Lookup & AI Food Estimation",
		summary:
			"Tri-tier nutrition lookup cascading from offline SQLite database to Open Food Facts API and AI fallback with Telegram /food command.",
		badge: "Feature",
		badgeType: "feature",
		commit: "0dcd893",
		commitUrl: "https://github.com/moodynooby/diet-logs/commit/0dcd893",
		tags: ["Open Food Facts", "AI Fallback", "Telegram Bot", "SQLite"],
		details: [
			"Multi-tier nutrition lookup pipeline: Offline SQLite -> Open Food Facts -> Generative AI Fallback.",
			"Telegram bot /food command for instant nutritional lookup from mobile chats.",
			"Confidence scores, source attribution indicators, and automatic macro parsing.",
			"Graceful handling of unknown food items with estimated calorie breakdowns.",
		],
		breakingChanges: null,
	},
	{
		id: "wwi-200",
		project: "whatsapp-web-incognito",
		version: "v2.0.0",
		date: "2026-11-03",
		displayDate: "November 3, 2026",
		title: "Custom Contact Privacy Rules & Whitelist Manager",
		summary:
			"Granular per-contact and whitelist override system with live chat header toggle chip and sync storage.",
		badge: "Major",
		badgeType: "major",
		commit: "d34b173",
		commitUrl:
			"https://github.com/moodynooby/whatsapp-web-incognito/commit/d34b173",
		tags: ["WebExt MV3", "Per-Contact", "DOM Observers", "Privacy"],
		details: [
			"Custom privacy rules allowing exceptions to global stealth settings per contact.",
			"Active chat header override toggle chip injected into WhatsApp Web conversation bar.",
			"Whitelist manager modal for viewing and managing exception rules.",
			"chrome.storage.local persistence with cross-tab synchronisation.",
		],
		breakingChanges:
			"Preference store schema updated to include contactRuleOverrides dictionary.",
	},
	{
		id: "nb-050",
		project: "NotebookForge",
		version: "v0.5.0",
		date: "2026-11-02",
		displayDate: "November 2, 2026",
		title: "Hands-Free Audio Flashcard Quiz Player",
		summary:
			"Full hands-free audio review player with Edge-TTS voice synthesis, question-answer pause gaps, playlist compilation, and FSRS-4 repetition.",
		badge: "Feature",
		badgeType: "feature",
		commit: "85f69a7",
		commitUrl: "https://github.com/moodynooby/NotebookForge/commit/85f69a7",
		tags: ["Edge-TTS", "FSRS-4", "FastAPI", "Audio Deck"],
		details: [
			"Audio flashcard synthesis generating high-fidelity Edge-TTS MP3 audio per card.",
			"Hands-free quiz player with customizable answer pause intervals (2s to 10s).",
			"Full deck audio playlist concatenation for offline listening during commutes.",
			"Integration with FSRS-4 spaced repetition algorithm for optimal retention intervals.",
		],
		breakingChanges: null,
	},
	{
		id: "hp-120",
		project: "homepage-nextgen",
		version: "v1.2.0",
		date: "2026-11-02",
		displayDate: "November 2, 2026",
		title: "Cross-App Architecture Topology & Data Flow Explorer",
		summary:
			"Interactive SVG architecture topology visualizer mapping relationships, contracts, and data pathways across the ecosystem.",
		badge: "Major",
		badgeType: "major",
		commit: "f2098bc",
		commitUrl: "https://github.com/moodynooby/HOMEPAGE-NEXTGEN/commit/f2098bc",
		tags: ["SVG Graph", "Cross-App", "Data Flows", "Architecture"],
		details: [
			"Interactive SVG graph rendering all 5 desktop workstation nodes.",
			"Live data flow highlights illustrating telemetry, knowledge synchronization, and IPC pathways.",
			"Node inspection drawer with tech stack chips and capability summaries.",
			"Keyboard navigable SVG nodes with full ARIA compliance.",
		],
		breakingChanges: null,
	},
	{
		id: "nl-040",
		project: "notion-lite",
		version: "v0.4.0",
		date: "2026-10-22",
		displayDate: "October 22, 2026",
		title: "Split-Pane Workspace & Fuzzy Command Palette",
		summary:
			"Side-by-side editing canvas with instant fuzzy-search command palette and keyboard-driven page navigation.",
		badge: "Enhancement",
		badgeType: "enhancement",
		commit: "c901e42",
		commitUrl: "https://github.com/moodynooby/notion-lite/commit/c901e42",
		tags: ["Tauri", "KBar", "Split Screen", "Hotkeys"],
		details: [
			"Configurable dual split-screen view allowing simultaneous cross-reference editing.",
			"Fuzzy command palette for rapid note creation, tagging, and switching.",
			"Reduced memory footprint for background Tauri webview processes.",
		],
		breakingChanges: null,
	},
	{
		id: "nb-040",
		project: "NotebookForge",
		version: "v0.4.0",
		date: "2026-10-18",
		displayDate: "October 18, 2026",
		title: "Side-by-Side Split Document Reader with Live Citation Jump",
		summary:
			"Document viewer with interactive synchronized citations jumping directly to highlighted source snippets in original PDFs.",
		badge: "Feature",
		badgeType: "feature",
		commit: "4a9b21e",
		commitUrl: "https://github.com/moodynooby/NotebookForge/commit/4a9b21e",
		tags: ["PDF Ingestion", "Live Citations", "NiceGUI"],
		details: [
			"Synchronized side-by-side reader linking synthesized RAG answers directly to PDF page regions.",
			"Smooth scrolling and visual bounding box pulse animation on source citation click.",
			"Document annotation support with persistent user notes.",
		],
		breakingChanges: null,
	},
	{
		id: "wwi-170",
		project: "whatsapp-web-incognito",
		version: "v1.7.0",
		date: "2026-10-15",
		displayDate: "October 15, 2026",
		title: "Dynamic Heuristic DOM Selector Engine",
		summary:
			"Resilient selector fallback algorithm maintaining incognito stealth hooks across WhatsApp Web DOM obfuscation changes.",
		badge: "Resilience",
		badgeType: "resilience",
		commit: "8c21a4f",
		commitUrl:
			"https://github.com/moodynooby/whatsapp-web-incognito/commit/8c21a4f",
		tags: ["DOM Heuristics", "Auto-healing", "MutationObserver"],
		details: [
			"Multi-attribute scoring algorithm determining chat header, message input, and status indicators.",
			"Automatic degradation to fallback selectors when class names mutate.",
			"Telemetry heartbeat validating hook attachment status.",
		],
		breakingChanges: null,
	},
	{
		id: "dl-040",
		project: "diet-logs",
		version: "v0.4.0",
		date: "2026-10-05",
		displayDate: "October 5, 2026",
		title: "Persistent Streak Shields & Buffer Windows",
		summary:
			"Automatic streak protection shields and configurable 4-hour morning grace period preventing accidental streak resets.",
		badge: "Enhancement",
		badgeType: "enhancement",
		commit: "5b82c19",
		commitUrl: "https://github.com/moodynooby/diet-logs/commit/5b82c19",
		tags: ["Gamification", "SQLite", "Habit Engine"],
		details: [
			"Shield token system earned every 7 consecutive days of logging.",
			"Configurable grace buffer window extending cutoff to 4:00 AM next day.",
			"Streak milestone celebratory visual notifications.",
		],
		breakingChanges: null,
	},
	{
		id: "hp-110",
		project: "homepage-nextgen",
		version: "v1.1.0",
		date: "2026-10-02",
		displayDate: "October 2, 2026",
		title: "Interactive SVG Tech Stack Radar",
		summary:
			"Four-quadrant tech radar tracking adoption levels (Adopt, Trial, Assess, Hold) with blip hover highlights and filtering.",
		badge: "Feature",
		badgeType: "feature",
		commit: "d849a21",
		commitUrl: "https://github.com/moodynooby/HOMEPAGE-NEXTGEN/commit/d849a21",
		tags: ["Tech Radar", "Thoughtworks Model", "SVG"],
		details: [
			"Visual 4-quadrant radar plot: Languages & Frameworks, Platforms & Cloud, Tools & AI, Storage & Libraries.",
			"Hovering blips highlights matching projects across the portfolio.",
			"Full dark mode and high-contrast accessibility compliance.",
		],
		breakingChanges: null,
	},
	{
		id: "nl-030",
		project: "notion-lite",
		version: "v0.3.0",
		date: "2026-09-28",
		displayDate: "September 28, 2026",
		title: "Workspace ZIP Backup & Markdown Exporter",
		summary:
			"One-click portable backup system archiving all SQLite documents, embedded assets, and metadata into standard markdown files.",
		badge: "Feature",
		badgeType: "feature",
		commit: "bf83201",
		commitUrl: "https://github.com/moodynooby/notion-lite/commit/bf83201",
		tags: ["Rust", "ZIP Archive", "Data Sovereignty"],
		details: [
			"Native Rust ZIP compression packaging notes and binary attachments.",
			"YAML frontmatter preservation for tags, creation timestamps, and backlinks.",
			"Scheduled automatic background snapshots with configurable retention.",
		],
		breakingChanges: null,
	},
	{
		id: "nb-030",
		project: "NotebookForge",
		version: "v0.3.0",
		date: "2026-09-20",
		displayDate: "September 20, 2026",
		title: "Dual-Voice Audio Podcast Engine",
		summary:
			"AI-generated conversational deep-dive audio discussions between two synthetic speakers from uploaded research papers.",
		badge: "Major",
		badgeType: "major",
		commit: "7f1c30d",
		commitUrl: "https://github.com/moodynooby/NotebookForge/commit/7f1c30d",
		tags: ["Podcast Generator", "Edge-TTS", "Multi-speaker"],
		details: [
			"Multi-turn dialogue script generation analyzing complex paper findings.",
			"Alternating speaker synthesis with distinct persona voices.",
			"Direct audio streaming player with playback speed adjustment (0.75x - 2.0x).",
		],
		breakingChanges: null,
	},
	{
		id: "dl-030",
		project: "diet-logs",
		version: "v0.3.0",
		date: "2026-09-14",
		displayDate: "September 14, 2026",
		title: "Weekly Meal Prep Planner & Auto-Grocery Generator",
		summary:
			"Automated 7-day caloric and macro distribution scheduler compiling categorized grocery lists with supermarket aisle grouping.",
		badge: "Major",
		badgeType: "major",
		commit: "39f82d1",
		commitUrl: "https://github.com/moodynooby/diet-logs/commit/39f82d1",
		tags: ["Meal Prep", "Pantry Sync", "PDF Reports"],
		details: [
			"Drag-and-drop weekly calendar distributing target calories and macronutrients.",
			"Automatic aggregation of ingredients into grocery list with quantity deduplication.",
			"Exportable PDF meal guide and shopping checklist.",
		],
		breakingChanges: null,
	},
	{
		id: "wwi-150",
		project: "whatsapp-web-incognito",
		version: "v1.5.0",
		date: "2026-09-10",
		displayDate: "September 10, 2026",
		title: "Scheduled Outbox Queue & Local Message Dispatcher",
		summary:
			"Background alarms and scheduling queue enabling deferred message dispatch while keeping browser tabs stealthy.",
		badge: "Feature",
		badgeType: "feature",
		commit: "63df81a",
		commitUrl:
			"https://github.com/moodynooby/whatsapp-web-incognito/commit/63df81a",
		tags: ["Outbox", "Alarm API", "Draft Storage"],
		details: [
			"Schedule messages for future date and time without opening chat windows.",
			"Persistent outbox queue in local IndexedDB.",
			"Cancel and reschedule controls prior to dispatch.",
		],
		breakingChanges: null,
	},
	{
		id: "hp-100",
		project: "homepage-nextgen",
		version: "v1.0.0",
		date: "2026-09-01",
		displayDate: "September 1, 2026",
		title: "Editorial Developer Portfolio Launch",
		summary:
			"Reimagined portfolio website designed with classic print editorial typography, high contrast modes, and dynamic GitHub telemetry.",
		badge: "Initial Release",
		badgeType: "initial",
		commit: "90b1c83",
		commitUrl: "https://github.com/moodynooby/HOMEPAGE-NEXTGEN/commit/90b1c83",
		tags: ["React 19", "Newsreader", "MUI 9", "Emotion"],
		details: [
			"Distinctive newspaper-inspired aesthetic using Newsreader and Noto Serif typography.",
			"Real-time telemetry fetching stars, forks, and Firefox extension active user counts.",
			"Interactive terminal sandbox with @xterm/xterm.",
		],
		breakingChanges: null,
	},
	{
		id: "nb-020",
		project: "NotebookForge",
		version: "v0.2.0",
		date: "2026-09-01",
		displayDate: "September 1, 2026",
		title: "Hierarchical RAPTOR Tree RAG & Hybrid Query Router",
		summary:
			"Tree-structured recursive summarization clusters for multi-resolution document synthesis combining BM25 lexical search with dense embeddings.",
		badge: "Architecture",
		badgeType: "architecture",
		commit: "1d38e92",
		commitUrl: "https://github.com/moodynooby/NotebookForge/commit/1d38e92",
		tags: ["RAPTOR", "BM25s", "FastEmbed", "Vector DB"],
		details: [
			"Recursive summary trees capturing holistic book-length thematic queries.",
			"Hybrid retrieval pipeline: BM25s lexical indexing + FastEmbed dense vectors with reciprocal rank fusion (RRF).",
			"Sub-50ms local inference response times.",
		],
		breakingChanges: null,
	},
	{
		id: "dl-020",
		project: "diet-logs",
		version: "v0.2.0",
		date: "2026-08-25",
		displayDate: "August 25, 2026",
		title: "Telegram Voice Memo Transcription & Macro Extraction",
		summary:
			"Hands-free audio logging via Telegram voice notes automatically transcribed and parsed into caloric values.",
		badge: "Feature",
		badgeType: "feature",
		commit: "24ac899",
		commitUrl: "https://github.com/moodynooby/diet-logs/commit/24ac899",
		tags: ["Whisper AI", "Telegram Bot", "Voice Note"],
		details: [
			"Whisper model transcription of Telegram voice messages.",
			"Natural language food extraction identifying portion sizes and food items.",
			"Instant reply with logged entry confirmation and daily target progress.",
		],
		breakingChanges: null,
	},
	{
		id: "nb-010",
		project: "NotebookForge",
		version: "v0.1.0",
		date: "2026-08-15",
		displayDate: "August 15, 2026",
		title: "Initial Prototype & Multimodal AI Research Hub",
		summary:
			"Foundational local research assistant with SSRF-safe YouTube transcript extraction and web document scraper.",
		badge: "Initial Release",
		badgeType: "initial",
		commit: "0a12f55",
		commitUrl: "https://github.com/moodynooby/NotebookForge/commit/0a12f55",
		tags: ["FastAPI", "NiceGUI", "SSR Guard"],
		details: [
			"Core FastAPI server and NiceGUI responsive user interface.",
			"Local PDF ingestion engine with layout preservation.",
			"Hardened web and YouTube ingestion with SSRF protection.",
		],
		breakingChanges: null,
	},
	{
		id: "nl-020",
		project: "notion-lite",
		version: "v0.2.0",
		date: "2026-08-10",
		displayDate: "August 10, 2026",
		title: "Bidirectional Page Links & Visual Graph Engine",
		summary:
			"Wiki-style [[wikilinks]] resolving in real-time with an interactive 2D node graph illustrating note relationships.",
		badge: "Major",
		badgeType: "major",
		commit: "7a62df8",
		commitUrl: "https://github.com/moodynooby/notion-lite/commit/7a62df8",
		tags: ["Backlinks", "Canvas Graph", "TipTap"],
		details: [
			"Real-time inline wikilink parser and autocompletion popover.",
			"Interactive canvas graph with force-directed physics.",
			"Backlinks explorer pane showing incoming and outgoing references.",
		],
		breakingChanges: null,
	},
	{
		id: "wwi-120",
		project: "whatsapp-web-incognito",
		version: "v1.2.0",
		date: "2026-07-28",
		displayDate: "July 28, 2026",
		title: "Stealth Voice Note Player & Auto-Download Guard",
		summary:
			"Listens to voice notes without triggering blue microphone playback receipts; blocks background media preloading.",
		badge: "Privacy",
		badgeType: "privacy",
		commit: "e2b490c",
		commitUrl:
			"https://github.com/moodynooby/whatsapp-web-incognito/commit/e2b490c",
		tags: ["Audio Intercept", "Data Guard", "Stealth"],
		details: [
			"Intercepted voice note audio buffer playback without dispatching played telemetry packet.",
			"Prevented media background preloading to safeguard user cellular bandwidth and anonymity.",
		],
		breakingChanges: null,
	},
	{
		id: "dl-010",
		project: "diet-logs",
		version: "v0.1.0",
		date: "2026-07-20",
		displayDate: "July 20, 2026",
		title: "Local-First Nutrition Log Core",
		summary:
			"Initial release of offline SQLite meal logging with daily caloric breakdowns and printable PDF monthly summaries.",
		badge: "Initial Release",
		badgeType: "initial",
		commit: "91a8c3d",
		commitUrl: "https://github.com/moodynooby/diet-logs/commit/91a8c3d",
		tags: ["NiceGUI", "SQLite", "ReportLab"],
		details: [
			"Local SQLite database schema for fast calorie and macro recording.",
			"Monthly summary report generation using ReportLab PDF compiler.",
			"Target calorie goal tracker with progress bars.",
		],
		breakingChanges: null,
	},
	{
		id: "nl-010",
		project: "notion-lite",
		version: "v0.1.0",
		date: "2026-07-01",
		displayDate: "July 1, 2026",
		title: "Desktop Local-First Notes Core",
		summary:
			"High-performance distraction-free desktop editor built on Rust and Tauri with sub-millisecond document loading.",
		badge: "Initial Release",
		badgeType: "initial",
		commit: "3b89110",
		commitUrl: "https://github.com/moodynooby/notion-lite/commit/3b89110",
		tags: ["Rust", "Tauri", "React 19", "SQLite"],
		details: [
			"Tauri desktop window with native OS window controls.",
			"TipTap block-based markdown editor.",
			"Sub-millisecond local SQLite persistence.",
		],
		breakingChanges: null,
	},
	{
		id: "wwi-100",
		project: "whatsapp-web-incognito",
		version: "v1.0.0",
		date: "2026-06-10",
		displayDate: "June 10, 2026",
		title: "Incognito Presence & Read Receipt Blocker",
		summary:
			"Initial release blocking read receipts, presence broadcast updates, and typing indicators on WhatsApp Web.",
		badge: "Initial Release",
		badgeType: "initial",
		commit: "1f7e42d",
		commitUrl:
			"https://github.com/moodynooby/whatsapp-web-incognito/commit/1f7e42d",
		tags: ["MV3", "WebSocket Hook", "Stealth Engine"],
		details: [
			"Manifest V3 content script injecting privacy hooks.",
			"WebSocket packet filter dropping presence updates and read receipts.",
			"Extension popup toggling individual privacy features.",
		],
		breakingChanges: null,
	},
];

const BADGE_COLOR_MAP = {
	Feature: "primary",
	Major: "secondary",
	Initial: "default",
	"Initial Release": "default",
	Enhancement: "info",
	Resilience: "warning",
	Architecture: "secondary",
	Privacy: "info",
};

export default function ProjectTimeline() {
	const theme = useTheme();
	const isDark = theme.palette.mode === "dark";

	const [selectedProject, setSelectedProject] = useState("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortDesc, setSortDesc] = useState(true);
	const [activeMilestone, setActiveMilestone] = useState(null);

	// Project filter chips list with counts
	const projectFilterOptions = useMemo(() => {
		const projects = Object.keys(PROJECT_CONFIG);
		const counts = { All: TIMELINE_MILESTONES.length };
		for (const p of projects) {
			counts[p] = TIMELINE_MILESTONES.filter((m) => m.project === p).length;
		}
		return [
			{ id: "All", label: "All Repositories", count: counts.All },
			...projects.map((p) => ({
				id: p,
				label: PROJECT_CONFIG[p].shortName || p,
				count: counts[p] || 0,
				color: PROJECT_CONFIG[p].color,
			})),
		];
	}, []);

	// Filtered & sorted milestones
	const filteredMilestones = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return TIMELINE_MILESTONES.filter((milestone) => {
			const matchesProject =
				selectedProject === "All" || milestone.project === selectedProject;
			if (!matchesProject) return false;

			if (!query) return true;

			const matchText = [
				milestone.title,
				milestone.summary,
				milestone.version,
				milestone.project,
				milestone.commit,
				milestone.badge,
				...(milestone.tags || []),
				...(milestone.details || []),
			]
				.join(" ")
				.toLowerCase();

			return matchText.includes(query);
		}).sort((a, b) => {
			const timeA = new Date(a.date).getTime();
			const timeB = new Date(b.date).getTime();
			return sortDesc ? timeB - timeA : timeA - timeB;
		});
	}, [selectedProject, searchQuery, sortDesc]);

	const handleResetFilters = () => {
		setSelectedProject("All");
		setSearchQuery("");
	};

	const handleOpenDrawer = (milestone) => {
		setActiveMilestone(milestone);
	};

	const handleCloseDrawer = () => {
		setActiveMilestone(null);
	};

	return (
		<Paper
			elevation={0}
			data-testid="project-timeline"
			sx={{
				p: { xs: 2, sm: 3, md: 4 },
				border: "1px solid",
				borderColor: "divider",
				borderRadius: 2,
				backgroundColor: isDark
					? "rgba(40, 42, 33, 0.65)"
					: "rgba(253, 255, 218, 0.5)",
				position: "relative",
			}}
		>
			{/* Header */}
			<Box sx={{ mb: 3 }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						flexWrap: "wrap",
						gap: 1.5,
						mb: 2,
					}}
				>
					<Box>
						<Typography
							variant="h4"
							component="h3"
							sx={{
								fontFamily: '"Newsreader", serif',
								fontWeight: 700,
								fontSize: { xs: "1.5rem", sm: "1.85rem" },
							}}
						>
							Interactive Project Timeline &amp; Release Milestones
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ fontStyle: "italic", mt: 0.5 }}
						>
							Chronological evolution and release changelog across the 5
							ecosystem applications.
						</Typography>
					</Box>

					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<Button
							variant="outlined"
							size="small"
							startIcon={<SwapVertIcon />}
							onClick={() => setSortDesc(!sortDesc)}
							sx={{
								textTransform: "none",
								fontSize: "0.8rem",
								py: 0.5,
								px: 1.25,
								borderColor: "divider",
								color: "text.primary",
								"&:hover": { borderColor: "text.primary" },
							}}
							aria-label={sortDesc ? "Sort oldest first" : "Sort newest first"}
						>
							{sortDesc ? "Newest first" : "Oldest first"}
						</Button>

						{(selectedProject !== "All" || searchQuery) && (
							<Button
								variant="outlined"
								size="small"
								startIcon={<RestartAltIcon />}
								onClick={handleResetFilters}
								sx={{
									textTransform: "none",
									fontSize: "0.8rem",
									py: 0.5,
									px: 1.25,
									borderColor: "divider",
									color: "text.primary",
									"&:hover": { borderColor: "text.primary" },
								}}
								aria-label="Reset filters"
							>
								Reset Filters
							</Button>
						)}
					</Box>
				</Box>

				{/* Search Field */}
				<Box sx={{ mb: 2.5 }}>
					<TextField
						fullWidth
						size="small"
						label="Search milestones"
						placeholder="Search milestones, versions, features, or commits..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						data-testid="milestone-search"
						inputProps={{
							"aria-label": "Search milestones",
						}}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon
										fontSize="small"
										sx={{ color: "text.secondary" }}
									/>
								</InputAdornment>
							),
							endAdornment: searchQuery ? (
								<InputAdornment position="end">
									<IconButton
										size="small"
										onClick={() => setSearchQuery("")}
										aria-label="Clear search query"
									>
										<ClearIcon fontSize="small" />
									</IconButton>
								</InputAdornment>
							) : null,
						}}
						sx={{
							"& .MuiOutlinedInput-root": {
								bgcolor: isDark
									? "rgba(40, 42, 33, 0.5)"
									: "rgba(255, 255, 255, 0.7)",
								borderRadius: 1,
							},
						}}
					/>
				</Box>

				{/* Repository Filter Chips */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
						flexWrap: "wrap",
					}}
				>
					<Typography
						variant="caption"
						color="text.secondary"
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 0.5,
							fontWeight: 600,
							letterSpacing: "0.05em",
							textTransform: "uppercase",
							mr: 0.5,
						}}
					>
						<FilterAltIcon sx={{ fontSize: 14 }} /> Repos:
					</Typography>

					{projectFilterOptions.map((opt) => {
						const isSelected = selectedProject === opt.id;
						const dotColor = opt.color || theme.palette.text.primary;
						return (
							<Chip
								key={opt.id}
								clickable
								label={`${opt.label} (${opt.count})`}
								size="small"
								onClick={() => setSelectedProject(opt.id)}
								aria-label={`Filter by ${opt.label}`}
								data-testid={`filter-${opt.id}`}
								variant={isSelected ? "filled" : "outlined"}
								icon={
									opt.id !== "All" ? (
										<Box
											component="span"
											sx={{
												width: 8,
												height: 8,
												borderRadius: "50%",
												bgcolor: dotColor,
												ml: 1,
												mr: -0.5,
											}}
										/>
									) : undefined
								}
								sx={{
									cursor: "pointer",
									fontWeight: isSelected ? 600 : 400,
									borderColor: isSelected ? "text.primary" : "divider",
									bgcolor: isSelected
										? isDark
											? "rgba(253, 255, 218, 0.15)"
											: "rgba(56, 57, 46, 0.1)"
										: "transparent",
									"&:hover": {
										bgcolor: isDark
											? "rgba(253, 255, 218, 0.1)"
											: "rgba(56, 57, 46, 0.05)",
									},
								}}
							/>
						);
					})}
				</Box>
			</Box>

			<Divider sx={{ mb: 3 }} />

			{/* Milestones count summary */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 2,
				}}
			>
				<Typography variant="caption" color="text.secondary">
					Showing {filteredMilestones.length} of {TIMELINE_MILESTONES.length}{" "}
					milestones
					{selectedProject !== "All" && ` in ${selectedProject}`}
					{searchQuery && ` matching "${searchQuery}"`}
				</Typography>
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ fontStyle: "italic" }}
				>
					Click any card to open changelog details
				</Typography>
			</Box>

			{/* Timeline Content */}
			{filteredMilestones.length === 0 ? (
				<Box
					sx={{
						py: 6,
						textAlign: "center",
						borderRadius: 1,
						border: "1px dashed",
						borderColor: "divider",
					}}
				>
					<Typography variant="body1" color="text.secondary" sx={{ mb: 1.5 }}>
						No milestones found matching your filters.
					</Typography>
					<Button
						variant="outlined"
						size="small"
						onClick={handleResetFilters}
						startIcon={<RestartAltIcon />}
					>
						Clear Filters
					</Button>
				</Box>
			) : (
				<Box
					sx={{
						position: "relative",
						pl: { xs: 2.5, sm: 4 },
						"&::before": {
							content: '""',
							position: "absolute",
							left: { xs: 10, sm: 16 },
							top: 16,
							bottom: 16,
							width: 2,
							bgcolor: "divider",
						},
					}}
				>
					<Stack spacing={2.5}>
						{filteredMilestones.map((milestone) => {
							const proj = PROJECT_CONFIG[milestone.project] || {};
							const projectColor = proj.color || "#888";
							const badgeColor = BADGE_COLOR_MAP[milestone.badge] || "default";

							return (
								<Box
									key={milestone.id}
									sx={{ position: "relative" }}
									data-testid={`milestone-item-${milestone.id}`}
								>
									{/* Timeline Node Marker */}
									<Box
										sx={{
											position: "absolute",
											left: { xs: -24, sm: -30 },
											top: 20,
											width: 14,
											height: 14,
											borderRadius: "50%",
											bgcolor: projectColor,
											border: "2px solid",
											borderColor: "background.paper",
											boxShadow: `0 0 0 2px ${projectColor}44`,
											zIndex: 1,
										}}
									/>

									{/* Card Item */}
									<Card
										variant="outlined"
										sx={{
											borderColor: "divider",
											bgcolor: isDark
												? "rgba(40, 42, 33, 0.45)"
												: "rgba(255, 255, 255, 0.65)",
											borderRadius: 1.5,
											transition: "transform 0.2s ease, border-color 0.2s ease",
											"&:hover": {
												transform: "translateY(-2px)",
												borderColor: projectColor,
											},
										}}
									>
										<CardActionArea
											onClick={() => handleOpenDrawer(milestone)}
											aria-label={`View release details for ${milestone.title}`}
											sx={{ p: 2 }}
										>
											<CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
												{/* Metadata Header */}
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														justifyContent: "space-between",
														flexWrap: "wrap",
														gap: 1,
														mb: 1,
													}}
												>
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: 1,
															flexWrap: "wrap",
														}}
													>
														<Chip
															label={proj.shortName || milestone.project}
															size="small"
															sx={{
																bgcolor: `${projectColor}20`,
																color: projectColor,
																fontWeight: 600,
																fontSize: "0.75rem",
																border: `1px solid ${projectColor}40`,
															}}
														/>
														<Chip
															label={milestone.version}
															size="small"
															variant="outlined"
															sx={{
																fontFamily: "monospace",
																fontWeight: 600,
																fontSize: "0.75rem",
															}}
														/>
														<Chip
															label={milestone.badge}
															size="small"
															color={badgeColor}
															variant="filled"
															sx={{ fontSize: "0.7rem", height: 20 }}
														/>
													</Box>

													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: 0.5,
															color: "text.secondary",
														}}
													>
														<CalendarTodayIcon sx={{ fontSize: 13 }} />
														<Typography
															variant="caption"
															sx={{ fontStyle: "italic" }}
														>
															{milestone.displayDate}
														</Typography>
													</Box>
												</Box>

												{/* Milestone Title */}
												<Typography
													variant="h6"
													component="h4"
													sx={{
														fontFamily: '"Newsreader", serif',
														fontWeight: 700,
														lineHeight: 1.25,
														mb: 0.75,
													}}
												>
													{milestone.title}
												</Typography>

												{/* Milestone Summary */}
												<Typography
													variant="body2"
													color="text.secondary"
													sx={{ mb: 1.5, lineHeight: 1.55 }}
												>
													{milestone.summary}
												</Typography>

												{/* Footer / Tags & Commit Link */}
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														justifyContent: "space-between",
														flexWrap: "wrap",
														gap: 1,
														pt: 1,
														borderTop: "1px dashed",
														borderColor: "divider",
													}}
												>
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: 0.75,
															flexWrap: "wrap",
														}}
													>
														{(milestone.tags || []).slice(0, 4).map((tag) => (
															<Chip
																key={tag}
																label={tag}
																size="small"
																variant="outlined"
																sx={{
																	fontSize: "0.68rem",
																	height: 19,
																	borderColor: "divider",
																}}
															/>
														))}
													</Box>

													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: 0.5,
															color: "text.secondary",
															fontFamily: "monospace",
															fontSize: "0.75rem",
														}}
													>
														<CommitIcon sx={{ fontSize: 15 }} />
														<span>{milestone.commit}</span>
													</Box>
												</Box>
											</CardContent>
										</CardActionArea>
									</Card>
								</Box>
							);
						})}
					</Stack>
				</Box>
			)}

			{/* Slide-over Changelog Detail Drawer */}
			<Drawer
				anchor="right"
				open={Boolean(activeMilestone)}
				onClose={handleCloseDrawer}
				data-testid="milestone-drawer"
				slotProps={{
					paper: {
						sx: {
							width: { xs: "100%", sm: 480, md: 540 },
							p: { xs: 2.5, sm: 3.5 },
							bgcolor: isDark ? "#282a21" : "#fdffda",
							color: "text.primary",
							boxShadow: isDark
								? "-4px 0 24px rgba(0,0,0,0.7)"
								: "-4px 0 24px rgba(56,57,46,0.15)",
						},
					},
				}}
			>
				{activeMilestone && (
					<Box
						sx={{ display: "flex", flexDirection: "column", height: "100%" }}
					>
						{/* Drawer Top Bar */}
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								pb: 2,
								borderBottom: "1px solid",
								borderColor: "divider",
							}}
						>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<Chip
									label={
										PROJECT_CONFIG[activeMilestone.project]?.shortName ||
										activeMilestone.project
									}
									size="small"
									sx={{
										bgcolor: `${
											PROJECT_CONFIG[activeMilestone.project]?.color || "#888"
										}20`,
										color:
											PROJECT_CONFIG[activeMilestone.project]?.color || "#888",
										fontWeight: 600,
									}}
								/>
								<Chip
									label={activeMilestone.version}
									size="small"
									variant="outlined"
									sx={{ fontFamily: "monospace", fontWeight: 700 }}
								/>
								<Chip
									label={activeMilestone.badge}
									size="small"
									color={BADGE_COLOR_MAP[activeMilestone.badge] || "default"}
								/>
							</Box>

							<IconButton
								onClick={handleCloseDrawer}
								aria-label="Close changelog drawer"
								data-testid="close-drawer"
								size="small"
								sx={{
									border: "1px solid",
									borderColor: "divider",
									borderRadius: 1,
								}}
							>
								<CloseIcon fontSize="small" />
							</IconButton>
						</Box>

						{/* Scrollable Body */}
						<Box sx={{ flex: 1, overflowY: "auto", py: 3 }}>
							<Typography
								variant="overline"
								color="text.secondary"
								sx={{ letterSpacing: "0.08em" }}
							>
								Release Changelog &amp; Architecture
							</Typography>

							<Typography
								variant="h4"
								component="h3"
								data-testid="drawer-title"
								sx={{
									fontFamily: '"Newsreader", serif',
									fontWeight: 800,
									lineHeight: 1.15,
									mt: 0.5,
									mb: 1.5,
								}}
							>
								{activeMilestone.title}
							</Typography>

							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 2,
									flexWrap: "wrap",
									color: "text.secondary",
									mb: 2.5,
								}}
							>
								<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
									<CalendarTodayIcon sx={{ fontSize: 14 }} />
									<Typography variant="body2">
										{activeMilestone.displayDate}
									</Typography>
								</Box>
								<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
									<GitHubIcon sx={{ fontSize: 14 }} />
									<Typography variant="body2" sx={{ fontFamily: "monospace" }}>
										{PROJECT_CONFIG[activeMilestone.project]?.repo ||
											activeMilestone.project}
									</Typography>
								</Box>
							</Box>

							{/* Commit Link Card */}
							<Paper
								variant="outlined"
								sx={{
									p: 1.5,
									mb: 3,
									bgcolor: isDark
										? "rgba(40, 42, 33, 0.6)"
										: "rgba(255, 255, 255, 0.8)",
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									gap: 1,
								}}
							>
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<CommitIcon sx={{ color: "text.secondary" }} />
									<Box>
										<Typography
											variant="caption"
											color="text.secondary"
											sx={{ display: "block" }}
										>
											Verified Commit
										</Typography>
										<Typography
											variant="body2"
											sx={{ fontFamily: "monospace", fontWeight: 700 }}
										>
											{activeMilestone.commit}
										</Typography>
									</Box>
								</Box>

								<Button
									size="small"
									variant="outlined"
									href={activeMilestone.commitUrl}
									target="_blank"
									rel="noopener noreferrer"
									endIcon={<LaunchIcon sx={{ fontSize: 14 }} />}
									data-testid="drawer-commit-link"
									aria-label="View commit on GitHub"
									sx={{ textTransform: "none", fontSize: "0.75rem" }}
								>
									View on GitHub
								</Button>
							</Paper>

							{/* Summary */}
							<Typography
								variant="subtitle1"
								sx={{ fontWeight: 600, mb: 0.75 }}
							>
								Summary
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ mb: 3, lineHeight: 1.7 }}
							>
								{activeMilestone.summary}
							</Typography>

							{/* Detailed Highlights */}
							<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
								Key Deliverables &amp; Changes
							</Typography>
							<Stack spacing={1} sx={{ mb: 3 }}>
								{(activeMilestone.details || []).map((detail) => (
									<Box
										key={detail}
										sx={{
											display: "flex",
											alignItems: "flex-start",
											gap: 1.25,
										}}
									>
										<Box
											component="span"
											sx={{
												width: 6,
												height: 6,
												borderRadius: "50%",
												bgcolor:
													PROJECT_CONFIG[activeMilestone.project]?.color ||
													"secondary.main",
												mt: 0.9,
												flexShrink: 0,
											}}
										/>
										<Typography
											variant="body2"
											color="text.primary"
											sx={{ lineHeight: 1.6 }}
										>
											{detail}
										</Typography>
									</Box>
								))}
							</Stack>

							{/* Breaking Changes */}
							{activeMilestone.breakingChanges && (
								<Paper
									variant="outlined"
									sx={{
										p: 2,
										mb: 3,
										borderColor: "warning.main",
										bgcolor: isDark
											? "rgba(245, 158, 11, 0.1)"
											: "rgba(245, 158, 11, 0.08)",
									}}
								>
									<Typography
										variant="subtitle2"
										color="warning.main"
										sx={{ fontWeight: 700, mb: 0.5 }}
									>
										Breaking Changes &amp; Schema Updates
									</Typography>
									<Typography variant="body2">
										{activeMilestone.breakingChanges}
									</Typography>
								</Paper>
							)}

							{/* Tags */}
							<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
								Tags &amp; Capabilities
							</Typography>
							<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
								{(activeMilestone.tags || []).map((tag) => (
									<Chip
										key={tag}
										label={tag}
										size="small"
										variant="outlined"
										sx={{ borderColor: "divider", fontSize: "0.75rem" }}
									/>
								))}
							</Box>
						</Box>

						{/* Drawer Footer */}
						<Box
							sx={{
								pt: 2,
								borderTop: "1px solid",
								borderColor: "divider",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Button
								variant="text"
								color="inherit"
								size="small"
								onClick={handleCloseDrawer}
							>
								Close
							</Button>
							<Button
								variant="contained"
								size="small"
								href={
									PROJECT_CONFIG[activeMilestone.project]?.repoUrl ||
									"https://github.com/moodynooby"
								}
								target="_blank"
								rel="noopener noreferrer"
								endIcon={<GitHubIcon sx={{ fontSize: 14 }} />}
								sx={{ textTransform: "none" }}
							>
								Open Repository
							</Button>
						</Box>
					</Box>
				)}
			</Drawer>
		</Paper>
	);
}
