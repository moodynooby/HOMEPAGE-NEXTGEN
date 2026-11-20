import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import radarData from "@/content/techRadar.json";

export const RINGS = radarData.rings;
export const QUADRANTS = radarData.quadrants;
export const BLIPS = radarData.blips;

const RADAR_SIZE = 800;
const CENTER = RADAR_SIZE / 2;

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
			<div className="flex-1 radar-wrapper">
				<svg
					viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
					className="radar-svg"
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
								className="radar-label"
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
							className="radar-label"
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
								className="radar-blip"
							>
								<circle
									r={isActive ? 12 : 8}
									fill={RINGS[blip.ring].color}
									stroke="#fff"
									strokeWidth={2}
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
			<div className="surface-card flex-1 radar-details">
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
					<div className="flex items-center justify-center radar-placeholder">
						<p className="caption text-secondary italic">
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
