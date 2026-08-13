import {
	ArrowForward,
	Download,
	GitHub,
	OpenInNew,
	PushPin,
	Schedule,
	Search,
	Star,
	Visibility,
} from "@mui/icons-material";
import {
	Alert,
	alpha,
	Box,
	Button,
	Chip,
	Container,
	InputAdornment,
	Skeleton,
	TextField,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { motion, useReducedMotion } from "motion/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonAppBar from "@/components/Header";
import projectsData from "@/content/projects.json";
import {
	fetchAddonMetadata,
	fetchRepoMetadata,
	groupProjectsByYear,
} from "@/utils/githubUtils";

const MotionBox = motion.create(Box);

export default function Projects({ limit, showAppBar = true }) {
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState("");
	const [activeCategory, setActiveCategory] = useState("All");
	const [searchQuery, setSearchQuery] = useState("");
	const shouldReduceMotion = useReducedMotion();

	useEffect(() => {
		let isMounted = true;

		async function loadProjects() {
			try {
				const projectsWithMetadata = await Promise.all(
					projectsData.map(async (project) => {
						const [metadata, addonMetadata] = await Promise.all([
							fetchRepoMetadata(project.githubName),
							project.addonId ? fetchAddonMetadata(project.addonId) : null,
						]);
						return {
							...project,
							year: metadata?.year || new Date().getFullYear(),
							date: metadata?.created_at || "",
							language: metadata?.language || "",
							stars: metadata?.stars || 0,
							forks: metadata?.forks || 0,
							addonMetadata,
						};
					}),
				);
				const sortedProjects = projectsWithMetadata.sort(
					(a, b) => new Date(b.date) - new Date(a.date),
				);

				if (isMounted) {
					const featuredFirst = [
						...sortedProjects.filter((project) => project.featured),
						...sortedProjects.filter((project) => !project.featured),
					];
					setProjects(limit ? featuredFirst.slice(0, limit) : featuredFirst);
					setLoadError("");
				}
			} catch (error) {
				console.error("Unable to load projects", error);
				if (isMounted) {
					setLoadError("Projects could not be loaded. Please try again.");
				}
			} finally {
				if (isMounted) setLoading(false);
			}
		}

		loadProjects();
		return () => {
			isMounted = false;
		};
	}, [limit]);

	if (loading) {
		return (
			<Box
				sx={{ minHeight: "60vh", py: 8 }}
				role="status"
				aria-label="Loading projects"
			>
				<Skeleton
					variant="text"
					width="55%"
					height={72}
					sx={{ mx: "auto", mb: 6 }}
				/>
				{[1, 2, 3].map((item) => (
					<Box
						key={item}
						sx={{
							display: "flex",
							gap: 2,
							py: 3,
							borderTop: "1px solid",
							borderColor: "divider",
						}}
					>
						<Skeleton variant="rectangular" width={88} height={88} />
						<Box sx={{ flex: 1 }}>
							<Skeleton variant="text" width="35%" />
							<Skeleton variant="text" width="80%" />
							<Skeleton variant="text" width="25%" />
						</Box>
					</Box>
				))}
			</Box>
		);
	}

	if (loadError) {
		return (
			<Box sx={{ minHeight: "60vh", py: 8 }}>
				<Alert severity="error">{loadError}</Alert>
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
	const normalizedQuery = searchQuery.trim().toLowerCase();
	const matchesQuery = (project) =>
		!normalizedQuery ||
		[project.githubName, project.tagline, project.category, project.language]
			.filter(Boolean)
			.some((value) => value.toLowerCase().includes(normalizedQuery));
	const featuredProjects = projects
		.filter((project) => project.featured)
		.slice(0, 3);
	const filteredProjects = projects.filter(
		(project) =>
			(activeCategory === "All" || project.category === activeCategory) &&
			matchesQuery(project),
	);
	const totalStars = projects.reduce(
		(total, project) => total + project.stars,
		0,
	);
	const totalAddonUsers = projects.reduce(
		(total, project) => total + (project.addonMetadata?.averageDailyUsers || 0),
		0,
	);
	const technologyMix = Object.entries(
		projects.reduce((counts, project) => {
			const technology = project.language || project.category;
			counts[technology] = (counts[technology] || 0) + 1;
			return counts;
		}, {}),
	).sort(([, countA], [, countB]) => countB - countA);

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
						initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={
							shouldReduceMotion ? { duration: 0 } : { duration: 0.8 }
						}
					>
						<Typography
							variant="h2"
							sx={{
								textAlign: "center",
								mb: 3,
								textTransform: "uppercase",
								letterSpacing: "-0.02em",
								fontSize: { xs: "1.9rem", sm: "2.5rem", md: "3.25rem" },
								lineHeight: 1.15,
							}}
						>
							The Personal Project Ledger
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ textAlign: "center", mb: { xs: 5, md: 10 } }}
						>
							{projects.length} projects · {totalStars} GitHub stars ·{" "}
							{totalAddonUsers.toLocaleString()} active Firefox users
						</Typography>
					</motion.div>

					{technologyMix.length > 0 && (
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								gap: 1,
								flexWrap: "wrap",
								mb: 5,
							}}
						>
							{technologyMix.slice(0, 6).map(([technology, count]) => (
								<Chip
									key={technology}
									label={`${technology} · ${count}`}
									size="small"
									variant="outlined"
								/>
							))}
						</Box>
					)}

					<TextField
						fullWidth
						value={searchQuery}
						onChange={(event) => setSearchQuery(event.target.value)}
						placeholder="Search projects, categories, or technologies"
						aria-label="Search projects"
						sx={{ maxWidth: 680, display: "block", mx: "auto", mb: 5 }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Search fontSize="small" />
								</InputAdornment>
							),
						}}
					/>

					{!normalizedQuery && featuredProjects.length > 0 && (
						<Box sx={{ mb: { xs: 5, md: 8 } }}>
							<Typography
								variant="h4"
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									mb: 3,
									fontSize: { xs: "1.35rem", md: "2rem" },
								}}
							>
								<PushPin color="secondary" /> Featured Projects
							</Typography>
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
									gap: 2,
								}}
							>
								{featuredProjects.map((project) => (
									<Box
										key={project.githubName}
										component="article"
										onClick={() => navigate(`/projects/${project.githubName}`)}
										onKeyDown={(event) => {
											if (event.key === "Enter" || event.key === " ") {
												navigate(`/projects/${project.githubName}`);
											}
										}}
										tabIndex={0}
										role="button"
										sx={{
											p: 2.5,
											border: "1px solid",
											borderColor: "divider",
											cursor: "pointer",
											transition:
												"transform 0.2s ease, background-color 0.2s ease",
											"&:hover": {
												transform: "translateY(-4px)",
												bgcolor: "action.hover",
											},
										}}
									>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 1.5,
												mb: 1.5,
											}}
										>
											<Box
												component="img"
												src={project.githubImg}
												alt=""
												sx={{ width: 44, height: 44, objectFit: "contain" }}
											/>
											<Typography variant="h6">{project.githubName}</Typography>
										</Box>
										<Typography
											variant="body2"
											color="text.secondary"
											sx={{ lineHeight: 1.6 }}
										>
											{project.tagline}
										</Typography>
										<Typography
											variant="overline"
											color="secondary.main"
											sx={{ display: "block", mt: 2 }}
										>
											{project.category}
										</Typography>
										<Box
											sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}
											onClick={(event) => event.stopPropagation()}
										>
											<Button
												component="a"
												href={`https://github.com/moodynooby/${project.githubName}`}
												target="_blank"
												rel="noopener noreferrer"
												size="small"
												startIcon={<GitHub fontSize="small" />}
											>
												Code
											</Button>
											{project.addonId && (
												<Button
													component="a"
													href={`https://addons.mozilla.org/en-US/firefox/addon/${project.addonId}/`}
													target="_blank"
													rel="noopener noreferrer"
													size="small"
													startIcon={<OpenInNew fontSize="small" />}
												>
													Firefox Add-on
												</Button>
											)}
										</Box>
									</Box>
								))}
							</Box>
						</Box>
					)}

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
										mb: { xs: 6, md: 12 },
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										position: "relative",
									}}
								>
									<MotionBox
										initial={
											shouldReduceMotion ? false : { scale: 0.8, opacity: 0 }
										}
										whileInView={
											shouldReduceMotion ? undefined : { scale: 1, opacity: 1 }
										}
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
												initial={
													shouldReduceMotion ? false : { y: 24, opacity: 0 }
												}
												whileInView={
													shouldReduceMotion ? undefined : { y: 0, opacity: 1 }
												}
												viewport={{ once: true }}
												transition={
													shouldReduceMotion
														? { duration: 0 }
														: { duration: 0.5 }
												}
												sx={{ bgcolor: "background.default" }}
											>
												<Box
													component="article"
													role="link"
													tabIndex={0}
													aria-label={`Open project ${project.githubName}`}
													onClick={() =>
														navigate(`/projects/${project.githubName}`)
													}
													onKeyDown={(event) => {
														if (event.key === "Enter" || event.key === " ") {
															event.preventDefault();
															navigate(`/projects/${project.githubName}`);
														}
													}}
													sx={{
														display: "flex",
														alignItems: "center",
														gap: { xs: 2.5, md: 4 },
														py: { xs: 2.5, md: 3.5 },
														px: { xs: 1.5, md: 2 },
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
																<Box
																	sx={{
																		display: "flex",
																		alignItems: "center",
																		gap: 0.5,
																		opacity: 0.8,
																	}}
																>
																	<Star
																		sx={{
																			fontSize: "0.75rem",
																			color: "secondary.main",
																		}}
																	/>
																	<Typography
																		variant="overline"
																		sx={{ fontSize: "0.68rem", lineHeight: 1 }}
																	>
																		{project.stars}
																	</Typography>
																</Box>
															)}

															{/* Native Mozilla Add-ons metrics */}
															{project.addonMetadata && (
																<Box
																	sx={{
																		display: "flex",
																		alignItems: "center",
																		gap: 0.75,
																		flexWrap: "wrap",
																	}}
																>
																	<Download
																		sx={{
																			fontSize: "0.8rem",
																			color: "secondary.main",
																		}}
																	/>
																	<Typography
																		variant="overline"
																		sx={{ fontSize: "0.68rem", lineHeight: 1 }}
																	>
																		{project.addonMetadata.averageDailyUsers.toLocaleString()}{" "}
																		users
																	</Typography>
																	<Typography
																		variant="overline"
																		sx={{
																			fontSize: "0.68rem",
																			lineHeight: 1,
																			opacity: 0.7,
																		}}
																	>
																		{project.addonMetadata.weeklyDownloads.toLocaleString()}{" "}
																		weekly downloads
																	</Typography>
																</Box>
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
