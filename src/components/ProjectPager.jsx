import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";

export default function ProjectPager({ prevProject, nextProject }) {
	return (
		<div className="editorial-container" style={{ maxWidth: "800px" }}>
			<div className="flex flex-wrap">
				{prevProject ? (
					<RouterLink
						to={`/projects/${prevProject.githubName}`}
						className="btn btn-outlined"
						style={{
							flex: "1 1 280px",
							justifyContent: "flex-start",
							textAlign: "left",
							padding: "1.75rem 1rem",
							borderRight: "1px solid var(--color-border)",
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
							borderRight: "1px solid var(--color-border)",
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
	);
}

ProjectPager.propTypes = {
	prevProject: PropTypes.object,
	nextProject: PropTypes.object,
};
