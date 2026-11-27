import { Calendar, GitCommit } from "lucide-react";
import PropTypes from "prop-types";

export default function MilestoneCard({ milestone, proj, onOpen }) {
	const projectColor = proj.color || "var(--color-text-secondary)";

	return (
		<div data-testid={`milestone-item-${milestone.id}`} className="relative">
			<span
				style={{
					position: "absolute",
					left: "-26px",
					top: 20,
					width: 14,
					height: 14,
					borderRadius: 0,
					backgroundColor: projectColor,
					border: "2px solid var(--color-background-surface)",
					boxShadow: `0 0 0 2px color-mix(in srgb, ${projectColor} 28%, transparent)`,
					zIndex: 1,
					display: "inline-block",
				}}
			/>

			<div
				className="card"
				style={{
					border: "1px solid var(--color-border)",
					background:
						"color-mix(in srgb, var(--color-background-surface) 55%, transparent)",
					padding: 0,
					overflow: "hidden",
				}}
			>
				<button
					type="button"
					onClick={() => onOpen(milestone)}
					aria-label={`View release details for ${milestone.title}`}
					style={{
						width: "100%",
						textAlign: "left",
						background: "transparent",
						border: "none",
						cursor: "pointer",
						padding: "1rem",
						color: "inherit",
					}}
				>
					<div className="flex items-center justify-between flex-wrap gap-2 mb-2">
						<div className="flex items-center gap-2 flex-wrap">
							<span
								className="chip chip-sm"
								style={{
									backgroundColor: `color-mix(in srgb, ${projectColor} 12%, transparent)`,
									color: projectColor,
									fontWeight: 600,
									border: `1px solid color-mix(in srgb, ${projectColor} 28%, transparent)`,
								}}
							>
								{proj.shortName || milestone.project}
							</span>
							<span
								className="chip chip-sm"
								style={{
									fontFamily: "var(--font-family-code)",
									fontWeight: 600,
								}}
							>
								{milestone.version}
							</span>
							<span
								className="chip chip-sm chip-primary"
								style={{ fontSize: "0.68rem" }}
							>
								{milestone.badge}
							</span>
						</div>

						<div className="flex items-center gap-1 text-secondary">
							<Calendar size={13} />
							<span className="editorial-meta italic">
								{milestone.displayDate}
							</span>
						</div>
					</div>

					<h4
						className="editorial-card-title"
						style={{ margin: "0 0 0.5rem", fontSize: "1.2rem" }}
					>
						{milestone.title}
					</h4>

					<p
						className="editorial-body"
						style={{
							fontSize: "0.875rem",
							lineHeight: 1.5,
							marginBottom: "0.75rem",
							color: "var(--color-text-secondary)",
						}}
					>
						{milestone.summary}
					</p>

					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							flexWrap: "wrap",
							gap: "0.5rem",
							paddingTop: "0.5rem",
							borderTop: "1px dashed var(--color-border)",
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.35rem",
								flexWrap: "wrap",
							}}
						>
							{(milestone.tags || []).slice(0, 4).map((tag) => (
								<span
									key={tag}
									className="chip chip-sm"
									style={{ fontSize: "0.68rem" }}
								>
									{tag}
								</span>
							))}
						</div>

						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "4px",
								color: "var(--color-text-secondary)",
								fontFamily: "var(--font-family-code)",
								fontSize: "0.75rem",
							}}
						>
							<GitCommit size={14} />
							<span>{milestone.commit}</span>
						</div>
					</div>
				</button>
			</div>
		</div>
	);
}

MilestoneCard.propTypes = {
	milestone: PropTypes.object.isRequired,
	proj: PropTypes.object.isRequired,
	onOpen: PropTypes.func.isRequired,
};
