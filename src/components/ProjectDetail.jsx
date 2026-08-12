import {
	AccountTree,
	ArrowBack,
	ArrowForward,
	Close,
	Download,
	GitHub,
	Star,
} from "@mui/icons-material";
import {
	Box,
	Chip,
	Container,
	Fab,
	IconButton,
	Paper,
	Skeleton,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { motion } from "motion/react";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";

import projects from "@/content/projects.json";

export default function ProjectDetail({ limit }) {
	const { projectName } = useParams();
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const abortControllerRef = useRef(null);

	const displayedProjects = limit ? projects.slice(0, limit) : projects;
	const currentIndex = displayedProjects.findIndex(
		(p) => p.githubName === projectName,
	);
	const project = displayedProjects[currentIndex];

	const [markdown, setMarkdown] = useState("");
	const [loading, setLoading] = useState(true);
	const [repoStats, setRepoStats] = useState(null);
	const [addonStats, setAddonStats] = useState(null);

	useEffect(() => {
		if (!project) {
			navigate("/projects");
			return;
		}

		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		abortControllerRef.current = new AbortController();

		const cacheKey = `readme_${project.githubName}`;
		const cacheTimeKey = `readme_time_${project.githubName}`;
		const CACHE_DURATION = 1000 * 60 * 60 * 24;

		const cachedContent = localStorage.getItem(cacheKey);
		const cachedTime = localStorage.getItem(cacheTimeKey);

		const { signal } = abortControllerRef.current;
		const hasFreshCache =
			cachedContent &&
			cachedTime &&
			Date.now() - parseInt(cachedTime, 10) < CACHE_DURATION;

		if (hasFreshCache) {
			setMarkdown(cachedContent);
			setLoading(false);
		} else {
			setLoading(true);
			fetch(project.githubContentPath, { signal })
				.then((res) => res.text())
				.then((content) => {
					if (!signal.aborted) {
						setMarkdown(content);
						localStorage.setItem(cacheKey, content);
						localStorage.setItem(cacheTimeKey, Date.now().toString());
						setLoading(false);
					}
				})
				.catch((err) => {
					if (err.name !== "AbortError") {
						setMarkdown("Failed to load content.");
						setLoading(false);
					}
				});
		}

		// Fetch GitHub and Mozilla Add-ons stats for the detail view.
		import("@/utils/githubUtils")
			.then(({ fetchAddonMetadata, fetchRepoMetadata }) =>
				Promise.all([
					fetchRepoMetadata(project.githubName),
					project.addonId ? fetchAddonMetadata(project.addonId) : null,
				]),
			)
			.then(([stats, addonStatsResult]) => {
				if (!signal.aborted) {
					setRepoStats(stats);
					setAddonStats(addonStatsResult);
				}
			})
			.catch((err) => console.error("Failed to load project metadata:", err));

		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, [project, navigate]);

	if (!project) return null;

	return (
		<Box
			sx={{
				minHeight: "100vh",
				background:
					theme.palette.mode === "light"
						? `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`
						: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
				position: "relative",
				overflow: "hidden",
			}}
		>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.3 }}
			>
				<IconButton
					onClick={() => navigate("/projects")}
					sx={{
						position: "fixed",
						top: 20,
						right: 20,
						zIndex: 1300,
						bgcolor: "rgba(255, 255, 255, 0.15)",
						backdropFilter: "blur(10px)",
						color: "white",
						"&:hover": {
							bgcolor: "rgba(255, 255, 255, 0.25)",
						},
					}}
				>
					<Close />
				</IconButton>

				<Container
					maxWidth="lg"
					sx={{
						pt: isMobile ? 8 : 10,
						pb: 8,
					}}
				>
					<motion.div
						initial={{ y: -50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.1, duration: 0.5 }}
					>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 3,
								mb: 4,
								flexDirection: isMobile ? "column" : "row",
							}}
						>
							<Box
								component="img"
								src={project.githubImg}
								alt={project.githubName}
								loading="lazy"
								sx={{
									width: isMobile ? 80 : 120,
									height: isMobile ? 80 : 120,
									borderRadius: 6,
									boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
									bgcolor: "white",
									p: 2,
								}}
							/>
							<Box sx={{ flex: 1, textAlign: isMobile ? "center" : "left" }}>
								<Typography
									variant={isMobile ? "h4" : "h2"}
									sx={{
										color: "white",
										fontWeight: 800,
										mb: 1,
										textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
									}}
								>
									{project.githubName}
								</Typography>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 2,
										flexWrap: "wrap",
										justifyContent: isMobile ? "center" : "flex-start",
									}}
								>
									<IconButton
										component="a"
										href={`https://github.com/moodynooby/${project.githubName}`}
										target="_blank"
										rel="noopener noreferrer"
										sx={{
											color: "white",
											bgcolor: "rgba(255, 255, 255, 0.15)",
											backdropFilter: "blur(10px)",
											"&:hover": {
												bgcolor: "rgba(255, 255, 255, 0.25)",
												transform: "scale(1.05)",
											},
											transition:
												"transform 0.2s ease, background-color 0.2s ease",
										}}
									>
										<GitHub />
									</IconButton>

									{repoStats && (
										<Box sx={{ display: "flex", gap: 1 }}>
											<Chip
												icon={
													<Star
														sx={{
															fontSize: "1rem !important",
															color: "inherit !important",
														}}
													/>
												}
												label={repoStats.stars}
												size="small"
												sx={{
													bgcolor: "rgba(255,255,255,0.1)",
													color: "white",
													backdropFilter: "blur(10px)",
												}}
											/>
											<Chip
												icon={
													<AccountTree
														sx={{
															fontSize: "1rem !important",
															color: "inherit !important",
														}}
													/>
												}
												label={repoStats.forks}
												size="small"
												sx={{
													bgcolor: "rgba(255,255,255,0.1)",
													color: "white",
													backdropFilter: "blur(10px)",
												}}
											/>
										</Box>
									)}

									{project.addonId && (
										<Box
											component="a"
											href={`https://addons.mozilla.org/en-US/firefox/addon/${project.addonId}/`}
											target="_blank"
											rel="noopener noreferrer"
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 1,
												flexWrap: "wrap",
											}}
										>
											<Chip
												label={`${addonStats?.averageDailyUsers?.toLocaleString() || "—"} users`}
												size="small"
												sx={{
													bgcolor: "rgba(255,255,255,0.15)",
													color: "white",
													backdropFilter: "blur(10px)",
												}}
											/>
											{addonStats && (
												<Chip
													label={`${addonStats.weeklyDownloads.toLocaleString()} weekly downloads`}
													size="small"
													sx={{
														bgcolor: "rgba(255,255,255,0.15)",
														color: "white",
														backdropFilter: "blur(10px)",
													}}
												/>
											)}
										</Box>
									)}
								</Box>
							</Box>
						</Box>
					</motion.div>

					<motion.div
						initial={{ y: 50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.3, duration: 0.5 }}
					>
						<Paper
							elevation={8}
							sx={{
								p: isMobile ? 3 : 5,
								borderRadius: 1,
								bgcolor: theme.palette.background.paper,
								backdropFilter: "blur(20px)",
								minHeight: "60vh",
								maxHeight: "70vh",
								overflowY: "auto",
								"&::-webkit-scrollbar": {
									width: "8px",
								},
								"&::-webkit-scrollbar-track": {
									bgcolor: "transparent",
								},
								"&::-webkit-scrollbar-thumb": {
									bgcolor: theme.palette.divider,
									borderRadius: "4px",
									"&:hover": {
										bgcolor: theme.palette.action.hover,
									},
								},
							}}
						>
							{loading ? (
								<Box sx={{ py: 2 }}>
									<Skeleton variant="text" sx={{ fontSize: "3rem", mb: 2 }} />
									<Skeleton variant="rectangular" height={20} sx={{ mb: 1 }} />
									<Skeleton variant="rectangular" height={20} sx={{ mb: 1 }} />
									<Skeleton variant="rectangular" height={20} sx={{ mb: 3 }} />
									<Skeleton variant="text" sx={{ fontSize: "2rem", mb: 2 }} />
									<Skeleton variant="rectangular" height={20} sx={{ mb: 1 }} />
									<Skeleton variant="rectangular" height={20} sx={{ mb: 1 }} />
									<Skeleton variant="rectangular" height={20} sx={{ mb: 1 }} />
								</Box>
							) : (
								<ReactMarkdown
									remarkPlugins={[remarkGfm]}
									components={{
										h1: ({ ...props }) => (
											<Typography
												variant="h3"
												gutterBottom
												sx={{ fontWeight: 700, mt: 3 }}
												{...props}
											/>
										),
										h2: ({ ...props }) => (
											<Typography
												variant="h4"
												gutterBottom
												sx={{ fontWeight: 600, mt: 3 }}
												{...props}
											/>
										),
										h3: ({ ...props }) => (
											<Typography
												variant="h5"
												gutterBottom
												sx={{ fontWeight: 600, mt: 2 }}
												{...props}
											/>
										),
										p: ({ ...props }) => (
											<Typography
												variant="body1"
												sx={{
													lineHeight: 1.8,
													marginBottom: "16px",
												}}
												{...props}
											/>
										),
										a: ({ ...props }) => (
											<a
												style={{
													color: theme.palette.primary.main,
													textDecoration: "none",
													fontWeight: 500,
													borderBottom: `2px solid ${theme.palette.primary.light}`,
												}}
												{...props}
											/>
										),
										code: ({ inline, ...props }) =>
											inline ? (
												<code
													style={{
														backgroundColor: theme.palette.action.hover,
														padding: "2px 6px",
														borderRadius: "4px",
														fontFamily: "monospace",
														fontSize: "0.9em",
													}}
													{...props}
												/>
											) : (
												<pre
													style={{
														backgroundColor:
															theme.palette.mode === "dark"
																? theme.palette.background.default
																: "#1e1e1e",
														color: "#fff",
														padding: "16px",
														borderRadius: "12px",
														overflow: "auto",
														fontFamily: "monospace",
													}}
												>
													<code {...props} />
												</pre>
											),
										ul: ({ ...props }) => (
											<ul
												style={{ paddingLeft: "20px", lineHeight: 1.8 }}
												{...props}
											/>
										),
										ol: ({ ...props }) => (
											<ol
												style={{ paddingLeft: "20px", lineHeight: 1.8 }}
												{...props}
											/>
										),
										blockquote: ({ ...props }) => (
											<Box
												component="blockquote"
												sx={{
													borderLeft: `4px solid ${theme.palette.primary.main}`,
													pl: 2,
													ml: 0,
													fontStyle: "italic",
													color: theme.palette.text.secondary,
												}}
												{...props}
											/>
										),
									}}
								>
									{markdown}
								</ReactMarkdown>
							)}

							{project.chromeStatsId && !loading && (
								<Box
									sx={{
										mt: 6,
										pt: 4,
										borderTop: `1px solid ${theme.palette.divider}`,
									}}
								>
									<Typography
										variant="h5"
										sx={{
											fontWeight: 600,
											mb: 3,
											display: "flex",
											alignItems: "center",
											gap: 1.5,
										}}
									>
										<Download /> Usage Trends
									</Typography>
									<Box
										sx={{
											width: "100%",
											borderRadius: "12px",
											overflow: "hidden",
											boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
											bgcolor:
												theme.palette.mode === "dark" ? "#1a1a1a" : "#fff",
											position: "relative",
											pb: "100%", // Aspect ratio 1:1 for the trends widget
											height: 0,
										}}
									>
										<iframe
											src={`https://chrome-stats.com/embed/${project.chromeStatsId}/trends?theme=${theme.palette.mode}`}
											title={`${project.githubName} Usage Trends`}
											style={{
												position: "absolute",
												top: 0,
												left: 0,
												width: "100%",
												height: "100%",
												border: "none",
											}}
										/>
									</Box>
									<Typography
										variant="caption"
										sx={{
											mt: 2,
											display: "block",
											textAlign: "center",
											color: theme.palette.text.secondary,
										}}
									>
										Live usage and rating data provided by Chrome-Stats.
									</Typography>
								</Box>
							)}
						</Paper>
					</motion.div>
				</Container>

				{currentIndex > 0 && (
					<Fab
						onClick={() =>
							navigate(
								`/projects/${displayedProjects[currentIndex - 1].githubName}`,
							)
						}
						sx={{
							position: "fixed",
							bottom: 40,
							left: isMobile ? 20 : 40,
							bgcolor: "rgba(255, 255, 255, 0.15)",
							backdropFilter: "blur(10px)",
							color: "white",
							"&:hover": {
								bgcolor: "rgba(255, 255, 255, 0.25)",
								transform: "scale(1.1)",
							},
							transition: "transform 0.2s ease, background-color 0.2s ease",
						}}
					>
						<ArrowBack />
					</Fab>
				)}

				{currentIndex < displayedProjects.length - 1 && (
					<Fab
						onClick={() =>
							navigate(
								`/projects/${displayedProjects[currentIndex + 1].githubName}`,
							)
						}
						sx={{
							position: "fixed",
							bottom: 40,
							right: isMobile ? 20 : 40,
							bgcolor: "rgba(255, 255, 255, 0.15)",
							backdropFilter: "blur(10px)",
							color: "white",
							"&:hover": {
								bgcolor: "rgba(255, 255, 255, 0.25)",
								transform: "scale(1.1)",
							},
							transition: "transform 0.2s ease, background-color 0.2s ease",
						}}
					>
						<ArrowForward />
					</Fab>
				)}
			</motion.div>
		</Box>
	);
}

ProjectDetail.propTypes = {
	limit: PropTypes.number,
};
