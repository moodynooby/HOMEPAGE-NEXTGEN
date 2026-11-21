import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { SECTION_IDS } from "@/config/sections";
import projectsData from "@/content/projects.json";
import { formatNumber } from "@/utils/format";
import { selectFeaturedProjects } from "@/utils/projects";

const featuredProjects = selectFeaturedProjects(projectsData);

export default function FeaturedWork({ featuredMeta, activeRadarProjects }) {
	return (
		<section
			className="editorial-container"
			id={SECTION_IDS.projects}
			style={{ marginTop: "4rem" }}
		>
			<div
				style={{
					display: "flex",
					alignItems: "baseline",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "0.5rem",
					borderTop: "1px solid var(--color-border)",
					paddingTop: "1.25rem",
					marginBottom: "1.5rem",
				}}
			>
				<h2 className="editorial-subheading">Featured Work</h2>
				<p className="editorial-meta">
					{featuredProjects.length} of {projectsData.length} entries
				</p>
			</div>
			<div className="featured-grid">
				{featuredProjects.map((project) => {
					const meta = featuredMeta[project.githubName] || {};
					const isHighlighted = activeRadarProjects.includes(
						project.githubName,
					);
					return (
						<Link
							key={project.githubName}
							to={`/projects/${project.githubName}`}
							className="featured-card"
							style={{
								outline: isHighlighted
									? "2px solid var(--color-chart-adopt)"
									: "none",
								outlineOffset: "4px",
							}}
						>
							<div className="featured-thumb">
								<img src={project.githubImg} alt="" loading="lazy" />
							</div>
							<h3 className="editorial-card-title">{project.githubName}</h3>
							<p
								className="editorial-body"
								style={{
									fontSize: "0.875rem",
									lineHeight: 1.5,
									display: "-webkit-box",
									WebkitLineClamp: 2,
									WebkitBoxOrient: "vertical",
									overflow: "hidden",
									marginBottom: 0,
								}}
							>
								{project.tagline}
							</p>
							<div
								style={{
									display: "flex",
									flexWrap: "wrap",
									alignItems: "center",
									gap: "0.75rem",
									marginTop: "auto",
									paddingTop: "0.5rem",
									fontFamily: "var(--font-family-code)",
									fontSize: "0.7rem",
									letterSpacing: "0.1em",
									textTransform: "uppercase",
								}}
							>
								<span className="text-accent">{project.category}</span>
								{meta.stars > 0 && (
									<span className="text-secondary">
										{formatNumber(meta.stars)} stars
									</span>
								)}
								{meta.addon?.averageDailyUsers > 0 && (
									<span className="text-secondary">
										{formatNumber(meta.addon.averageDailyUsers)} users
									</span>
								)}
							</div>
						</Link>
					);
				})}
			</div>
		</section>
	);
}

FeaturedWork.propTypes = {
	featuredMeta: PropTypes.object.isRequired,
	activeRadarProjects: PropTypes.arrayOf(PropTypes.string).isRequired,
};
