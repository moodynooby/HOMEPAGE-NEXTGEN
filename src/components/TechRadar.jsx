import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { githubRepoUrl } from "@/config/site";
import useTechRadarData from "@/hooks/useTechRadarData";

const RADAR_SIZE = 800;
const CENTER = RADAR_SIZE / 2;

const RING_CONFIG = [
	{ radius: 110, color: "var(--color-chart-adopt)" },
	{ radius: 190, color: "var(--color-chart-trial)" },
	{ radius: 270, color: "var(--color-chart-assess)" },
	{ radius: 350, color: "var(--color-chart-hold)" },
];

const QUAD_ANGLES = [
	{ angle: -Math.PI / 4, startAngle: -Math.PI / 2, endAngle: 0 },
	{ angle: Math.PI / 4, startAngle: 0, endAngle: Math.PI / 2 },
	{ angle: (3 * Math.PI) / 4, startAngle: Math.PI / 2, endAngle: Math.PI },
	{ angle: -(3 * Math.PI) / 4, startAngle: -Math.PI, endAngle: -Math.PI / 2 },
];

export default function TechRadar({ onActiveBlipChange, showAppBar = false }) {
	const location = useLocation();
	const isStandalone = showAppBar || location?.pathname === "/radar";

	const {
		rings: rawRings,
		quadrants: rawQuadrants,
		blips: rawBlips,
	} = useTechRadarData();

	const [activeBlip, setActiveBlip] = useState(null);
	const [selectedQuadrant, setSelectedQuadrant] = useState("All");

	const rings = useMemo(
		() =>
			rawRings.map((name, index) => ({
				name,
				...(RING_CONFIG[index] || RING_CONFIG[0]),
			})),
		[rawRings],
	);

	const quadrants = useMemo(
		() =>
			rawQuadrants.map((name, index) => ({
				name,
				...(QUAD_ANGLES[index] || QUAD_ANGLES[0]),
			})),
		[rawQuadrants],
	);

	const positionedBlips = useMemo(() => {
		const groups = {};
		for (const blip of rawBlips) {
			const key = `${blip.quadrant}-${blip.ring}`;
			if (!groups[key]) groups[key] = [];
			groups[key].push(blip);
		}

		return rawBlips.map((blip) => {
			const qIndex = Math.max(
				0,
				quadrants.findIndex((q) => q.name === blip.quadrant),
			);
			const rIndex = Math.max(
				0,
				rings.findIndex((r) => r.name === blip.ring),
			);
			const quad = quadrants[qIndex !== -1 ? qIndex : 0];
			const innerR = rIndex === 0 ? 30 : rings[rIndex - 1].radius + 15;
			const outerR = rings[rIndex].radius - 15;

			const key = `${blip.quadrant}-${blip.ring}`;
			const blipIndexInGroup = groups[key].findIndex((b) => b.id === blip.id);
			const totalInGroup = groups[key].length;

			const span = quad.endAngle - quad.startAngle;
			const pad = span * 0.15;
			const effectiveSpan = span - 2 * pad;
			const angleStep =
				totalInGroup > 1 ? effectiveSpan / (totalInGroup - 1) : 0;
			const angle =
				totalInGroup > 1
					? quad.startAngle + pad + blipIndexInGroup * angleStep
					: quad.startAngle + span / 2;

			// Stagger radiuses cleanly so blips in the same quadrant/ring never collide
			const radiusFactor = 0.25 + (blipIndexInGroup % 3) * 0.25;
			const radius = innerR + radiusFactor * (outerR - innerR);

			const cx = CENTER + radius * Math.cos(angle);
			const cy = CENTER + radius * Math.sin(angle);

			return {
				...blip,
				cx,
				cy,
				qIndex,
				rIndex,
			};
		});
	}, [rawBlips, quadrants, rings]);

	const visibleBlips = useMemo(() => {
		if (selectedQuadrant === "All") return positionedBlips;
		return positionedBlips.filter((b) => b.quadrant === selectedQuadrant);
	}, [positionedBlips, selectedQuadrant]);

	const handleBlipHover = (blip) => {
		setActiveBlip(blip);
		if (onActiveBlipChange) {
			onActiveBlipChange(blip);
		}
	};

	const content = (
		<div className="flex flex-col gap-6 w-full">
			{/* Top Toolbar / Filter Controls */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					flexWrap: "wrap",
					gap: "1rem",
					borderBottom: "1px solid var(--color-border)",
					paddingBottom: "1rem",
				}}
			>
				<div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
					<button
						type="button"
						onClick={() => setSelectedQuadrant("All")}
						className="chip"
						style={{
							borderColor:
								selectedQuadrant === "All"
									? "var(--color-text-primary)"
									: "var(--color-border)",
							backgroundColor:
								selectedQuadrant === "All"
									? "var(--color-overlay-hover)"
									: "transparent",
						}}
					>
						All Quadrants
					</button>
					{rawQuadrants.map((q) => (
						<button
							key={q}
							type="button"
							onClick={() => setSelectedQuadrant(q)}
							className="chip"
							style={{
								borderColor:
									selectedQuadrant === q
										? "var(--color-text-primary)"
										: "var(--color-border)",
								backgroundColor:
									selectedQuadrant === q
										? "var(--color-overlay-hover)"
										: "transparent",
							}}
						>
							{q}
						</button>
					))}
				</div>

				<span className="editorial-meta text-secondary">
					{visibleBlips.length} Technologies
				</span>
			</div>

			<div className="flex flex-col md:flex-row gap-6 items-center w-full">
				<div className="flex-1 radar-wrapper">
					<svg
						viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
						className="radar-svg"
						aria-label="Interactive Technology Radar"
					>
						{rings.map((ring) => (
							<circle
								key={ring.name}
								cx={CENTER}
								cy={CENTER}
								r={ring.radius}
								fill="none"
								stroke="var(--color-border)"
								strokeWidth="1"
								strokeDasharray="4 4"
							/>
						))}

						<line
							x1={CENTER}
							y1={0}
							x2={CENTER}
							y2={RADAR_SIZE}
							stroke="var(--color-border)"
							strokeWidth="1.5"
						/>
						<line
							x1={0}
							y1={CENTER}
							x2={RADAR_SIZE}
							y2={CENTER}
							stroke="var(--color-border)"
							strokeWidth="1.5"
						/>

						{quadrants.map((quad) => {
							const dist = 380;
							const x = CENTER + dist * Math.cos(quad.angle);
							const y = CENTER + dist * Math.sin(quad.angle);
							return (
								<text
									key={quad.name}
									x={x}
									y={y}
									textAnchor="middle"
									dominantBaseline="central"
									fill="var(--color-text-secondary)"
									fontSize="14"
									fontWeight="600"
									letterSpacing="0.08em"
									className="radar-label"
								>
									{quad.name}
								</text>
							);
						})}

						{rings.map((ring) => (
							<text
								key={ring.name}
								x={CENTER + 6}
								y={CENTER - ring.radius + 16}
								fill="var(--color-text-secondary)"
								fontSize="10"
								fontWeight="600"
								letterSpacing="0.1em"
								opacity="0.8"
								className="radar-label"
							>
								{ring.name}
							</text>
						))}

						{visibleBlips.map((blip) => {
							const isActive = activeBlip && activeBlip.id === blip.id;

							return (
								<g
									key={blip.id}
									role="button"
									tabIndex={0}
									aria-label={`Tech Radar Blip for ${blip.name}`}
									transform={`translate(${blip.cx}, ${blip.cy})`}
									onMouseEnter={() => handleBlipHover(blip)}
									onClick={() => handleBlipHover(blip)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											handleBlipHover(blip);
										}
									}}
									className="radar-blip"
								>
									<circle
										r={isActive ? 12 : 8}
										fill={
											rings[blip.rIndex]?.color || "var(--color-chart-adopt)"
										}
										stroke="var(--color-background-surface)"
										strokeWidth={2}
									/>
									<text
										y={20}
										textAnchor="middle"
										fontSize="12"
										fill={
											isActive
												? "var(--color-text-primary)"
												: "var(--color-text-secondary)"
										}
										fontWeight={isActive ? "bold" : "normal"}
									>
										{blip.name}
									</text>
								</g>
							);
						})}
					</svg>
				</div>

				<div className="surface-card flex-1 radar-details">
					{activeBlip ? (
						<div>
							<div className="flex justify-between items-start mb-2">
								<div>
									<h3 className="mb-1">{activeBlip.name}</h3>
									<div className="flex items-center gap-2 flex-wrap mb-2">
										<span
											className="badge"
											style={{
												borderColor:
													rings[activeBlip.rIndex]?.color ||
													"var(--color-chart-adopt)",
											}}
										>
											{activeBlip.ring}
										</span>
										<span className="editorial-meta text-accent">
											{activeBlip.quadrant}
										</span>
										{activeBlip.source === "github" && (
											<span className="chip chip-sm">GitHub Tag</span>
										)}
									</div>
								</div>
							</div>

							<p className="caption text-secondary mb-3">
								Quadrant: {activeBlip.quadrant} | Ring: {activeBlip.ring}
							</p>
							<p className="font-body mb-4">
								<strong>Years of Experience:</strong> {activeBlip.yoe}
							</p>

							{activeBlip.keyRepos.length > 0 && (
								<div className="mb-4">
									<h5 className="mb-2">Key Repositories</h5>
									<div className="flex gap-2 flex-wrap">
										{activeBlip.keyRepos.map((repo) => (
											<a
												key={repo}
												href={githubRepoUrl(repo)}
												target="_blank"
												rel="noreferrer"
												className="chip"
											>
												{repo}
											</a>
										))}
									</div>
								</div>
							)}

							{activeBlip.projects.length > 0 && (
								<div>
									<h5 className="mb-2">Related Projects</h5>
									<ul className="list-unstyled flex flex-col gap-1">
										{activeBlip.projects.map((proj) => (
											<li key={proj}>
												<Link
													to={`/projects/${proj}`}
													className="caption underline"
												>
													{proj}
												</Link>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center radar-placeholder text-center p-4">
							<p className="editorial-meta mb-2">
								{positionedBlips.length} Technologies Indexed
							</p>
							<p className="caption text-secondary italic mb-4">
								Hover or click a blip to see details
							</p>
							<p
								className="editorial-body text-secondary"
								style={{ fontSize: "0.85rem", maxWidth: "280px" }}
							>
								Derived dynamically from GitHub repository languages and topics.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);

	if (isStandalone) {
		return (
			<div style={{ minHeight: "100vh", paddingBottom: "3rem" }}>
				<Header />
				<main
					id="main-content"
					className="editorial-container"
					style={{ paddingTop: "3rem", paddingBottom: "4rem" }}
				>
					<div
						style={{
							borderBottom: "1px solid var(--color-border)",
							paddingBottom: "1.5rem",
							marginBottom: "2rem",
						}}
					>
						<p className="editorial-meta">Dynamic Technology Assessment</p>
						<h1
							className="editorial-headline"
							style={{ fontSize: "2.75rem", margin: "0.25rem 0" }}
						>
							Tech Stack Radar
						</h1>
						<p
							className="editorial-body text-secondary"
							style={{ maxWidth: "60ch", marginBottom: 0 }}
						>
							An interactive, four-quadrant catalog of languages, frameworks,
							tools, and cloud platforms — dynamically synced with GitHub
							language tags and project repositories.
						</p>
					</div>
					{content}
				</main>
			</div>
		);
	}

	return content;
}

TechRadar.propTypes = {
	onActiveBlipChange: PropTypes.func,
	showAppBar: PropTypes.bool,
};
