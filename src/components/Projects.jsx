import { ArrowForward, Download, Search, Star } from "@mui/icons-material";
import {
	Alert,
	Box,
	Chip,
	Container,
	InputAdornment,
	Skeleton,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { motion, useReducedMotion } from "motion/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import ButtonAppBar from "@/components/Header";
import projectsData from "@/content/projects.json";
import {
	fetchAddonMetadata,
	fetchRepoMetadata,
	groupProjectsByYear,
} from "@/utils/githubUtils";

const MotionBox = motion.create(Box);

export default function Projects({ limit, showAppBar = true }) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState("");
	const location = useLocation();
	const [activeCategory, setActiveCategory] = useState("All");

	const [searchQuery, setSearchQuery] = useState(() => {
		const params = new URLSearchParams(location.search);
		return params.get("q") || "";
	});
	const shouldReduceMotion = useReducedMotion();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const q = params.get("q");
		if (q !== null) {
			setSearchQuery(q);
		}
	}, [location.search]);

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
					setProjects(limit ? sortedProjects.slice(0, limit) : sortedProjects);
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
				<Container maxWidth="lg">
					<Skeleton variant="text" width="40%" height={64} sx={{ mb: 8 }} />
					{[1, 2, 3].map((item) => (
						<Box
							key={item}
							sx={{
								display: "flex",
								gap: 3,
								py: 3,
								borderTop: "1px solid",
								borderColor: "divider",
							}}
						>
							<Skeleton
								variant="rectangular"
								width={88}
								height={88}
								sx={{ flexShrink: 0 }}
							/>
							<Box sx={{ flex: 1 }}>
								<Skeleton variant="text" width="30%" />
								<Skeleton variant="text" width="70%" />
								<Skeleton variant="text" width="22%" />
							</Box>
						</Box>
					))}
				</Container>
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
	const filteredProjects = projects.filter(
		(project) =>
			(activeCategory === "All" || project.category === activeCategory) &&
			matchesQuery(project),
	);

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
					pt: showAppBar ? { xs: 7, md: 10 } : 0,
					pb: 10,
					position: "relative",
					minHeight: "100vh",
				}}
			>
				<Container maxWidth="lg">
					<motion.div
						initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={
							shouldReduceMotion ? { duration: 0 } : { duration: 0.7 }
						}
					>
						<Box
							sx={{
								display: "flex",
								alignItems: "baseline",
								justifyContent: "space-between",
								flexWrap: "wrap",
								gap: 1,
								borderBottom: "1px solid",
								borderColor: "divider",
								pb: 3,
								mb: 5,
							}}
						>
							<Typography variant="h2" component="h1">
								The Project Ledger
							</Typography>
							<Typography variant="overline" color="text.secondary">
								A running index of shipped work
							</Typography>
						</Box>

						<TextField
							fullWidth
							variant="standard"
							value={searchQuery}
							onChange={(event) => setSearchQuery(event.target.value)}
							placeholder="Filter by name, tagline, or technology"
							aria-label="Search projects"
							sx={{ maxWidth: 560, mb: 4 }}
							slotProps={{
								input: {
									startAdornment: (
										<InputAdornment position="start">
											<Search fontSize="small" />
										</InputAdornment>
									),
									sx: { fontFamily: '"Work Sans Variable", sans-serif' },
								},
							}}
						/>

						<Box
							sx={{
								display: "flex",
								flexWrap: "wrap",
								gap: 1,
								mb: 7,
							}}
						>
							{categories.map((category) => {
								const count =
									category === "All"
										? projects.length
										: categoryCounts[category];
								return (
									<Chip
										key={category}
										label={`${category} · ${count}`}
										onClick={() => setActiveCategory(category)}
										variant={
											activeCategory === category ? "filled" : "outlined"
										}
										color={activeCategory === category ? "primary" : "default"}
									/>
								);
							})}
						</Box>
					</motion.div>

					{filteredProjects.length === 0 ? (
						<Typography
							variant="body1"
							sx={{ textAlign: "center", py: 10, color: "text.secondary" }}
						>
							Nothing filed under this heading yet.
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
										bgcolor: "divider",
										transform: "translateX(-50%)",
									}}
								/>
							)}

							{years.map((year) => (
								<Box
									key={year}
									sx={{
										mb: { xs: 7, md: 12 },
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										position: "relative",
									}}
								>
									<MotionBox
										initial={
											shouldReduceMotion ? false : { scale: 0.9, opacity: 0 }
										}
										whileInView={
											shouldReduceMotion ? undefined : { scale: 1, opacity: 1 }
										}
										viewport={{ once: true }}
										sx={{
											bgcolor: "background.default",
											border: "1px solid",
											borderColor: "divider",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: 128,
											height: 128,
											borderRadius: "50%",
											mb: 7,
											zIndex: 2,
										}}
									>
										<Typography
											variant="h3"
											component="p"
											sx={{ fontStyle: "italic", fontWeight: 400 }}
										>
											{year}
										</Typography>
									</MotionBox>

									<Box sx={{ width: "100%" }}>
										{groupedProjects[year].map((project) => (
											<MotionBox
												key={project.githubName}
												initial={
													shouldReduceMotion ? false : { y: 16, opacity: 0 }
												}
												whileInView={
													shouldReduceMotion ? undefined : { y: 0, opacity: 1 }
												}
												viewport={{ once: true }}
												transition={
													shouldReduceMotion
														? { duration: 0 }
														: { duration: 0.45 }
												}
												sx={{ bgcolor: "background.default" }}
											>
												<Box
													component={RouterLink}
													to={`/projects/${project.githubName}`}
													aria-label={`Open project ${project.githubName}`}
													sx={{
														display: "flex",
														alignItems: "center",
														gap: { xs: 2.5, md: 4 },
														py: { xs: 2.5, md: 3.5 },
														px: { xs: 1.5, md: 2 },
														cursor: "pointer",
														textDecoration: "none",
														color: "text.primary",
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
														"&:hover .ledger-thumb img": {
															filter: "grayscale(0%) contrast(100%)",
														},
													}}
												>
													{!isMobile && (
														<Typography
															variant="overline"
															sx={{
																width: 56,
																flexShrink: 0,
																color: "text.secondary",
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
														className="ledger-thumb"
														sx={{
															width: { xs: 56, md: 88 },
															height: { xs: 56, md: 88 },
															flexShrink: 0,
															bgcolor: "background.paper",
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
															alt=""
															loading="lazy"
															sx={{
																maxWidth: "100%",
																maxHeight: "100%",
																objectFit: "contain",
																filter: "grayscale(100%) contrast(115%)",
																transition: "filter 0.5s ease-in-out",
															}}
														/>
													</Box>

													<Box sx={{ flex: 1, minWidth: 0 }}>
														<Typography variant="h5" sx={{ mb: 0.5 }}>
															{project.githubName}
														</Typography>
														<Typography
															variant="body2"
															color="text.secondary"
															sx={{
																display: "-webkit-box",
																WebkitLineClamp: 2,
																WebkitBoxOrient: "vertical",
																overflow: "hidden",
															}}
														>
															{project.tagline}
														</Typography>
														<Box
															sx={{
																display: "flex",
																alignItems: "center",
																columnGap: 1.5,
																rowGap: 0.5,
																mt: 1,
																flexWrap: "wrap",
															}}
														>
															<Typography
																variant="overline"
																color="secondary.main"
																lineHeight={1}
															>
																{project.category}
															</Typography>
															<Typography
																variant="overline"
																color="text.secondary"
																lineHeight={1}
																sx={{ opacity: 0.85 }}
															>
																{year}
																{project.language
																	? ` · ${project.language}`
																	: ""}
															</Typography>
															{project.stars > 0 && (
																<Box
																	sx={{
																		display: "flex",
																		alignItems: "center",
																		gap: 0.5,
																	}}
																>
																	<Star
																		sx={{
																			fontSize: "0.8rem",
																			color: "secondary.main",
																		}}
																	/>
																	<Typography
																		variant="overline"
																		color="text.secondary"
																		lineHeight={1}
																	>
																		{project.stars}
																	</Typography>
																</Box>
															)}
															{project.addonMetadata && (
																<Box
																	sx={{
																		display: "flex",
																		alignItems: "center",
																		gap: 0.5,
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
																		color="text.secondary"
																		lineHeight={1}
																	>
																		{project.addonMetadata.averageDailyUsers.toLocaleString()}{" "}
																		users
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
															opacity: 0.35,
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
