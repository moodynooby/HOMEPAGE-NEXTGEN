import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";

const RADAR_SIZE = 800;
const CENTER = RADAR_SIZE / 2;
const RINGS = [
	{ name: "Adopt", radius: 130, color: "#93c47d" },
	{ name: "Trial", radius: 220, color: "#93d2c6" },
	{ name: "Assess", radius: 310, color: "#fbcd73" },
	{ name: "Hold", radius: 400, color: "#e06666" },
];

const QUADRANTS = [
	{ name: "Languages", angle: -Math.PI / 4 }, // Top-Right
	{ name: "Frontend/UI", angle: Math.PI / 4 }, // Bottom-Right
	{ name: "Backend/Data", angle: (3 * Math.PI) / 4 }, // Bottom-Left
	{ name: "DevOps/Cloud", angle: (-3 * Math.PI) / 4 }, // Top-Left
];

const BLIPS = [
	{
		id: 1,
		name: "JavaScript",
		quadrant: 0,
		ring: 0,
		theta: -Math.PI / 8,
		r: 80,
		yoe: 5,
		keyRepos: ["Todo.Txt", "TaskTimer"],
		projects: ["Todo.Txt", "TaskTimer"],
	},
	{
		id: 2,
		name: "TypeScript",
		quadrant: 0,
		ring: 0,
		theta: (-3 * Math.PI) / 8,
		r: 110,
		yoe: 3,
		keyRepos: ["Modern-TWP"],
		projects: ["Modern-TWP"],
	},
	{
		id: 3,
		name: "Python",
		quadrant: 0,
		ring: 1,
		theta: -Math.PI / 6,
		r: 180,
		yoe: 2,
		keyRepos: ["scripts-repo"],
		projects: [],
	},
	{
		id: 4,
		name: "React",
		quadrant: 1,
		ring: 0,
		theta: Math.PI / 8,
		r: 90,
		yoe: 4,
		keyRepos: ["modern-portfolio"],
		projects: ["modern-portfolio"],
	},
	{
		id: 5,
		name: "Vue",
		quadrant: 1,
		ring: 2,
		theta: Math.PI / 6,
		r: 270,
		yoe: 1,
		keyRepos: [],
		projects: [],
	},
	{
		id: 6,
		name: "Node.js",
		quadrant: 2,
		ring: 0,
		theta: (7 * Math.PI) / 8,
		r: 100,
		yoe: 4,
		keyRepos: ["backend-api"],
		projects: [],
	},
	{
		id: 7,
		name: "PostgreSQL",
		quadrant: 2,
		ring: 0,
		theta: (5 * Math.PI) / 8,
		r: 120,
		yoe: 3,
		keyRepos: [],
		projects: [],
	},
	{
		id: 8,
		name: "Docker",
		quadrant: 3,
		ring: 1,
		theta: (-5 * Math.PI) / 8,
		r: 180,
		yoe: 2,
		keyRepos: [],
		projects: [],
	},
	{
		id: 9,
		name: "AWS",
		quadrant: 3,
		ring: 2,
		theta: (-7 * Math.PI) / 8,
		r: 260,
		yoe: 2,
		keyRepos: [],
		projects: [],
	},
];

export default function TechRadar({ onBlipSelect }) {
	const [activeBlip, setActiveBlip] = useState(null);

	const handleBlipHover = (blip) => {
		setActiveBlip(blip);
		if (onBlipSelect) {
			onBlipSelect(blip ? blip.projects : []);
		}
	};

	const handleBlipLeave = () => {
		// Keep active blip selected or let it stay until another is hovered
	};

	return (
		<div className="flex flex-col md:flex-row gap-6 items-center w-full">
			{/* SVG Radar */}
			<div
				className="flex-1"
				style={{ maxWidth: 650, width: "100%", aspectRatio: "1/1" }}
			>
				<svg
					viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
					style={{ width: "100%", height: "100%", display: "block" }}
					aria-label="Interactive Technology Radar"
				>
					{/* Rings */}
					{RINGS.map((ring) => (
						<circle
							key={ring.name}
							cx={CENTER}
							cy={CENTER}
							r={ring.radius}
							fill="none"
							stroke="var(--color-border, var(--hairline-rule))"
							strokeWidth="1"
							strokeDasharray="4 4"
						/>
					))}

					{/* Quadrant Lines */}
					<line
						x1={CENTER}
						y1={0}
						x2={CENTER}
						y2={RADAR_SIZE}
						stroke="var(--color-border, var(--hairline-rule))"
						strokeWidth="1.5"
					/>
					<line
						x1={0}
						y1={CENTER}
						x2={RADAR_SIZE}
						y2={CENTER}
						stroke="var(--color-border, var(--hairline-rule))"
						strokeWidth="1.5"
					/>

					{/* Quadrant Labels */}
					{QUADRANTS.map((quad) => {
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
								fill="var(--color-text-secondary, #7d5d53)"
								fontSize="14"
								fontWeight="600"
								letterSpacing="0.08em"
								style={{ textTransform: "uppercase" }}
							>
								{quad.name}
							</text>
						);
					})}

					{/* Ring Labels */}
					{RINGS.map((ring) => (
						<text
							key={ring.name}
							x={CENTER + 6}
							y={CENTER - ring.radius + 16}
							fill="var(--color-text-secondary, #7d5d53)"
							fontSize="10"
							fontWeight="600"
							letterSpacing="0.1em"
							opacity="0.8"
							style={{ textTransform: "uppercase" }}
						>
							{ring.name}
						</text>
					))}

					{/* Blips */}
					{BLIPS.map((blip) => {
						const cx = CENTER + blip.r * Math.cos(blip.theta);
						const cy = CENTER + blip.r * Math.sin(blip.theta);
						const isActive = activeBlip && activeBlip.id === blip.id;

						return (
							<g
								key={blip.id}
								role="button"
								tabIndex={0}
								aria-label={`Tech Radar Blip for ${blip.name}`}
								transform={`translate(${cx}, ${cy})`}
								onMouseEnter={() => handleBlipHover(blip)}
								onMouseLeave={handleBlipLeave}
								onClick={() => handleBlipHover(blip)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										handleBlipHover(blip);
									}
								}}
								style={{ cursor: "pointer" }}
							>
								<circle
									r={isActive ? 12 : 8}
									fill={RINGS[blip.ring].color}
									stroke="#fff"
									strokeWidth={2}
									style={{ transition: "all 0.2s" }}
								/>
								<text
									y={20}
									textAnchor="middle"
									fontSize="12"
									fill={
										isActive
											? "var(--color-text-primary, #38392e)"
											: "var(--color-text-secondary, #7d5d53)"
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

			{/* Details Panel */}
			<div
				className="surface-card flex-1"
				style={{ maxWidth: 440, width: "100%", minHeight: 320 }}
			>
				{activeBlip ? (
					<div>
						<h3 className="mb-1">{activeBlip.name}</h3>
						<p className="caption text-secondary mb-3">
							Quadrant: {QUADRANTS[activeBlip.quadrant].name} | Ring:{" "}
							{RINGS[activeBlip.ring].name}
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
											href={`https://github.com/moodynooby/${repo}`}
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
												className="caption"
												style={{
													textDecoration: "underline",
													textUnderlineOffset: 3,
												}}
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
					<div
						className="flex items-center justify-center"
						style={{ height: "100%", minHeight: 250 }}
					>
						<p
							className="caption text-secondary"
							style={{ fontStyle: "italic" }}
						>
							Hover or click a blip to see details
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

TechRadar.propTypes = {
	onBlipSelect: PropTypes.func,
};
