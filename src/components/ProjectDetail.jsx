import {
	ArrowLeft as ArrowBack,
	Bookmark,
	Share2 as Share,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import projects from "@/content/projects.json";
import { useBookmarksContext } from "@/contexts/BookmarksContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { readCacheEntry, writeCacheEntry } from "@/utils/cache";
import { fetchAddonMetadata, fetchRepoMetadata } from "@/utils/githubUtils";

export default function ProjectDetail() {
	const { projectName } = useParams();
	const navigate = useNavigate();
	const abortControllerRef = useRef(null);
	const shouldReduceMotion = useReducedMotion();
	const { mode } = useThemeContext();

	const projectIndex = projects.findIndex((p) => p.githubName === projectName);
	const project = projectIndex === -1 ? null : projects[projectIndex];

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

		abortControllerRef.current?.abort();
		const controller = new AbortController();
		abortControllerRef.current = controller;
		const { signal } = controller;

		const cacheKey = `readme_${project.githubName}`;
		const cachedContent = readCacheEntry(cacheKey, 24 * 60 * 60 * 1000);

		if (cachedContent) {
			setMarkdown(cachedContent);
			setLoading(false);
		} else {
			setLoading(true);
			fetch(project.githubContentPath, { signal })
				.then((res) => res.text())
				.then((content) => {
					if (!signal.aborted) {
						setMarkdown(content);
						writeCacheEntry(cacheKey, content);
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

		Promise.all([
			fetchRepoMetadata(project.githubName),
			project.addonId ? fetchAddonMetadata(project.addonId) : null,
		])
			.then(([stats, addonStatsResult]) => {
				if (!signal.aborted) {
					setRepoStats(stats);
					setAddonStats(addonStatsResult);
				}
			})
			.catch(() => {});

		return () => {
			controller.abort();
		};
	}, [project, navigate]);

	if (!project) return null;

	const handleShare = () => {
		navigator.clipboard?.writeText(window.location.href);
		setSnackbarOpen(true);
		setTimeout(() => setSnackbarOpen(false), 3000);
	};

	const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
	const nextProject =
		projectIndex > -1 && projectIndex < projects.length - 1
			? projects[projectIndex + 1]
			: null;

	const bookmarked = isBookmarked(project.githubName);

	return (
		<div style={{ minHeight: "100vh" }}>
			<Header />

			<motion.div
				initial={shouldReduceMotion ? false : { opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4 }}
			>
				<div
					className="editorial-container"
					style={{
						maxWidth: "800px",
						paddingTop: "3rem",
						paddingBottom: "5rem",
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "2.5rem",
						}}
					>
						<RouterLink
							to="/projects"
							className="btn btn-outlined btn-sm"
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "6px",
							}}
						>
							<ArrowBack size={14} />
							<span>Project Ledger</span>
						</RouterLink>
						<div style={{ display: "flex", gap: "0.5rem" }}>
							<button
								type="button"
								onClick={handleShare}
								aria-label="Share Project"
								className="icon-btn"
								title="Share Project"
							>
								<Share size={18} />
							</button>
							<button
								type="button"
								onClick={() => toggleBookmark(project.githubName)}
								aria-label={bookmarked ? "Remove bookmark" : "Bookmark project"}
								className="icon-btn"
								title={bookmarked ? "Remove bookmark" : "Bookmark project"}
								style={{
									color: bookmarked
										? "var(--color-accent, #7d5d53)"
										: "inherit",
								}}
							>
								<Bookmark
									size={18}
									fill={bookmarked ? "currentColor" : "none"}
								/>
							</button>
						</div>
					</div>

					<p
						className="editorial-meta"
						style={{ color: "var(--color-accent, #7d5d53)" }}
					>
						{project.category}
					</p>
					<h1
						className="editorial-headline"
						style={{
							marginTop: "0.5rem",
							marginBottom: "1rem",
							fontSize: "clamp(2.4rem, 4vw, 3.4rem)",
						}}
					>
						{project.githubName}
					</h1>
					<p
						className="editorial-body"
						style={{
							fontStyle: "italic",
							maxWidth: "56ch",
							marginBottom: "2rem",
						}}
					>
						{project.tagline}
					</p>

					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							alignItems: "center",
							columnGap: "1.5rem",
							rowGap: "0.5rem",
							borderTop: "1px solid var(--color-border, var(--hairline-rule))",
							borderBottom:
								"1px solid var(--color-border, var(--hairline-rule))",
							padding: "1rem 0",
							marginBottom: "2rem",
						}}
					>
						{repoStats?.year && (
							<span className="editorial-meta">{repoStats.year}</span>
						)}
						{repoStats?.language && (
							<span className="editorial-meta">{repoStats.language}</span>
						)}
						{repoStats?.stars > 0 && (
							<span className="editorial-meta">
								{repoStats.stars.toLocaleString()} stars
							</span>
						)}
						{addonStats?.averageDailyUsers > 0 && (
							<span className="editorial-meta">
								{addonStats.averageDailyUsers.toLocaleString()} daily users
							</span>
						)}

						<div
							style={{
								marginLeft: "auto",
								display: "flex",
								gap: "0.75rem",
								flexWrap: "wrap",
							}}
						>
							<a
								href={`https://github.com/moodynooby/${project.githubName}`}
								target="_blank"
								rel="noopener noreferrer"
								className="btn btn-outlined btn-sm"
							>
								Source
							</a>
							{project.addonId && (
								<a
									href={`https://addons.mozilla.org/en-US/firefox/addon/${project.addonId}/`}
									target="_blank"
									rel="noopener noreferrer"
									className="btn btn-outlined btn-sm"
								>
									Add-on
								</a>
							)}
						</div>
					</div>

					{loading ? (
						<div
							style={{ padding: "1rem 0" }}
							role="status"
							aria-label="Loading project documentation"
						>
							<div
								className="skeleton"
								style={{ height: "40px", width: "50%", marginBottom: "1rem" }}
							/>
							<div
								className="skeleton"
								style={{ height: "18px", marginBottom: "0.5rem" }}
							/>
							<div
								className="skeleton"
								style={{ height: "18px", marginBottom: "0.5rem" }}
							/>
							<div
								className="skeleton"
								style={{ height: "18px", width: "70%", marginBottom: "2rem" }}
							/>
							<div
								className="skeleton"
								style={{ height: "30px", width: "40%", marginBottom: "1rem" }}
							/>
							<div
								className="skeleton"
								style={{ height: "18px", marginBottom: "0.5rem" }}
							/>
							<div
								className="skeleton"
								style={{ height: "18px", width: "85%" }}
							/>
						</div>
					) : (
						<div className="readme-content">
							<ReactMarkdown remarkPlugins={[remarkGfm]}>
								{markdown}
							</ReactMarkdown>
						</div>
					)}

					{project.chromeStatsId && !loading && (
						<div
							style={{
								marginTop: "3.5rem",
								paddingTop: "2rem",
								borderTop:
									"1px solid var(--color-border, var(--hairline-rule))",
							}}
						>
							<h2
								className="editorial-subheading"
								style={{ marginBottom: "1rem" }}
							>
								Usage Trends
							</h2>
							<div
								style={{
									width: "100%",
									maxWidth: "640px",
									border: "1px solid var(--color-border, var(--hairline-rule))",
									background: "var(--color-background-surface, #fdffda)",
									position: "relative",
									paddingBottom: "75%",
									height: 0,
								}}
							>
								<iframe
									src={`https://chrome-stats.com/embed/${project.chromeStatsId}/trends?theme=${mode === "dark" ? "dark" : "light"}`}
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
							</div>
							<p
								className="editorial-meta"
								style={{ marginTop: "0.75rem", display: "block" }}
							>
								Live usage and rating data provided by Chrome-Stats.
							</p>
						</div>
					)}
				</div>

				<hr className="editorial-divider" />

				<div className="editorial-container" style={{ maxWidth: "800px" }}>
					<div style={{ display: "flex", flexWrap: "wrap" }}>
						{prevProject ? (
							<RouterLink
								to={`/projects/${prevProject.githubName}`}
								className="btn btn-outlined"
								style={{
									flex: "1 1 280px",
									justifyContent: "flex-start",
									textAlign: "left",
									padding: "1.75rem 1rem",
									borderRight:
										"1px solid var(--color-border, var(--hairline-rule))",
								}}
							>
								<div>
									<span className="editorial-meta" style={{ display: "block" }}>
										Previous entry
									</span>
									{prevProject.githubName}
								</div>
							</RouterLink>
						) : (
							<div
								style={{
									flex: "1 1 280px",
									borderRight:
										"1px solid var(--color-border, var(--hairline-rule))",
								}}
							/>
						)}
						{nextProject ? (
							<RouterLink
								to={`/projects/${nextProject.githubName}`}
								className="btn btn-outlined"
								style={{
									flex: "1 1 280px",
									justifyContent: "flex-end",
									textAlign: "right",
									padding: "1.75rem 1rem",
								}}
							>
								<div>
									<span className="editorial-meta" style={{ display: "block" }}>
										Next entry
									</span>
									{nextProject.githubName}
								</div>
							</RouterLink>
						) : (
							<div style={{ flex: "1 1 280px" }} />
						)}
					</div>
				</div>
			</motion.div>

			{snackbarOpen && (
				<div
					style={{
						position: "fixed",
						bottom: "24px",
						right: "24px",
						background: "var(--color-primary, #38392e)",
						color: "var(--color-background-body, #fdffda)",
						padding: "10px 16px",
						fontSize: "0.85rem",
						fontFamily: "var(--font-family-code, 'Work Sans', sans-serif)",
						letterSpacing: "0.05em",
						zIndex: 9999,
						boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
					}}
				>
					Project link copied to clipboard!
				</div>
			)}
		</div>
	);
}
