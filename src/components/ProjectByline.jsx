import PropTypes from "prop-types";
import { amoAddonUrl, githubRepoUrl } from "@/config/site";

export default function ProjectByline({ project, repoStats, addonStats }) {
	return (
		<div
			style={{
				display: "flex",
				flexWrap: "wrap",
				alignItems: "center",
				columnGap: "1.5rem",
				rowGap: "0.5rem",
				borderTop: "1px solid var(--color-border)",
				borderBottom: "1px solid var(--color-border)",
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
					href={githubRepoUrl(project.githubName)}
					target="_blank"
					rel="noopener noreferrer"
					className="btn btn-outlined btn-sm"
				>
					Source
				</a>
				{project.addonId && (
					<a
						href={amoAddonUrl(project.addonId)}
						target="_blank"
						rel="noopener noreferrer"
						className="btn btn-outlined btn-sm"
					>
						Add-on
					</a>
				)}
			</div>
		</div>
	);
}

ProjectByline.propTypes = {
	project: PropTypes.object.isRequired,
	repoStats: PropTypes.object,
	addonStats: PropTypes.object,
};
