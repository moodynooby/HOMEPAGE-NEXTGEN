import {
	ArrowBack,
	ArrowForward,
	Bookmark,
	BookmarkBorder,
	Share,
} from "@mui/icons-material";
import {
	Box,
	Button,
	Container,
	Divider,
	IconButton,
	Skeleton,
	Snackbar,
	Tooltip,
	Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { motion, useReducedMotion } from "motion/react";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";

import ButtonAppBar from "@/components/Header";
import TerminalDemo from "@/components/TerminalDemo";
import projects from "@/content/projects.json";
import { useBookmarksContext } from "@/contexts/BookmarksContext";

const MONO_STACK =
	'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

const readmeStyles = (theme) => ({
	"& h1, & h2, & h3, & h4, & h5, & h6": {
		fontFamily: '"Newsreader", serif',
		lineHeight: 1.25,
		marginTop: "2em",
		marginBottom: "0.6em",
	},
	"& h1": { fontSize: "1.9rem", fontWeight: 700 },
	"& h2": { fontSize: "1.55rem", fontWeight: 700, letterSpacing: "-0.01em" },
	"& h3": { fontSize: "1.3rem", fontWeight: 600 },
	"& h4, & h5, & h6": { fontSize: "1.15rem", fontWeight: 600 },
	"& p": {
		lineHeight: 1.8,
		maxWidth: "72ch",
		marginBottom: "1.25em",
		textWrap: "pretty",
	},
	"& ul, & ol": {
		lineHeight: 1.8,
		paddingLeft: "24px",
		marginBottom: "1.25em",
		maxWidth: "68ch",
	},
	"& li + li": { marginTop: "0.35em" },
	"& a": {
		color: "inherit",
		textDecoration: "underline",
		textDecorationThickness: "1px",
		textUnderlineOffset: "4px",
		textDecorationColor: alpha(theme.palette.secondary.main, 0.45),
		transition: "text-decoration-color 0.2s ease",
		"&:hover": {
			textDecorationColor: theme.palette.secondary.main,
		},
	},
	"& strong": { fontWeight: 700 },
	"& hr": {
		border: "none",
		borderTop: `1px solid ${theme.palette.divider}`,
		my: "2.5em",
	},
	"& :not(pre) > code": {
		fontFamily: MONO_STACK,
		fontSize: "0.86em",
		padding: "2px 6px",
		backgroundColor: alpha(theme.palette.text.primary, 0.06),
	},
	"& pre": {
		backgroundColor: alpha(theme.palette.text.primary, 0.04),
		border: `1px solid ${theme.palette.divider}`,
		padding: "16px 20px",
		overflowX: "auto",
		marginBottom: "1.5em",
		lineHeight: 1.7,
		fontSize: "0.88em",
	},
	"& pre code": {
		fontFamily: MONO_STACK,
		backgroundColor: "transparent",
		padding: 0,
	},
	"& blockquote": {
		borderLeft: `2px solid ${theme.palette.divider}`,
		paddingLeft: 24,
		marginLeft: 0,
		marginRight: 0,
		marginBottom: "1.5em",
		fontStyle: "italic",
		color: theme.palette.text.secondary,
		maxWidth: "66ch",
	},
	"& img": {
		maxWidth: "100%",
		height: "auto",
		display: "block",
		marginTop: "1.5em",
		marginBottom: "1.5em",
		border: `1px solid ${theme.palette.divider}`,
	},
	"& table": {
		width: "100%",
		borderCollapse: "collapse",
		marginBottom: "1.5em",
		fontSize: "0.95rem",
		display: "block",
		overflowX: "auto",
	},
	"& th, & td": {
		border: `1px solid ${theme.palette.divider}`,
		padding: "8px 14px",
		textAlign: "left",
	},
	"& th": {
		fontFamily: '"Work Sans Variable", sans-serif',
		fontSize: "0.7rem",
		fontWeight: 600,
		textTransform: "uppercase",
		letterSpacing: "0.1em",
	},
});

export default function ProjectDetail({ limit }) {
	const { projectName } = useParams();
	const navigate = useNavigate();
	const abortControllerRef = useRef(null);
	const shouldReduceMotion = useReducedMotion();
	const theme = useTheme();

	const displayedProjects = limit ? projects.slice(0, limit) : projects;
	const currentIndex = displayedProjects.findIndex(
		(p) => p.githubName === projectName,
	);
	const project = displayedProjects[currentIndex];

	const [markdown, setMarkdown] = useState("");
	const [loading, setLoading] = useState(true);
	const [repoStats, setRepoStats] = useState(null);
	const [addonStats, setAddonStats] = useState(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);

	const { isBookmarked, toggleBookmark } = useBookmarksContext();

	useEffect(() => {
		if (!project) {
			navigate("/projects");
			return undefined;
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
			.catch(() => {});

		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, [project, navigate]);

	if (!project) return null;

	const handleShare = () => {
		navigator.clipboard.writeText(window.location.href);
		setSnackbarOpen(true);
	};

	const prevProject =
		currentIndex > 0 ? displayedProjects[currentIndex - 1] : null;
	const nextProject =
		currentIndex < displayedProjects.length - 1
			? displayedProjects[currentIndex + 1]
			: null;

	return (
		<Box sx={{ minHeight: "100vh" }}>
			<ButtonAppBar />

			<motion.div
				initial={shouldReduceMotion ? false : { opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4 }}
			>
				<Container maxWidth="md" sx={{ pt: { xs: 5, md: 7 }, pb: 10 }}>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							mb: 5,
						}}
					>
						<Button
							component={RouterLink}
							to="/projects"
							color="inherit"
							startIcon={<ArrowBack fontSize="small" />}
						>
							Project Ledger
						</Button>
						<Box sx={{ display: "flex", gap: 1 }}>
							<Tooltip title="Share Project">
								<IconButton
									onClick={handleShare}
									aria-label="Share Project"
									size="small"
								>
									<Share fontSize="small" />
								</IconButton>
							</Tooltip>
							<Tooltip
								title={
									isBookmarked(project.githubName)
										? "Remove bookmark"
										: "Bookmark project"
								}
							>
								<IconButton
									onClick={() => toggleBookmark(project.githubName)}
									aria-label={
										isBookmarked(project.githubName)
											? "Remove bookmark"
											: "Bookmark project"
									}
									size="small"
								>
									{isBookmarked(project.githubName) ? (
										<Bookmark color="primary" fontSize="small" />
									) : (
										<BookmarkBorder fontSize="small" />
									)}
								</IconButton>
							</Tooltip>
						</Box>
					</Box>

					<Typography variant="overline" color="secondary.main">
						{project.category}
					</Typography>
					<Typography
						variant="h1"
						component="h1"
						sx={{ mt: 1, mb: 2, fontSize: { xs: "2.4rem", md: "3.4rem" } }}
					>
						{project.githubName}
					</Typography>
					<Typography
						variant="body1"
						color="text.secondary"
						sx={{ fontStyle: "italic", maxWidth: "56ch", mb: 4 }}
					>
						{project.tagline}
					</Typography>

					<Box
						sx={{
							display: "flex",
							flexWrap: "wrap",
							alignItems: "center",
							columnGap: 2.5,
							rowGap: 1,
							borderTop: "1px solid",
							borderBottom: "1px solid",
							borderColor: "divider",
							py: 1.75,
							mb: 4,
						}}
					>
						{repoStats?.year && (
							<Typography variant="overline" color="text.secondary">
								{repoStats.year}
							</Typography>
						)}
						{repoStats?.language && (
							<Typography variant="overline" color="text.secondary">
								{repoStats.language}
							</Typography>
						)}
						{repoStats?.stars > 0 && (
							<Typography variant="overline" color="text.secondary">
								{repoStats.stars.toLocaleString()} stars
							</Typography>
						)}
						{addonStats?.averageDailyUsers > 0 && (
							<Typography variant="overline" color="text.secondary">
								{addonStats.averageDailyUsers.toLocaleString()} daily users
							</Typography>
						)}

						<Box
							sx={{
								ml: { xs: 0, sm: "auto" },
								display: "flex",
								gap: 1.5,
								flexWrap: "wrap",
							}}
						>
							<Button
								component="a"
								href={`https://github.com/moodynooby/${project.githubName}`}
								target="_blank"
								rel="noopener noreferrer"
								variant="outlined"
								size="small"
							>
								Source
							</Button>
							{project.addonId && (
								<Button
									component="a"
									href={`https://addons.mozilla.org/en-US/firefox/addon/${project.addonId}/`}
									target="_blank"
									rel="noopener noreferrer"
									variant="outlined"
									size="small"
								>
									Add-on
								</Button>
							)}
						</Box>
					</Box>

					{project.cliDemo && <TerminalDemo projectName={project.githubName} />}

					{loading ? (
						<Box
							sx={{ py: 2 }}
							role="status"
							aria-label="Loading project documentation"
						>
							<Skeleton variant="text" sx={{ fontSize: "2.4rem", mb: 2 }} />
							<Skeleton variant="rectangular" height={18} sx={{ mb: 1 }} />
							<Skeleton variant="rectangular" height={18} sx={{ mb: 1 }} />
							<Skeleton
								variant="rectangular"
								height={18}
								width="70%"
								sx={{ mb: 4 }}
							/>
							<Skeleton variant="text" sx={{ fontSize: "1.8rem", mb: 2 }} />
							<Skeleton variant="rectangular" height={18} sx={{ mb: 1 }} />
							<Skeleton
								variant="rectangular"
								height={18}
								width="85%"
								sx={{ mb: 1 }}
							/>
						</Box>
					) : (
						<Box sx={readmeStyles(theme)}>
							<ReactMarkdown remarkPlugins={[remarkGfm]}>
								{markdown}
							</ReactMarkdown>
						</Box>
					)}

					{project.chromeStatsId && !loading && (
						<Box
							sx={{
								mt: 7,
								pt: 4,
								borderTop: "1px solid",
								borderColor: "divider",
							}}
						>
							<Typography variant="h3" component="h2" gutterBottom>
								Usage Trends
							</Typography>
							<Box
								sx={{
									width: "100%",
									maxWidth: 640,
									border: "1px solid",
									borderColor: "divider",
									bgcolor: "background.paper",
									position: "relative",
									pb: "75%",
									height: 0,
								}}
							>
								<iframe
									src={`https://chrome-stats.com/embed/${project.chromeStatsId}/trends?theme=${theme.palette.mode}`}
									title={`${project.githubName} usage trends`}
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
								color="text.secondary"
								sx={{ mt: 1.5, display: "block" }}
							>
								Live usage and rating data provided by Chrome-Stats.
							</Typography>
						</Box>
					)}
				</Container>

				<Divider />

				<Container maxWidth="md">
					<Box sx={{ display: "flex", flexWrap: "wrap" }}>
						{prevProject ? (
							<Button
								component={RouterLink}
								to={`/projects/${prevProject.githubName}`}
								color="inherit"
								startIcon={<ArrowBack fontSize="small" />}
								sx={{
									flex: "1 1 280px",
									justifyContent: "flex-start",
									borderRight: { md: "1px solid" },
									borderColor: "divider",
									py: 3.5,
								}}
							>
								<Box sx={{ textAlign: "left" }}>
									<Typography
										variant="overline"
										color="text.secondary"
										component="span"
										display="block"
									>
										Previous entry
									</Typography>
									{prevProject.githubName}
								</Box>
							</Button>
						) : (
							<Box
								sx={{
									flex: "1 1 280px",
									borderRight: { md: "1px solid" },
									borderColor: "divider",
								}}
							/>
						)}
						{nextProject ? (
							<Button
								component={RouterLink}
								to={`/projects/${nextProject.githubName}`}
								color="inherit"
								endIcon={<ArrowForward fontSize="small" />}
								sx={{
									flex: "1 1 280px",
									justifyContent: "flex-end",
									textAlign: "right",
									py: 3.5,
								}}
							>
								<Box>
									<Typography
										variant="overline"
										color="text.secondary"
										component="span"
										display="block"
									>
										Next entry
									</Typography>
									{nextProject.githubName}
								</Box>
							</Button>
						) : (
							<Box sx={{ flex: "1 1 280px" }} />
						)}
					</Box>
				</Container>
			</motion.div>
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={3000}
				onClose={() => setSnackbarOpen(false)}
				message="Project link copied to clipboard!"
			/>
		</Box>
	);
}

ProjectDetail.propTypes = {
	limit: PropTypes.number,
};
