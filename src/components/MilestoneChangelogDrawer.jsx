import { Calendar, ExternalLink, GitCommit, X } from "lucide-react";
import PropTypes from "prop-types";
import { SITE_GITHUB_PROFILE } from "@/config/site";
import { socialIcons } from "@/utils/socialIcons";

const GitHubIcon = socialIcons.github;

export default function MilestoneChangelogDrawer({
	activeMilestone,
	onClose,
	projectConfig = {},
}) {
	if (!activeMilestone) return null;

	const config = projectConfig[activeMilestone.project] || {};

	return (
		<div
			role="presentation"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
			style={{
				position: "fixed",
				inset: 0,
				background: "rgba(0, 0, 0, 0.4)",
				backdropFilter: "blur(2px)",
				zIndex: 9999,
				display: "flex",
				justifyContent: "flex-end",
			}}
		>
			<aside
				data-testid="milestone-drawer"
				role="dialog"
				aria-modal="true"
				aria-labelledby="drawer-title"
				tabIndex={-1}
				onKeyDown={(e) => {
					if (e.key === "Escape") onClose();
				}}
				style={{
					width: "100%",
					maxWidth: "540px",
					height: "100%",
					background: "var(--color-background-surface)",
					color: "var(--color-text-primary)",
					padding: "1.5rem",
					borderLeft: "1px solid var(--color-border)",
					display: "flex",
					flexDirection: "column",
					overflowY: "auto",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						paddingBottom: "1rem",
						borderBottom: "1px solid var(--color-border)",
					}}
				>
					<div className="flex items-center gap-2">
						<span
							className="chip chip-sm"
							style={{
								backgroundColor: `color-mix(in srgb, ${config.color || "var(--color-text-secondary)"} 12%, transparent)`,
								color: config.color || "var(--color-text-secondary)",
								fontWeight: 600,
							}}
						>
							{config.shortName || activeMilestone.project}
						</span>
						<span
							className="chip chip-sm"
							style={{ fontFamily: "monospace", fontWeight: 700 }}
						>
							{activeMilestone.version}
						</span>
						<span className="chip chip-sm chip-primary">
							{activeMilestone.badge}
						</span>
					</div>

					<button
						type="button"
						onClick={onClose}
						aria-label="Close changelog drawer"
						data-testid="close-drawer"
						className="icon-btn"
					>
						<X size={16} />
					</button>
				</div>

				<div style={{ flex: 1, padding: "1.5rem 0" }}>
					<p className="editorial-meta">Release Changelog &amp; Architecture</p>

					<h3
						className="editorial-headline"
						id="drawer-title"
						data-testid="drawer-title"
						style={{
							fontSize: "1.75rem",
							lineHeight: 1.2,
							marginTop: "0.25rem",
							marginBottom: "1rem",
						}}
					>
						{activeMilestone.title}
					</h3>

					<div className="flex items-center gap-4 flex-wrap text-secondary mb-6">
						<div className="flex items-center gap-1">
							<Calendar size={14} />
							<span className="editorial-meta">
								{activeMilestone.displayDate}
							</span>
						</div>
						<div className="flex items-center gap-1">
							{GitHubIcon && <GitHubIcon size={14} />}
							<span
								className="editorial-meta"
								style={{ fontFamily: "monospace" }}
							>
								{config.repo || activeMilestone.project}
							</span>
						</div>
					</div>

					<div
						style={{
							padding: "1rem",
							marginBottom: "1.5rem",
							border: "1px solid var(--color-border)",
							background:
								"color-mix(in srgb, var(--color-background-surface) 70%, transparent)",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							gap: "0.5rem",
						}}
					>
						<div className="flex items-center gap-2">
							<GitCommit size={18} className="text-secondary" />
							<div>
								<span className="editorial-meta" style={{ display: "block" }}>
									Verified Commit
								</span>
								<span
									style={{
										fontFamily: "monospace",
										fontWeight: 700,
										fontSize: "0.875rem",
									}}
								>
									{activeMilestone.commit}
								</span>
							</div>
						</div>

						<a
							href={activeMilestone.commitUrl}
							target="_blank"
							rel="noopener noreferrer"
							data-testid="drawer-commit-link"
							aria-label="View commit on GitHub"
							className="btn btn-outlined btn-sm inline-flex items-center gap-1"
						>
							<span>View on GitHub</span>
							<ExternalLink size={13} />
						</a>
					</div>

					<p
						className="editorial-meta"
						style={{ fontWeight: 600, marginBottom: "0.5rem" }}
					>
						Summary
					</p>
					<p
						className="editorial-body"
						style={{
							marginBottom: "1.5rem",
							lineHeight: 1.6,
							color: "var(--color-text-secondary)",
						}}
					>
						{activeMilestone.summary}
					</p>

					<p
						className="editorial-meta"
						style={{ fontWeight: 600, marginBottom: "0.5rem" }}
					>
						Key Deliverables &amp; Changes
					</p>
					<div className="flex flex-col gap-2 mb-6">
						{(activeMilestone.details || []).map((detail) => (
							<div
								key={detail}
								style={{
									display: "flex",
									alignItems: "flex-start",
									gap: "0.5rem",
								}}
							>
								<span
									style={{
										width: 6,
										height: 6,
										borderRadius: "50%",
										backgroundColor: config.color || "var(--color-accent)",
										marginTop: "7px",
										flexShrink: 0,
										display: "inline-block",
									}}
								/>
								<span
									style={{
										fontSize: "0.875rem",
										lineHeight: 1.5,
										fontFamily: "var(--font-family-body)",
									}}
								>
									{detail}
								</span>
							</div>
						))}
					</div>

					{activeMilestone.breakingChanges && (
						<div
							style={{
								padding: "1rem",
								marginBottom: "1.5rem",
								border: "1px solid var(--color-status-maintenance)",
								background:
									"color-mix(in srgb, var(--color-status-maintenance) 10%, transparent)",
							}}
						>
							<span
								style={{
									fontWeight: 700,
									color: "var(--color-status-maintenance)",
									display: "block",
									marginBottom: "0.25rem",
									fontFamily: "var(--font-family-code)",
									fontSize: "0.75rem",
									textTransform: "uppercase",
								}}
							>
								Breaking Changes &amp; Schema Updates
							</span>
							<span style={{ fontSize: "0.875rem" }}>
								{activeMilestone.breakingChanges}
							</span>
						</div>
					)}

					<p
						className="editorial-meta"
						style={{ fontWeight: 600, marginBottom: "0.5rem" }}
					>
						Tags &amp; Capabilities
					</p>
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: "0.35rem",
						}}
					>
						{(activeMilestone.tags || []).map((tag) => (
							<span key={tag} className="chip chip-sm">
								{tag}
							</span>
						))}
					</div>
				</div>

				<div
					style={{
						paddingTop: "1rem",
						borderTop: "1px solid var(--color-border)",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<button
						type="button"
						onClick={onClose}
						className="btn btn-outlined btn-sm"
					>
						Close
					</button>
					<a
						href={config.repoUrl || SITE_GITHUB_PROFILE}
						target="_blank"
						rel="noopener noreferrer"
						className="btn btn-contained btn-sm"
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: "6px",
						}}
					>
						<span>Open Repository</span>
						{GitHubIcon && <GitHubIcon size={14} />}
					</a>
				</div>
			</aside>
		</div>
	);
}

MilestoneChangelogDrawer.propTypes = {
	activeMilestone: PropTypes.object,
	onClose: PropTypes.func.isRequired,
	projectConfig: PropTypes.object,
};
