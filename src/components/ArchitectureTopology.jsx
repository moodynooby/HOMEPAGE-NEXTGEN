import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
	Box,
	Button,
	Chip,
	Divider,
	IconButton,
	Paper,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";

export const ECOSYSTEM_NODES = [
	{
		id: "notebookforge",
		name: "NotebookForge",
		shortName: "NotebookForge",
		category: "AI & ML",
		color: "#6366f1",
		x: 200,
		y: 110,
		tagline: "Multimodal AI Research & RAPTOR Tree RAG Engine",
		description:
			"Personal AI research assistant with dual-voice audio podcasts, split-document live citation reader, and deep document ingestion.",
		techStack: [
			"Python 3.12",
			"FastAPI",
			"NiceGUI",
			"RAPTOR RAG",
			"BM25s",
			"FastEmbed",
			"FSRS-4",
		],
		repo: "moodynooby/NotebookForge",
		keyCapabilities: [
			"Hierarchical RAPTOR Tree RAG & Hybrid Query Router",
			"Universal Ingestion Hub (YouTube transcripts, Web SSRF guard, PDF)",
			"Side-by-Side Document Reader with Live Citation Jump",
			"Dual-Voice Real Audio Overview with edge-tts",
		],
	},
	{
		id: "dietlogs",
		name: "diet-logs",
		shortName: "diet-logs",
		category: "Health & Habits",
		color: "#10b981",
		x: 700,
		y: 110,
		tagline: "Habit Consistency Engine & Nutrition Tracker",
		description:
			"Frictionless nutrition and habit tracker with meal planning, automated grocery generation, streak shields, and Telegram bot integration.",
		techStack: [
			"Python 3.12",
			"NiceGUI",
			"SQLite",
			"ReportLab",
			"Telegram Bot",
			"Whisper AI",
		],
		repo: "moodynooby/diet-logs",
		keyCapabilities: [
			"Weekly Meal Prep Planner & Auto-Generated Grocery List",
			"Persistent Streak Shields & Grace Cutoff Buffer Windows",
			"Comprehensive Nutrition Reports in PDF & CSV",
			"Voice Memo Transcription & AI Macro Extraction",
		],
	},
	{
		id: "homepage",
		name: "HOMEPAGE-NEXTGEN",
		shortName: "HOMEPAGE",
		category: "Web & Portal",
		color: "#f59e0b",
		x: 450,
		y: 260,
		tagline: "Central Ecosystem Gateway & Developer Portfolio",
		description:
			"Unified developer portal displaying project health telemetry, interactive tech radar, architecture topology, and terminal demos.",
		techStack: ["React 19", "Vite", "MUI", "Emotion", "Motion", "Vitest"],
		repo: "moodynooby/HOMEPAGE-NEXTGEN",
		keyCapabilities: [
			"Interactive SVG Tech Stack Radar with Quadrant Filtering",
			"Interactive Cross-App Architecture Topology Explorer",
			"Interactive Terminal Demo Sandbox with @xterm/xterm",
			"Editorial Theme with Light, Dark & High Contrast Modes",
		],
	},
	{
		id: "notionlite",
		name: "notion-lite",
		shortName: "notion-lite",
		category: "Productivity",
		color: "#8b5cf6",
		x: 200,
		y: 410,
		tagline: "Offline-First Local Desktop Canvas",
		description:
			"Lightning-fast desktop notes workspace with TipTap block editor, bidirectional backlinking, and full markdown backup export.",
		techStack: ["Rust", "Tauri", "React 19", "TypeScript", "TipTap", "SQLite"],
		repo: "moodynooby/notion-lite",
		keyCapabilities: [
			"Offline-First SQLite Storage with Zero Network Latency",
			"TipTap Block-Level Rich Text Scratchpad",
			"Bidirectional Page Linking & Backlink Graph",
			"Full Workspace ZIP Backup & Markdown Export Engine",
		],
	},
	{
		id: "whatsapp",
		name: "whatsapp-web-incognito",
		shortName: "WhatsApp Incognito",
		category: "Privacy & WebExt",
		color: "#06b6d4",
		x: 700,
		y: 410,
		tagline: "Privacy & Automation WebExtension",
		description:
			"Browser extension enforcing stealth presence, read receipt blocking, voice note safety, and outbox draft message scheduling.",
		techStack: [
			"TypeScript",
			"WebExtension MV3",
			"Content Scripts",
			"DOM Observers",
			"TailwindCSS",
		],
		repo: "moodynooby/whatsapp-web-incognito",
		keyCapabilities: [
			"Read Receipt & Online Status Interception",
			"Scheduled Message Sending & Outbox Queue",
			"Stealth Voice Note Listening & Media Auto-Download Guard",
			"Dynamic Resilient Heuristic DOM Selectors",
		],
	},
];

export const ECOSYSTEM_EDGES = [
	{
		id: "edge-hp-nb",
		source: "homepage",
		target: "notebookforge",
		label: "Telemetry & Knowledge Sync",
		flow: "Ingests repository telemetry, research highlights, and live status into central portal.",
	},
	{
		id: "edge-hp-dl",
		source: "homepage",
		target: "dietlogs",
		label: "Health Stats & Export Reports",
		flow: "Aggregates nutrition streaks, health summary data, and report download links.",
	},
	{
		id: "edge-hp-nl",
		source: "homepage",
		target: "notionlite",
		label: "Workspace Backups & Docs",
		flow: "Synchronizes markdown archives and ecosystem architectural notes.",
	},
	{
		id: "edge-hp-wa",
		source: "homepage",
		target: "whatsapp",
		label: "Extension Releases & Telemetry",
		flow: "Distributes extension updates, documentation, and user feedback.",
	},
	{
		id: "edge-nb-nl",
		source: "notebookforge",
		target: "notionlite",
		label: "Research Synthesis & Notes",
		flow: "Transfers multi-note AI summaries, citation cards, and scratchpad synthesis directly into canvas.",
	},
	{
		id: "edge-dl-nl",
		source: "dietlogs",
		target: "notionlite",
		label: "Meal Prep & Recipe Journal",
		flow: "Logs weekly grocery lists and recipe cards as persistent notes in workspace.",
	},
];

const CATEGORIES = [
	"All",
	"AI & ML",
	"Health & Habits",
	"Productivity",
	"Privacy & WebExt",
	"Web & Portal",
];

export default function ArchitectureTopology() {
	const theme = useTheme();
	const isDark = theme.palette.mode === "dark";

	const [selectedNodeId, setSelectedNodeId] = useState(null);
	const [hoveredNodeId, setHoveredNodeId] = useState(null);
	const [activeCategory, setActiveCategory] = useState("All");

	const activeNodeId = selectedNodeId || hoveredNodeId;

	const nodeMap = useMemo(() => {
		const map = new Map();
		for (const node of ECOSYSTEM_NODES) {
			map.set(node.id, node);
		}
		return map;
	}, []);

	const activeNode = useMemo(
		() => (activeNodeId ? nodeMap.get(activeNodeId) : null),
		[activeNodeId, nodeMap],
	);

	const connectedNodeIds = useMemo(() => {
		if (!activeNodeId) return new Set();
		const set = new Set([activeNodeId]);
		for (const edge of ECOSYSTEM_EDGES) {
			if (edge.source === activeNodeId) set.add(edge.target);
			if (edge.target === activeNodeId) set.add(edge.source);
		}
		return set;
	}, [activeNodeId]);

	const connectedEdges = useMemo(() => {
		if (!activeNodeId) return [];
		return ECOSYSTEM_EDGES.filter(
			(edge) => edge.source === activeNodeId || edge.target === activeNodeId,
		);
	}, [activeNodeId]);

	const handleNodeClick = useCallback((id) => {
		setSelectedNodeId((prev) => (prev === id ? null : id));
	}, []);

	const handleReset = useCallback(() => {
		setSelectedNodeId(null);
		setHoveredNodeId(null);
		setActiveCategory("All");
	}, []);

	return (
		<Paper
			elevation={0}
			data-testid="architecture-topology"
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
			{/* Header & Controls */}
			<Box sx={{ mb: 3 }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
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
							Ecosystem Architecture &amp; Cross-App Topology
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ fontStyle: "italic", mt: 0.5 }}
						>
							Interactive topology mapping data flows, contracts, and tech
							stacks across the 5 desktop workstation applications.
						</Typography>
					</Box>

					{(selectedNodeId || activeCategory !== "All") && (
						<Button
							variant="outlined"
							size="small"
							startIcon={<RestartAltIcon />}
							onClick={handleReset}
							sx={{
								textTransform: "none",
								fontSize: "0.8rem",
								borderColor: "divider",
								color: "text.secondary",
							}}
						>
							Reset View
						</Button>
					)}
				</Box>

				{/* Filter Chips */}
				<Box
					sx={{
						display: "flex",
						gap: 1,
						flexWrap: "wrap",
						alignItems: "center",
					}}
				>
					<Typography
						variant="caption"
						sx={{
							textTransform: "uppercase",
							letterSpacing: "0.08em",
							fontWeight: 600,
							color: "text.secondary",
							mr: 1,
						}}
					>
						Filter:
					</Typography>
					{CATEGORIES.map((cat) => {
						const isSelected = activeCategory === cat;
						return (
							<Chip
								key={cat}
								label={cat}
								size="small"
								clickable
								onClick={() => setActiveCategory(cat)}
								sx={{
									fontSize: "0.75rem",
									height: 26,
									fontWeight: isSelected ? 700 : 500,
									backgroundColor: isSelected
										? isDark
											? "rgba(253, 255, 218, 0.15)"
											: "rgba(56, 57, 46, 0.12)"
										: "transparent",
									border: "1px solid",
									borderColor: isSelected ? "text.primary" : "divider",
									color: isSelected ? "text.primary" : "text.secondary",
								}}
							/>
						);
					})}
				</Box>
			</Box>

			{/* Main SVG Topology Map & Detail Drawer */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", lg: "1fr 340px" },
					gap: 3,
					alignItems: "start",
				}}
			>
				{/* SVG Interactive Canvas */}
				<Paper
					elevation={0}
					sx={{
						border: "1px solid",
						borderColor: "divider",
						borderRadius: 2,
						overflow: "hidden",
						backgroundColor: isDark
							? "rgba(20, 22, 17, 0.85)"
							: "rgba(247, 248, 220, 0.75)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						p: 1,
					}}
				>
					<svg
						role="img"
						aria-label="Interactive architecture topology diagram"
						viewBox="0 0 900 520"
						style={{
							width: "100%",
							height: "auto",
							maxHeight: "560px",
							display: "block",
							userSelect: "none",
						}}
					>
						<defs>
							{/* Markers for arrows */}
							<marker
								id="topo-arrow"
								viewBox="0 0 10 10"
								refX="28"
								refY="5"
								markerWidth="6"
								markerHeight="6"
								orient="auto-start-reverse"
							>
								<path
									d="M 0 1.5 L 8 5 L 0 8.5 z"
									fill={isDark ? "#fdffda" : "#38392e"}
									opacity={0.65}
								/>
							</marker>
							<marker
								id="topo-arrow-active"
								viewBox="0 0 10 10"
								refX="28"
								refY="5"
								markerWidth="7"
								markerHeight="7"
								orient="auto-start-reverse"
							>
								<path
									d="M 0 1 L 9 5 L 0 9 z"
									fill={isDark ? "#facc15" : "#d97706"}
								/>
							</marker>
						</defs>

						{/* Background subtle grid lines */}
						<g opacity={isDark ? 0.08 : 0.05}>
							{[50, 150, 250, 350, 450, 550, 650, 750, 850].map((gx) => (
								<line
									key={`grid-x-${gx}`}
									x1={gx}
									y1={0}
									x2={gx}
									y2={520}
									stroke={isDark ? "#fff" : "#000"}
									strokeDasharray="2 6"
								/>
							))}
							{[60, 160, 260, 360, 460].map((gy) => (
								<line
									key={`grid-y-${gy}`}
									x1={0}
									y1={gy}
									x2={900}
									y2={gy}
									stroke={isDark ? "#fff" : "#000"}
									strokeDasharray="2 6"
								/>
							))}
						</g>

						{/* Connection Edges */}
						<g className="topology-edges">
							{ECOSYSTEM_EDGES.map((edge) => {
								const srcNode = nodeMap.get(edge.source);
								const tgtNode = nodeMap.get(edge.target);
								if (!srcNode || !tgtNode) return null;

								const isConnectedToActive =
									activeNodeId &&
									(edge.source === activeNodeId ||
										edge.target === activeNodeId);
								const isDimmed = activeNodeId && !isConnectedToActive;

								const dx = tgtNode.x - srcNode.x;
								const dy = tgtNode.y - srcNode.y;
								const cx1 = srcNode.x + dx * 0.4;
								const cy1 = srcNode.y + dy * 0.1;
								const cx2 = srcNode.x + dx * 0.6;
								const cy2 = srcNode.y + dy * 0.9;
								const pathD = `M ${srcNode.x} ${srcNode.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tgtNode.x} ${tgtNode.y}`;

								// Midpoint for label
								const midX = (srcNode.x + tgtNode.x) / 2;
								const midY = (srcNode.y + tgtNode.y) / 2;

								return (
									<g
										key={edge.id}
										opacity={isDimmed ? 0.18 : 1}
										style={{
											transition: "opacity 0.25s ease",
										}}
									>
										{/* Glow/highlight backdrop line when active */}
										{isConnectedToActive && (
											<path
												d={pathD}
												fill="none"
												stroke={isDark ? "#facc15" : "#d97706"}
												strokeWidth={5}
												strokeOpacity={0.3}
											/>
										)}

										<path
											d={pathD}
											fill="none"
											stroke={
												isConnectedToActive
													? isDark
														? "#facc15"
														: "#d97706"
													: isDark
														? "rgba(253, 255, 218, 0.35)"
														: "rgba(56, 57, 46, 0.3)"
											}
											strokeWidth={isConnectedToActive ? 2.5 : 1.5}
											strokeDasharray={isConnectedToActive ? "6 4" : "none"}
											markerEnd={
												isConnectedToActive
													? "url(#topo-arrow-active)"
													: "url(#topo-arrow)"
											}
										/>

										{/* Edge text label when active */}
										{isConnectedToActive && (
											<g transform={`translate(${midX}, ${midY})`}>
												<rect
													x={-75}
													y={-11}
													width={150}
													height={22}
													rx={11}
													fill={isDark ? "#1f211a" : "#fdf8ea"}
													stroke={isDark ? "#facc15" : "#d97706"}
													strokeWidth={1}
												/>
												<text
													textAnchor="middle"
													dominantBaseline="central"
													fontSize={10.5}
													fontWeight={600}
													fill={isDark ? "#fdffda" : "#38392e"}
												>
													{edge.label}
												</text>
											</g>
										)}
									</g>
								);
							})}
						</g>

						{/* Topology Application Nodes */}
						<g className="topology-nodes">
							{ECOSYSTEM_NODES.map((node) => {
								const isSelected = selectedNodeId === node.id;
								const isHovered = hoveredNodeId === node.id;
								const isActive = isSelected || isHovered;
								const isConnected =
									activeNodeId && connectedNodeIds.has(node.id);
								const matchesCategory =
									activeCategory === "All" || node.category === activeCategory;

								let nodeOpacity = 1;
								if (activeCategory !== "All" && !matchesCategory) {
									nodeOpacity = 0.25;
								} else if (activeNodeId && !isConnected && !isActive) {
									nodeOpacity = 0.35;
								}

								const isHub = node.id === "homepage";

								return (
									<g
										key={node.id}
										role="button"
										tabIndex={0}
										aria-label={`${node.name} (${node.category})`}
										transform={`translate(${node.x}, ${node.y})`}
										onClick={() => handleNodeClick(node.id)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												handleNodeClick(node.id);
											}
										}}
										onMouseEnter={() => setHoveredNodeId(node.id)}
										onMouseLeave={() => setHoveredNodeId(null)}
										style={{
											cursor: "pointer",
											opacity: nodeOpacity,
											transition: "opacity 0.25s ease, transform 0.2s ease",
											outline: "none",
										}}
									>
										{/* Active Aura / Pulse ring */}
										{isActive && (
											<circle
												r={isHub ? 52 : 46}
												fill="none"
												stroke={node.color}
												strokeWidth={2}
												strokeOpacity={0.4}
												strokeDasharray="4 4"
											/>
										)}

										{/* Node background circle */}
										<circle
											r={isHub ? 44 : 38}
											fill={
												isDark
													? isSelected
														? "#2a2d22"
														: "#1e2018"
													: isSelected
														? "#fff"
														: "#f9fae6"
											}
											stroke={
												isActive
													? node.color
													: isDark
														? "rgba(253, 255, 218, 0.25)"
														: "rgba(56, 57, 46, 0.2)"
											}
											strokeWidth={isActive ? 3 : 1.5}
											filter="drop-shadow(0 2px 6px rgba(0,0,0,0.18))"
										/>

										{/* Inner Accent Ring */}
										<circle
											r={isHub ? 36 : 30}
											fill="none"
											stroke={node.color}
											strokeWidth={1.5}
											strokeOpacity={0.65}
										/>

										{/* Node Monogram / Abbreviation */}
										<text
											textAnchor="middle"
											dominantBaseline="central"
											y={-2}
											fontSize={isHub ? 16 : 14}
											fontWeight={800}
											fontFamily='"Newsreader", serif'
											fill={
												isActive ? node.color : isDark ? "#fdffda" : "#38392e"
											}
										>
											{node.shortName
												.split(/[- ]/)
												.map((w) => w[0])
												.join("")
												.toUpperCase()
												.slice(0, 3)}
										</text>

										{/* Node Label Below */}
										<text
											textAnchor="middle"
											y={isHub ? 58 : 52}
											fontSize={13}
											fontWeight={isActive ? 700 : 600}
											fill={isDark ? "#fdffda" : "#38392e"}
										>
											{node.shortName}
										</text>

										{/* Node Category Badge */}
										<text
											textAnchor="middle"
											y={isHub ? 73 : 67}
											fontSize={10.5}
											fontWeight={500}
											fill={node.color}
											letterSpacing="0.04em"
										>
											{node.category}
										</text>
									</g>
								);
							})}
						</g>
					</svg>
				</Paper>

				{/* Detail Drawer / Side Inspector */}
				<Paper
					elevation={0}
					data-testid="topology-detail-panel"
					sx={{
						p: 2.5,
						border: "1px solid",
						borderColor: "divider",
						borderRadius: 2,
						backgroundColor: isDark
							? "rgba(35, 37, 29, 0.7)"
							: "rgba(253, 255, 218, 0.7)",
						minHeight: 460,
						display: "flex",
						flexDirection: "column",
					}}
				>
					{activeNode ? (
						<Box
							sx={{ display: "flex", flexDirection: "column", height: "100%" }}
						>
							{/* Panel Header */}
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-start",
									mb: 1.5,
								}}
							>
								<Box>
									<Chip
										label={activeNode.category}
										size="small"
										sx={{
											fontSize: "0.7rem",
											height: 20,
											fontWeight: 700,
											color: activeNode.color,
											borderColor: activeNode.color,
											border: "1px solid",
											backgroundColor: "transparent",
											mb: 1,
										}}
									/>
									<Typography
										variant="h5"
										component="h4"
										sx={{
											fontWeight: 700,
											fontFamily: '"Newsreader", serif',
											lineHeight: 1.2,
										}}
									>
										{activeNode.name}
									</Typography>
								</Box>

								{selectedNodeId && (
									<IconButton
										size="small"
										aria-label="Close details"
										onClick={() => setSelectedNodeId(null)}
										sx={{ color: "text.secondary" }}
									>
										<CloseIcon fontSize="small" />
									</IconButton>
								)}
							</Box>

							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ mb: 2, fontStyle: "italic" }}
							>
								{activeNode.tagline}
							</Typography>

							<Typography variant="body2" sx={{ mb: 2.5, lineHeight: 1.5 }}>
								{activeNode.description}
							</Typography>

							<Divider sx={{ mb: 2, borderColor: "divider" }} />

							{/* Tech Stack Chips */}
							<Box sx={{ mb: 2.5 }}>
								<Typography
									variant="caption"
									sx={{
										textTransform: "uppercase",
										letterSpacing: "0.08em",
										fontWeight: 700,
										color: "text.secondary",
										display: "block",
										mb: 1,
									}}
								>
									Tech Stack
								</Typography>
								<Box
									sx={{
										display: "flex",
										flexWrap: "wrap",
										gap: 0.6,
									}}
								>
									{activeNode.techStack.map((tech) => (
										<Chip
											key={tech}
											label={tech}
											size="small"
											sx={{
												fontSize: "0.72rem",
												height: 22,
												backgroundColor: isDark
													? "rgba(253, 255, 218, 0.08)"
													: "rgba(56, 57, 46, 0.06)",
												color: "text.primary",
												border: "1px solid",
												borderColor: "divider",
											}}
										/>
									))}
								</Box>
							</Box>

							{/* Connected Data Flows */}
							<Box sx={{ mb: 2.5 }}>
								<Typography
									variant="caption"
									sx={{
										textTransform: "uppercase",
										letterSpacing: "0.08em",
										fontWeight: 700,
										color: "text.secondary",
										display: "block",
										mb: 1,
									}}
								>
									Active Data Flows ({connectedEdges.length})
								</Typography>
								<Stack spacing={1}>
									{connectedEdges.map((edge) => {
										const otherNodeId =
											edge.source === activeNode.id ? edge.target : edge.source;
										const otherNode = nodeMap.get(otherNodeId);
										return (
											<Box
												key={edge.id}
												sx={{
													p: 1.2,
													borderRadius: 1.5,
													border: "1px solid",
													borderColor: "divider",
													backgroundColor: isDark
														? "rgba(20, 22, 17, 0.5)"
														: "rgba(255, 255, 255, 0.6)",
												}}
											>
												<Box
													sx={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
														mb: 0.5,
													}}
												>
													<Typography
														variant="caption"
														sx={{
															fontWeight: 700,
															color: "text.primary",
														}}
													>
														{edge.label}
													</Typography>
													<Typography
														variant="caption"
														sx={{
															fontWeight: 600,
															color: otherNode?.color,
														}}
													>
														↔ {otherNode?.shortName}
													</Typography>
												</Box>
												<Typography
													variant="caption"
													color="text.secondary"
													sx={{
														display: "block",
														lineHeight: 1.35,
													}}
												>
													{edge.flow}
												</Typography>
											</Box>
										);
									})}
								</Stack>
							</Box>

							{/* Key Capabilities */}
							<Box sx={{ mt: "auto" }}>
								<Typography
									variant="caption"
									sx={{
										textTransform: "uppercase",
										letterSpacing: "0.08em",
										fontWeight: 700,
										color: "text.secondary",
										display: "block",
										mb: 1,
									}}
								>
									Architectural Capabilities
								</Typography>
								<Box
									component="ul"
									sx={{
										m: 0,
										pl: 2,
										"& li": {
											fontSize: "0.78rem",
											color: "text.secondary",
											mb: 0.5,
										},
									}}
								>
									{activeNode.keyCapabilities.map((cap) => (
										<li key={cap}>{cap}</li>
									))}
								</Box>
							</Box>
						</Box>
					) : (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								height: "100%",
								textAlign: "center",
								py: 6,
								px: 2,
							}}
						>
							<Typography
								variant="h6"
								sx={{
									fontFamily: '"Newsreader", serif',
									fontWeight: 700,
									mb: 1,
								}}
							>
								Select an Application
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ maxWidth: 260 }}
							>
								Hover or click any node in the topology map to explore its
								architectural role, data flows, and tech stack.
							</Typography>
						</Box>
					)}
				</Paper>
			</Box>
		</Paper>
	);
}
