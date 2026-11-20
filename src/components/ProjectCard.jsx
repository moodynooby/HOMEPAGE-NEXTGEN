import {
	ArrowRight,
	Bookmark,
	Bug,
	Download,
	HardDrive,
	Star,
	Tag,
} from "lucide-react";
import { motion } from "motion/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useBookmarksContext } from "@/contexts/BookmarksContext";
import { fetchProjectHealth } from "@/utils/githubUtils";

export default function ProjectCard({
	project,
	entryNumber,
	isMobile,
	shouldReduceMotion,
	year,
}) {
	const { isBookmarked, toggleBookmark } = useBookmarksContext();
	const [health, setHealth] = useState(null);

	useEffect(() => {
		let isMounted = true;
		async function getHealth() {
			const data = await fetchProjectHealth(project.githubName);
			if (isMounted) setHealth(data);
		}
		getHealth();
		return () => {
			isMounted = false;
		};
	}, [project.githubName]);

	const isRecent =
		health?.pushed_at &&
		Date.now() - new Date(health.pushed_at).getTime() <
			30 * 24 * 60 * 60 * 1000;
	const statusColor = isRecent ? "#4caf50" : "#ff9800";
	const statusLabel = isRecent ? "Active" : "Maintenance";

	return (
		<motion.div
			initial={shouldReduceMotion ? false : { y: 16, opacity: 0 }}
			whileInView={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45 }}
			style={{ background: "var(--color-background-body, #fdffda)" }}
		>
			<RouterLink
				to={`/projects/${project.githubName}`}
				aria-label={`Open project ${project.githubName}`}
				style={{
					display: "flex",
					alignItems: "center",
					gap: isMobile ? "1rem" : "1.5rem",
					padding: isMobile ? "1rem 0.5rem" : "1.5rem 0.75rem",
					textDecoration: "none",
					color: "var(--color-text-primary, #38392e)",
					borderTop: "1px solid var(--color-border, rgba(56, 57, 46, 0.10))",
					transition: "background-color 0.2s ease",
				}}
				className="ledger-row"
			>
				{!isMobile && (
					<span
						style={{
							width: "48px",
							flexShrink: 0,
							color: "var(--color-text-secondary, #7d5d53)",
							fontFamily: "var(--font-family-code, 'Work Sans', sans-serif)",
							fontSize: "0.72rem",
							letterSpacing: "0.1em",
							textTransform: "uppercase",
						}}
					>
						No. {String(entryNumber).padStart(2, "0")}
					</span>
				)}

				<div
					className="ledger-thumb"
					style={{
						width: isMobile ? "56px" : "80px",
						height: isMobile ? "56px" : "80px",
						flexShrink: 0,
						background: "var(--color-background-surface, #fdffda)",
						border: "1px solid var(--color-border, rgba(56, 57, 46, 0.10))",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						padding: "6px",
						overflow: "hidden",
					}}
				>
					<img
						src={project.githubImg}
						alt=""
						loading="lazy"
						style={{
							maxWidth: "100%",
							maxHeight: "100%",
							objectFit: "contain",
							filter: "grayscale(100%) contrast(115%)",
							transition: "filter 0.3s ease",
						}}
					/>
				</div>

				<div style={{ flex: 1, minWidth: 0 }}>
					<h5
						style={{
							margin: "0 0 0.25rem",
							fontFamily:
								"var(--font-family-heading, 'Newsreader', Georgia, serif)",
							fontSize: "1.25rem",
							fontWeight: 700,
							display: "flex",
							alignItems: "center",
							gap: "8px",
						}}
					>
						{project.githubName}
						{health && (
							<span
								title={statusLabel}
								style={{ display: "inline-flex", alignItems: "center" }}
							>
								<span
									style={{
										width: "8px",
										height: "8px",
										borderRadius: "50%",
										backgroundColor: statusColor,
										display: "inline-block",
									}}
								/>
							</span>
						)}
					</h5>

					<p
						style={{
							margin: 0,
							fontFamily:
								"var(--font-family-body, 'Noto Serif', Georgia, serif)",
							color: "var(--color-text-secondary, #7d5d53)",
							fontSize: "0.875rem",
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
							lineHeight: 1.5,
						}}
					>
						{project.tagline}
					</p>

					<div
						style={{
							display: "flex",
							alignItems: "center",
							columnGap: "1rem",
							rowGap: "0.25rem",
							marginTop: "0.5rem",
							flexWrap: "wrap",
							fontFamily: "var(--font-family-code, 'Work Sans', sans-serif)",
							fontSize: "0.7rem",
							letterSpacing: "0.1em",
							textTransform: "uppercase",
						}}
					>
						<span style={{ color: "var(--color-accent, #7d5d53)" }}>
							{project.category}
						</span>
						<span style={{ color: "var(--color-text-secondary, #7d5d53)" }}>
							{year}
							{project.language ? ` · ${project.language}` : ""}
						</span>
						{project.stars > 0 && (
							<span
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: "3px",
									color: "var(--color-text-secondary)",
								}}
							>
								<Star size={12} strokeWidth={1.5} color="var(--color-accent)" />
								<span>{project.stars}</span>
							</span>
						)}
						{project.addonMetadata && (
							<span
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: "3px",
									color: "var(--color-text-secondary)",
								}}
							>
								<Download
									size={12}
									strokeWidth={1.5}
									color="var(--color-accent)"
								/>
								<span>
									{project.addonMetadata.averageDailyUsers.toLocaleString()}{" "}
									users
								</span>
							</span>
						)}
						{health?.latestRelease && (
							<span
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: "3px",
									color: "var(--color-text-secondary)",
								}}
							>
								<Tag size={12} strokeWidth={1.5} />
								<span>{health.latestRelease}</span>
							</span>
						)}
						{health?.openIssues !== undefined && (
							<span
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: "3px",
									color: "var(--color-text-secondary)",
								}}
							>
								<Bug size={12} strokeWidth={1.5} />
								<span>
									{health.openIssues} issue{health.openIssues !== 1 ? "s" : ""}
								</span>
							</span>
						)}
						{health?.size > 0 && (
							<span
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: "3px",
									color: "var(--color-text-secondary)",
								}}
							>
								<HardDrive size={12} strokeWidth={1.5} />
								<span>{(health.size / 1024).toFixed(1)} MB</span>
							</span>
						)}
					</div>
				</div>

				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						toggleBookmark(project.githubName);
					}}
					aria-label={
						isBookmarked(project.githubName)
							? "Remove bookmark"
							: "Bookmark project"
					}
					style={{
						background: "transparent",
						border: "none",
						cursor: "pointer",
						padding: "6px",
						color: isBookmarked(project.githubName)
							? "var(--color-accent, #7d5d53)"
							: "var(--color-text-secondary, #7d5d53)",
						display: "flex",
						alignItems: "center",
					}}
				>
					<Bookmark
						size={18}
						strokeWidth={1.5}
						fill={isBookmarked(project.githubName) ? "currentColor" : "none"}
					/>
				</button>

				<div
					className="ledger-arrow"
					style={{
						flexShrink: 0,
						color: "var(--color-accent, #7d5d53)",
						display: "flex",
						alignItems: "center",
						opacity: 0.35,
						transition: "transform 0.2s ease, opacity 0.2s ease",
					}}
				>
					<ArrowRight size={18} strokeWidth={1.5} />
				</div>
			</RouterLink>
		</motion.div>
	);
}

ProjectCard.propTypes = {
	project: PropTypes.object.isRequired,
	entryNumber: PropTypes.number,
	isMobile: PropTypes.bool,
	shouldReduceMotion: PropTypes.bool,
	year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
