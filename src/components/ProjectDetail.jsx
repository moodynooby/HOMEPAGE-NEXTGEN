import {
	ArrowLeft as ArrowBack,
	Bookmark,
	Share2 as Share,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { Link as RouterLink, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import ProjectByline from "@/components/ProjectByline";
import ProjectPager from "@/components/ProjectPager";
import ReadmeSkeleton from "@/components/ReadmeSkeleton";
import UsageTrends from "@/components/UsageTrends";
import projects from "@/content/projects.json";
import { useBookmarksContext } from "@/contexts/BookmarksContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import useProjectDetail from "@/hooks/useProjectDetail";

export default function ProjectDetail() {
	const { projectName } = useParams();
	const shouldReduceMotion = useReducedMotion();
	const { mode } = useThemeContext();
	const { isBookmarked, toggleBookmark } = useBookmarksContext();

	const projectIndex = projects.findIndex((p) => p.githubName === projectName);
	const project = projectIndex === -1 ? null : projects[projectIndex];
	const {
		markdown,
		loading,
		repoStats,
		addonStats,
		snackbarOpen,
		handleShare,
	} = useProjectDetail(project);

	if (!project) return null;

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
				<main
					id="main-content"
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
						<div className="flex gap-2">
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
									color: bookmarked ? "var(--color-accent)" : "inherit",
								}}
							>
								<Bookmark
									size={18}
									fill={bookmarked ? "currentColor" : "none"}
								/>
							</button>
						</div>
					</div>

					<p className="editorial-meta text-accent">{project.category}</p>
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

					<ProjectByline
						project={project}
						repoStats={repoStats}
						addonStats={addonStats}
					/>

					{loading ? (
						<ReadmeSkeleton />
					) : (
						<div className="readme-content">
							<ReactMarkdown remarkPlugins={[remarkGfm]}>
								{markdown}
							</ReactMarkdown>
						</div>
					)}

					{project.chromeStatsId && !loading && (
						<UsageTrends project={project} mode={mode} />
					)}
				</main>

				<hr className="editorial-divider" />

				<ProjectPager prevProject={prevProject} nextProject={nextProject} />
			</motion.div>

			{snackbarOpen && (
				<div
					style={{
						position: "fixed",
						bottom: "24px",
						right: "24px",
						background: "var(--color-text-primary)",
						color: "var(--color-background-body)",
						padding: "10px 16px",
						fontSize: "0.85rem",
						fontFamily: "var(--font-family-code)",
						letterSpacing: "0.05em",
						zIndex: 9999,
					}}
				>
					Project link copied to clipboard!
				</div>
			)}
		</div>
	);
}
