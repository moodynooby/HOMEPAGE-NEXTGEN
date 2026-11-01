import {
	Box,
	Chip,
	List,
	ListItem,
	ListItemText,
	Paper,
	Typography,
} from "@mui/material";
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
		r: 280,
		yoe: 1,
		keyRepos: [],
		projects: [],
	},
];

export default function TechRadar({ onActiveBlipChange }) {
	const [activeBlip, setActiveBlip] = useState(null);

	const handleBlipHover = (blip) => {
		setActiveBlip(blip);
		if (onActiveBlipChange) {
			onActiveBlipChange(blip);
		}
	};

	const handleBlipLeave = () => {
		// setActiveBlip(null); // Keep it active on click/hover for mobile/desktop friendliness or clear it
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: { xs: "column", md: "row" },
				gap: 4,
				alignItems: "flex-start",
				p: 4,
			}}
		>
			<Box
				sx={{
					position: "relative",
					width: { xs: "100%", md: "60%" },
					aspectRatio: "1 / 1",
					maxWidth: RADAR_SIZE,
				}}
			>
				<svg
					viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
					width="100%"
					height="100%"
					role="img"
					aria-label="Technology Radar Chart"
				>
					<title>Technology Radar Chart</title>
					{/* Background */}
					<rect width={RADAR_SIZE} height={RADAR_SIZE} fill="#f8f9fa" rx={16} />

					{/* Rings */}
					{RINGS.map((ring, index) => (
						<circle
							key={ring.name}
							cx={CENTER}
							cy={CENTER}
							r={ring.radius}
							fill="none"
							stroke={ring.color}
							strokeWidth={2}
							strokeDasharray={index === RINGS.length - 1 ? "none" : "4 4"}
						/>
					))}
					{/* Ring Labels */}
					{RINGS.map((ring) => (
						<text
							key={`label-${ring.name}`}
							x={CENTER}
							y={CENTER - ring.radius + 15}
							textAnchor="middle"
							fill="#666"
							fontSize="12"
							fontWeight="bold"
						>
							{ring.name}
						</text>
					))}

					{/* Quadrant Lines */}
					<line
						x1={0}
						y1={CENTER}
						x2={RADAR_SIZE}
						y2={CENTER}
						stroke="#ddd"
						strokeWidth={2}
					/>
					<line
						x1={CENTER}
						y1={0}
						x2={CENTER}
						y2={RADAR_SIZE}
						stroke="#ddd"
						strokeWidth={2}
					/>

					{/* Quadrant Labels */}
					<text
						x={CENTER + 50}
						y={50}
						fill="#333"
						fontSize="16"
						fontWeight="bold"
					>
						Languages
					</text>
					<text
						x={CENTER + 50}
						y={RADAR_SIZE - 30}
						fill="#333"
						fontSize="16"
						fontWeight="bold"
					>
						Frontend/UI
					</text>
					<text
						x={50}
						y={RADAR_SIZE - 30}
						fill="#333"
						fontSize="16"
						fontWeight="bold"
					>
						Backend/Data
					</text>
					<text x={50} y={50} fill="#333" fontSize="16" fontWeight="bold">
						DevOps/Cloud
					</text>

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
									fill={isActive ? "#000" : "#444"}
									fontWeight={isActive ? "bold" : "normal"}
								>
									{blip.name}
								</text>
							</g>
						);
					})}
				</svg>
			</Box>

			{/* Details Panel */}
			<Box sx={{ width: { xs: "100%", md: "40%" } }}>
				<Paper elevation={3} sx={{ p: 3, minHeight: 300, borderRadius: 2 }}>
					{activeBlip ? (
						<Box>
							<Typography variant="h4" gutterBottom>
								{activeBlip.name}
							</Typography>
							<Typography
								variant="subtitle1"
								color="text.secondary"
								gutterBottom
							>
								Quadrant: {QUADRANTS[activeBlip.quadrant].name} | Ring:{" "}
								{RINGS[activeBlip.ring].name}
							</Typography>
							<Box sx={{ my: 2 }}>
								<Typography variant="body1">
									<strong>Years of Experience:</strong> {activeBlip.yoe}
								</Typography>
							</Box>

							{activeBlip.keyRepos.length > 0 && (
								<Box sx={{ mb: 2 }}>
									<Typography variant="h6" gutterBottom>
										Key Repositories
									</Typography>
									<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
										{activeBlip.keyRepos.map((repo) => (
											<Chip
												key={repo}
												label={repo}
												component="a"
												href={`https://github.com/moodynooby/${repo}`}
												target="_blank"
												clickable
											/>
										))}
									</Box>
								</Box>
							)}

							{activeBlip.projects.length > 0 && (
								<Box>
									<Typography variant="h6" gutterBottom>
										Related Projects
									</Typography>
									<List dense>
										{activeBlip.projects.map((proj) => (
											<ListItem key={proj} disablePadding>
												<ListItemText
													primary={
														<Link
															to={`/projects/${proj}`}
															style={{
																textDecoration: "none",
																color: "inherit",
															}}
														>
															{proj}
														</Link>
													}
												/>
											</ListItem>
										))}
									</List>
								</Box>
							)}
						</Box>
					) : (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								height: "100%",
								minHeight: 250,
							}}
						>
							<Typography variant="h6" color="text.secondary">
								Hover or click a blip to see details
							</Typography>
						</Box>
					)}
				</Paper>
			</Box>
		</Box>
	);
}
