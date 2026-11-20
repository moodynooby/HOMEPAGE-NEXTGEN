import { RotateCcw, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import topologyData from "@/content/architectureNodes.json";
import { useThemeContext } from "@/contexts/ThemeContext";

export const ECOSYSTEM_NODES = topologyData.nodes;
export const ECOSYSTEM_EDGES = topologyData.edges;

const CATEGORIES = [
	"All",
	"AI & ML",
	"Health & Habits",
	"Productivity",
	"Privacy & WebExt",
	"Web & Portal",
];

export default function ArchitectureTopology() {
	const { mode } = useThemeContext();
	const isDark = mode === "dark";

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
		<div
			className="card"
			data-testid="architecture-topology"
			style={{
				padding: "1.5rem",
				border: "1px solid var(--color-border, var(--hairline-rule))",
				background: isDark
					? "rgba(40, 42, 33, 0.65)"
					: "rgba(253, 255, 218, 0.5)",
				position: "relative",
			}}
		>
			{/* Header & Controls */}
			<div style={{ marginBottom: "1.5rem" }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexWrap: "wrap",
						gap: "0.75rem",
						marginBottom: "1rem",
					}}
				>
					<div>
						<h3
							className="editorial-subheading"
							style={{ margin: 0, fontSize: "clamp(1.5rem, 3vw, 1.85rem)" }}
						>
							Ecosystem Architecture &amp; Cross-App Topology
						</h3>
						<p
							className="editorial-body"
							style={{
								fontStyle: "italic",
								margin: "0.25rem 0 0",
								color: "var(--color-text-secondary, #7d5d53)",
							}}
						>
							Interactive topology mapping data flows, contracts, and tech
							stacks across the 5 desktop workstation applications.
						</p>
					</div>

					{(selectedNodeId || activeCategory !== "All") && (
						<button
							type="button"
							onClick={handleReset}
							className="btn btn-outlined btn-sm"
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "4px",
							}}
						>
							<RotateCcw size={14} />
							<span>Reset View</span>
						</button>
					)}
				</div>

				{/* Filter Chips */}
				<div
					style={{
						display: "flex",
						gap: "0.5rem",
						flexWrap: "wrap",
						alignItems: "center",
					}}
				>
					<span className="editorial-meta" style={{ marginRight: "0.25rem" }}>
						Filter:
					</span>
					{CATEGORIES.map((cat) => {
						const isSelected = activeCategory === cat;
						return (
							<button
								type="button"
								key={cat}
								onClick={() => setActiveCategory(cat)}
								className={`chip chip-sm ${isSelected ? "chip-primary" : ""}`}
							>
								{cat}
							</button>
						);
					})}
				</div>
			</div>

			{/* Main SVG Topology Map & Detail Drawer */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
					gap: "1.5rem",
					alignItems: "start",
				}}
			>
				{/* SVG Interactive Canvas */}
				<div
					style={{
						border: "1px solid var(--color-border, var(--hairline-rule))",
						background: isDark
							? "rgba(20, 22, 17, 0.85)"
							: "rgba(247, 248, 220, 0.75)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						padding: "0.5rem",
						overflow: "hidden",
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
									d="M 0 1.5 L 8 5 L 0 8.5 z"
									fill={isDark ? "#facc15" : "#d97706"}
								/>
							</marker>
						</defs>

						{/* Edge Connections */}
						<g className="topology-edges">
							{ECOSYSTEM_EDGES.map((edge) => {
								const sourceNode = nodeMap.get(edge.source);
								const targetNode = nodeMap.get(edge.target);
								if (!sourceNode || !targetNode) return null;

								const isConnectedToActive =
									activeNodeId &&
									(edge.source === activeNodeId ||
										edge.target === activeNodeId);

								let edgeOpacity = 0.55;
								if (activeNodeId) {
									edgeOpacity = isConnectedToActive ? 1 : 0.12;
								}

								const midX = (sourceNode.x + targetNode.x) / 2;
								const midY = (sourceNode.y + targetNode.y) / 2;

								return (
									<g
										key={edge.id}
										style={{
											opacity: edgeOpacity,
											transition: "opacity 0.25s ease",
										}}
									>
										<line
											x1={sourceNode.x}
											y1={sourceNode.y}
											x2={targetNode.x}
											y2={targetNode.y}
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

										{isConnectedToActive && (
											<g transform={`translate(${midX}, ${midY})`}>
												<rect
													x={-75}
													y={-11}
													width={150}
													height={22}
													rx={0}
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
										}}
									>
										{/* Outer aura on active */}
										{isActive && (
											<circle
												r={isHub ? 52 : 44}
												fill="none"
												stroke={node.color}
												strokeWidth={2}
												strokeDasharray="4 3"
												opacity={0.8}
											/>
										)}

										{/* Main node circle */}
										<circle
											r={isHub ? 44 : 36}
											fill={
												isActive
													? isDark
														? "#303428"
														: "#f5f6ce"
													: isDark
														? "#1d2019"
														: "#fbfce3"
											}
											stroke={
												isActive
													? node.color
													: isDark
														? "rgba(253, 255, 218, 0.3)"
														: "rgba(56, 57, 46, 0.25)"
											}
											strokeWidth={isActive ? 2.5 : 1.5}
										/>

										{/* Short name text */}
										<text
											textAnchor="middle"
											dy="-2"
											fontSize={isHub ? 13 : 11.5}
											fontWeight={700}
											fill={isDark ? "#fdffda" : "#38392e"}
											style={{
												fontFamily:
													"var(--font-family-code, 'Work Sans', sans-serif)",
											}}
										>
											{node.shortName}
										</text>

										{/* Category label */}
										<text
											textAnchor="middle"
											dy="14"
											fontSize={9}
											fontWeight={600}
											fill={node.color}
											letterSpacing="0.04em"
											style={{
												fontFamily:
													"var(--font-family-code, 'Work Sans', sans-serif)",
												textTransform: "uppercase",
											}}
										>
											{node.category}
										</text>
									</g>
								);
							})}
						</g>
					</svg>
				</div>

				{/* Detail Drawer Panel */}
				<div
					style={{
						border: "1px solid var(--color-border, var(--hairline-rule))",
						background: isDark
							? "rgba(20, 22, 17, 0.75)"
							: "rgba(255, 255, 255, 0.7)",
						padding: "1.25rem",
						minHeight: "420px",
						display: "flex",
						flexDirection: "column",
					}}
				>
					{activeNode ? (
						<div>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-start",
									marginBottom: "0.75rem",
								}}
							>
								<div>
									<span
										className="chip chip-sm"
										style={{
											color: activeNode.color,
											borderColor: activeNode.color,
											marginBottom: "0.5rem",
										}}
									>
										{activeNode.category}
									</span>
									<h4
										className="editorial-card-title"
										style={{ margin: "0.25rem 0", fontSize: "1.3rem" }}
									>
										{activeNode.name}
									</h4>
								</div>

								{selectedNodeId && (
									<button
										type="button"
										aria-label="Close details"
										onClick={() => setSelectedNodeId(null)}
										className="icon-btn"
									>
										<X size={16} />
									</button>
								)}
							</div>

							<p
								className="editorial-body"
								style={{
									fontStyle: "italic",
									color: "var(--color-text-secondary, #7d5d53)",
									marginBottom: "0.75rem",
									fontSize: "0.85rem",
								}}
							>
								{activeNode.tagline}
							</p>

							<p
								className="editorial-body"
								style={{
									fontSize: "0.875rem",
									lineHeight: 1.5,
									marginBottom: "1rem",
								}}
							>
								{activeNode.description}
							</p>

							<hr className="editorial-divider" style={{ margin: "1rem 0" }} />

							{/* Tech Stack Chips */}
							<div style={{ marginBottom: "1rem" }}>
								<p
									className="editorial-meta"
									style={{ marginBottom: "0.5rem" }}
								>
									Tech Stack
								</p>
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										gap: "0.35rem",
									}}
								>
									{activeNode.techStack.map((tech) => (
										<span key={tech} className="chip chip-sm">
											{tech}
										</span>
									))}
								</div>
							</div>

							{/* Architectural Role */}
							<div style={{ marginBottom: "1rem" }}>
								<p
									className="editorial-meta"
									style={{ marginBottom: "0.25rem" }}
								>
									Architectural Role
								</p>
								<p
									className="editorial-body"
									style={{
										fontSize: "0.85rem",
										lineHeight: 1.45,
										margin: 0,
									}}
								>
									{activeNode.architecturalRole}
								</p>
							</div>

							{/* Connected Data Flows */}
							<div style={{ marginBottom: "1rem" }}>
								<p
									className="editorial-meta"
									style={{ marginBottom: "0.5rem" }}
								>
									Active Data Flows ({connectedEdges.length})
								</p>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "0.5rem",
									}}
								>
									{connectedEdges.map((edge) => {
										const otherNodeId =
											edge.source === activeNode.id ? edge.target : edge.source;
										const otherNode = nodeMap.get(otherNodeId);
										return (
											<div
												key={edge.id}
												style={{
													padding: "0.6rem",
													border:
														"1px solid var(--color-border, var(--hairline-rule))",
													background: isDark
														? "rgba(20, 22, 17, 0.5)"
														: "rgba(255, 255, 255, 0.6)",
												}}
											>
												<div
													style={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
														marginBottom: "0.25rem",
													}}
												>
													<span
														style={{
															fontWeight: 700,
															fontSize: "0.78rem",
															fontFamily:
																"var(--font-family-code, 'Work Sans', sans-serif)",
														}}
													>
														{edge.label}
													</span>
													<span
														style={{
															fontWeight: 600,
															fontSize: "0.75rem",
															color: otherNode?.color,
														}}
													>
														↔ {otherNode?.shortName}
													</span>
												</div>
												<span
													style={{
														fontSize: "0.75rem",
														color: "var(--color-text-secondary, #7d5d53)",
														display: "block",
														lineHeight: 1.35,
													}}
												>
													{edge.flow}
												</span>
											</div>
										);
									})}
								</div>
							</div>

							{/* Key Capabilities */}
							<div>
								<p
									className="editorial-meta"
									style={{ marginBottom: "0.5rem" }}
								>
									Architectural Capabilities
								</p>
								<ul
									style={{
										margin: 0,
										paddingLeft: "1.25rem",
										fontSize: "0.78rem",
										color: "var(--color-text-secondary, #7d5d53)",
										lineHeight: 1.5,
									}}
								>
									{activeNode.keyCapabilities.map((cap) => (
										<li key={cap}>{cap}</li>
									))}
								</ul>
							</div>
						</div>
					) : (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								height: "100%",
								textAlign: "center",
								padding: "2rem 1rem",
							}}
						>
							<h4
								className="editorial-card-title"
								style={{ marginBottom: "0.5rem" }}
							>
								Select an Application
							</h4>
							<p
								className="editorial-body"
								style={{
									maxWidth: "260px",
									fontSize: "0.85rem",
									color: "var(--color-text-secondary, #7d5d53)",
								}}
							>
								Hover or click any node in the topology map to explore its
								architectural role, data flows, and tech stack.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
