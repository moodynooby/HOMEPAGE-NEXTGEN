import { Calendar, ExternalLink, GitCommit, X } from "lucide-react";
import PropTypes from "prop-types";
import { SITE_GITHUB_PROFILE } from "@/config/site";
import { socialIcons } from "@/utils/socialIcons";

const GitHubIcon = socialIcons.github;

export default function MilestoneChangelogDrawer({
	activeMilestone,
	onClose,
	isDark,
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
					background: isDark ? "#282a21" : "#fdffda",
					color: "var(--color-text-primary, #38392e)",
					padding: "1.5rem",
					boxShadow: isDark
						? "-4px 0 24px rgba(0,0,0,0.7)"
						: "-4px 0 24px rgba(56,57,46,0.15)",
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
						borderBottom: "1px solid var(--color-border, var(--hairline-rule))",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
						}}
					>
						<span
							className="chip chip-sm"
							style={{
								backgroundColor: `${config.color || "#888"}20`,
								color: config.color || "#888",
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

					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "1rem",
							flexWrap: "wrap",
							color: "var(--color-text-secondary, #7d5d53)",
							marginBottom: "1.5rem",
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "4px",
							}}
						>
							<Calendar size={14} />
							<span className="editorial-meta">
								{activeMilestone.displayDate}
							</span>
						</div>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "4px",
							}}
						>
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
							border: "1px solid var(--color-border, var(--hairline-rule))",
							background: isDark
								? "rgba(40, 42, 33, 0.6)"
								: "rgba(255, 255, 255, 0.8)",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							gap: "0.5rem",
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.5rem",
							}}
						>
							<GitCommit
								size={18}
								style={{ color: "var(--color-text-secondary, #7d5d53)" }}
							/>
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
							className="btn btn-outlined btn-sm"
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "4px",
							}}
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
							color: "var(--color-text-secondary, #7d5d53)",
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
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "0.5rem",
							marginBottom: "1.5rem",
						}}
					>
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
										backgroundColor:
											config.color || "var(--color-accent, #7d5d53)",
										marginTop: "7px",
										flexShrink: 0,
										display: "inline-block",
									}}
								/>
								<span
									style={{
										fontSize: "0.875rem",
										lineHeight: 1.5,
										fontFamily: "var(--font-family-body, serif)",
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
								border: "1px solid #f59e0b",
								background: isDark
									? "rgba(245, 158, 11, 0.1)"
									: "rgba(245, 158, 11, 0.08)",
							}}
						>
							<span
								style={{
									fontWeight: 700,
									color: "#d97706",
									display: "block",
									marginBottom: "0.25rem",
									fontFamily:
										"var(--font-family-code, 'Work Sans', sans-serif)",
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
						borderTop: "1px solid var(--color-border, var(--hairline-rule))",
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
	isDark: PropTypes.bool,
	projectConfig: PropTypes.object,
};
