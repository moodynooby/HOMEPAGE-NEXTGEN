import PropTypes from "prop-types";
import { chromeStatsTrendsUrl } from "@/config/site";

export default function UsageTrends({ project, effectiveMode }) {
	return (
		<div
			style={{
				marginTop: "3.5rem",
				paddingTop: "2rem",
				borderTop: "1px solid var(--color-border)",
			}}
		>
			<h2 className="editorial-subheading mb-4">Usage Trends</h2>
			<div
				style={{
					width: "100%",
					maxWidth: "640px",
					border: "1px solid var(--color-border)",
					background: "var(--color-background-surface)",
					position: "relative",
					paddingBottom: "75%",
					height: 0,
				}}
			>
				<iframe
					src={chromeStatsTrendsUrl(project.chromeStatsId, effectiveMode)}
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
	);
}

UsageTrends.propTypes = {
	project: PropTypes.object.isRequired,
	effectiveMode: PropTypes.string,
};
