import { ArrowForward, Star, Download, Visibility } from "@mui/icons-material";
import {
	Box,
	Chip,
	CircularProgress,
	Container,
	Typography,
	useMediaQuery,
	useTheme,
	Tooltip,
} from "@mui/material";
import { motion } from "motion/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonAppBar from "@/components/Header";
import projectsData from "@/content/projects.json";
import { fetchRepoMetadata, groupProjectsByYear } from "@/utils/githubUtils";

const MotionBox = motion.create(Box);

export default function Projects({ limit, showAppBar = true }) {
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeCategory, setActiveCategory] = useState("All");

	useEffect(() => {
		async function loadProjects() {
			const projectsWithMetadata = await Promise.all(
				projectsData.map(async (project) => {
					const metadata = await fetchRepoMetadata(project.githubName);
						return {
							...project,
							year: metadata?.year || new Date().getFullYear(),
							date: metadata?.created_at || "",
							language: metadata?.language || "",
							stars: metadata?.stars || 0,
							forks: metadata?.forks || 0,
						};
				}),
			);
			const sortedProjects = projectsWithMetadata.sort(
				(a, b) => new Date(b.date) - new Date(a.date),
			);

			setProjects(limit ? sortedProjects.slice(0, limit) : sortedProjects);
			setLoading(false);
		}
		loadProjects();
	}, [limit]);

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "60vh",
				}}
			>
				<CircularProgress color="primary" />
			</Box>
		);
	}

	const categoryCounts = projects.reduce((acc, project) => {
		acc[project.category] = (acc[project.category] || 0) + 1;
		return acc;
	}, {});
	const categoryOrder = [
		"Web App",
		"Browser Extension",
		"Game",
		"AI Tool",
		"Computer Vision",
	];
	const categories = [
		"All",
		...categoryOrder.filter((category) => categoryCounts[category]),
	];
	const filteredProjects =
		activeCategory === "All"
			? projects
			: projects.filter((project) => project.category === activeCategory);

	const groupedProjects = groupProjectsByYear(filteredProjects);
	const years = Object.keys(groupedProjects).sort((a, b) => {
		if (a === "Unknown") return 1;
		if (b === "Unknown") return -1;
		return Number(b) - Number(a);
	});
	const entryNumbers = new Map(
		projects.map((project, idx) => [project.githubName, idx + 1]),
	);

	return (
		<>
			{showAppBar && <ButtonAppBar />}
			<Box
				sx={{
					pt: showAppBar ? { xs: 10, md: 14 } : 0,
					pb: 8,
					position: "relative",
					minHeight: "100vh",
				}}
			>
				<Container maxWidth="lg">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<Typography
							variant="h2"
							sx={{
								textAlign: "center",
								mb: 12,
								textTransform: "uppercase",
								letterSpacing: "-0.02em",
							}}
						>
							The Personal Project Ledger
						</Typography>
					</motion.div>

					<Box
						sx={{
							display: "flex",
							flexWrap: "wrap",
							justifyContent: "center",
							gap: 1.5,
							mb: 8,
						}}
					>
						{categories.map((category) => {
							const count =
								category === "All" ? projects.length : categoryCounts[category];
							return (
								<Chip
									key={category}
									label={`${category} · ${count}`}
									onClick={() => setActiveCategory(category)}
									variant={activeCategory === category ? "filled" : "outlined"}
									color="primary"
								/>
							);
						})}
					</Box>

					{filteredProjects.length === 0 ? (
						<Typography
							variant="body1"
							sx={{ textAlign: "center", py: 8, opacity: 0.75 }}
						>
							No projects in this category yet.
						</Typography>
					) : (
						<Box key={activeCategory} sx={{ position: "relative" }}>
							{!isMobile && (
								<Box
									sx={{
										position: "absolute",
										left: "50%",
										top: 0,
										bottom: 0,
										width: "1px",
										bgcolor: "rgba(187, 186, 172, 0.3)",
										transform: "translateX(-50%)",
									}}
								/>
							)}

							{years.map((year) => (
								<Box
									key={year}
									sx={{
										mb: 12,
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										position: "relative",
									}}
								>
									<MotionBox
										initial={{ scale: 0.8, opacity: 0 }}
										whileInView={{ scale: 1, opacity: 1 }}
										viewport={{ once: true }}
										sx={{
											bgcolor: "background.default",
											px: 4,
											py: 1,
											mb: 8,
											zIndex: 2,
											border: "1px solid",
											borderColor: "divider",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: 140,
											height: 140,
											borderRadius: "50%",
										}}
									>
										<Typography
											variant="h3"
											sx={{
												fontStyle: "italic",
												color: "secondary.main",
												fontWeight: 300,
											}}
										>
											{year}
										</Typography>
									</MotionBox>

									<Box sx={{ width: "100%" }}>
										{groupedProjects[year].map((project) => (
											<MotionBox
												key={project.githubName}
												initial={{ y: 24, opacity: 0 }}
												whileInView={{ y: 0, opacity: 1 }}
												viewport={{ once: true }}
												transition={{ duration: 0.5 }}
												sx={{ bgcolor: "background.default" }}
											>
												<Box
													component="article"
													onClick={() =>
														navigate(`/projects/${project.githubName}`)
													}
													sx={{
														display: "flex",
														alignItems: "center",
														gap: { xs: 2.5, md: 4 },
														py: { xs: 2.5, md: 3.5 },
														px: { xs: 1, md: 2 },
														cursor: "pointer",
														borderTop: "1px solid",
														borderColor: "divider",
														transition: "background-color 0.3s ease",
														"&:hover": {
															bgcolor: "action.hover",
														},
														"&:hover .ledger-arrow": {
															transform: "translateX(4px)",
															opacity: 1,
														},
													}}
												>
													{!isMobile && (
														<Typography
															variant="overline"
															sx={{
																width: 64,
																flexShrink: 0,
																color: "text.secondary",
																fontSize: "0.68rem",
																letterSpacing: "0.15em",
																lineHeight: 1,
															}}
														>
															No.{" "}
															{String(
																entryNumbers.get(project.githubName),
															).padStart(2, "0")}
														</Typography>
													)}

													<Box
														sx={{
															width: { xs: 56, md: 88 },
															height: { xs: 56, md: 88 },
															flexShrink: 0,
															bgcolor: "rgba(187, 186, 172, 0.1)",
															border: "1px solid",
															borderColor: "divider",
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															p: { xs: 1, md: 1.5 },
															overflow: "hidden",
														}}
													>
														<Box
															component="img"
															src={project.githubImg}
															alt={project.githubName}
															loading="lazy"
															sx={{
																maxWidth: "100%",
																maxHeight: "100%",
																objectFit: "contain",
																opacity: 0.85,
																filter: "grayscale(100%) contrast(115%)",
																transition: "all 0.5s ease-in-out",
																"&:hover": {
																	opacity: 1,
																	filter: "grayscale(0%) contrast(100%)",
																},
															}}
														/>
													</Box>

													<Box sx={{ flex: 1, minWidth: 0 }}>
														<Typography
															variant="h5"
															sx={{ mb: 0.5, color: "text.primary" }}
														>
															{project.githubName}
														</Typography>
														<Typography
															variant="body2"
															sx={{
																color: "text.primary",
																opacity: 0.75,
																display: "-webkit-box",
																WebkitLineClamp: 2,
																WebkitBoxOrient: "vertical",
																overflow: "hidden",
																lineHeight: 1.55,
															}}
														>
															{project.tagline}
														</Typography>
															<Box
																sx={{
																	display: "flex",
																	alignItems: "center",
																	gap: 1.5,
																	mt: 1,
																	flexWrap: "wrap",
																}}
															>
																<Typography
																	variant="overline"
																	sx={{
																		color: "secondary.main",
																		fontSize: "0.68rem",
																		letterSpacing: "0.12em",
																		lineHeight: 1,
																	}}
																>
																	{project.category}
																</Typography>
																<Typography
																	variant="overline"
																	sx={{
																		color: "text.secondary",
																		fontSize: "0.68rem",
																		letterSpacing: "0.12em",
																		lineHeight: 1,
																		opacity: 0.7,
																	}}
																>
																	{year}
																	{project.language
																		? ` · ${project.language}`
																		: ""}
																</Typography>
																
																{/* GitHub Stats */}
																{project.stars > 0 && (
																	<Box sx={{ display: "flex", alignItems: "center", gap: 0.5, opacity: 0.8 }}>
																		<Star sx={{ fontSize: "0.75rem", color: "secondary.main" }} />
																		<Typography variant="overline" sx={{ fontSize: "0.68rem", lineHeight: 1 }}>
																			{project.stars}
																		</Typography>
																	</Box>
																)}

																{/* Mozilla Add-on Badge Integration */}
																{project.addonId && (
																	<Box 
																		component="img" 
																		src={`https://img.shields.io/amo/users/${project.addonId}?style=flat-square&color=${theme.palette.secondary.main.replace('#', '')}&label=USERS&labelColor=${theme.palette.primary.main.replace('#', '')}`}
																		alt="Mozilla Users"
																		sx={{ height: 16, opacity: 0.9 }}
																	/>
																)}
															</Box>
													</Box>

													<Box
														className="ledger-arrow"
														sx={{
															flexShrink: 0,
															color: "secondary.main",
															display: "flex",
															alignItems: "center",
															opacity: 0.4,
															transition:
																"transform 0.3s ease, opacity 0.3s ease",
														}}
													>
														<ArrowForward />
													</Box>
												</Box>
											</MotionBox>
										))}
									</Box>
								</Box>
							))}
						</Box>
					)}
				</Container>
			</Box>
		</>
	);
}

Projects.propTypes = {
	limit: PropTypes.number,
	showAppBar: PropTypes.bool,
};
