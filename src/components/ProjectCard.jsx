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
	initialHealth = null,
}) {
	const { isBookmarked, toggleBookmark } = useBookmarksContext();
	const [health, setHealth] = useState(
		() => initialHealth || project.health || null,
	);

	useEffect(() => {
		if (initialHealth || project.health) return;
		let isMounted = true;
		async function getHealth() {
			const data = await fetchProjectHealth(project.githubName);
			if (isMounted) setHealth(data);
		}
		getHealth();
		return () => {
			isMounted = false;
		};
	}, [project.githubName, project.health, initialHealth]);

	const isRecent =
		health?.pushed_at &&
		Date.now() - new Date(health.pushed_at).getTime() <
			30 * 24 * 60 * 60 * 1000;
	const statusColor = isRecent ? "#4caf50" : "#ff9800";
	const statusLabel = isRecent ? "Active" : "Maintenance";
	const bookmarked = isBookmarked(project.githubName);

	return (
		<motion.div
			initial={shouldReduceMotion ? false : { y: 16, opacity: 0 }}
			whileInView={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45 }}
		>
			<RouterLink
				to={`/projects/${project.githubName}`}
				aria-label={`Open project ${project.githubName}`}
				className="ledger-row"
			>
				{!isMobile && (
					<span className="ledger-no">
						No. {String(entryNumber).padStart(2, "0")}
					</span>
				)}

				<div className="ledger-thumb">
					<img src={project.githubImg} alt="" loading="lazy" />
				</div>

				<div className="ledger-info">
					<h5 className="ledger-title">
						{project.githubName}
						{health && (
							<span title={statusLabel} className="inline-flex items-center">
								<span
									className="status-dot"
									style={{ backgroundColor: statusColor }}
								/>
							</span>
						)}
					</h5>

					<p className="ledger-desc">{project.tagline}</p>

					<div className="ledger-meta">
						<span className="text-accent">{project.category}</span>
						<span className="text-secondary">
							{year}
							{project.language ? ` · ${project.language}` : ""}
						</span>
						{project.stars > 0 && (
							<span className="ledger-meta-item">
								<Star size={12} strokeWidth={1.5} color="var(--color-accent)" />
								<span>{project.stars}</span>
							</span>
						)}
						{project.addonMetadata && (
							<span className="ledger-meta-item">
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
							<span className="ledger-meta-item">
								<Tag size={12} strokeWidth={1.5} />
								<span>{health.latestRelease}</span>
							</span>
						)}
						{health?.openIssues !== undefined && (
							<span className="ledger-meta-item">
								<Bug size={12} strokeWidth={1.5} />
								<span>
									{health.openIssues} issue{health.openIssues !== 1 ? "s" : ""}
								</span>
							</span>
						)}
						{health?.size > 0 && (
							<span className="ledger-meta-item">
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
					aria-label={bookmarked ? "Remove bookmark" : "Bookmark project"}
					className={`ledger-bookmark-btn ${bookmarked ? "active" : ""}`}
				>
					<Bookmark
						size={18}
						strokeWidth={1.5}
						fill={bookmarked ? "currentColor" : "none"}
					/>
				</button>

				<div className="ledger-arrow">
					<ArrowRight size={18} strokeWidth={1.5} />
				</div>
			</RouterLink>
		</motion.div>
	);
}

ProjectCard.propTypes = {
	project: PropTypes.object.isRequired,
	entryNumber: PropTypes.number,
	initialHealth: PropTypes.object,
	isMobile: PropTypes.bool,
	shouldReduceMotion: PropTypes.bool,
	year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
