import {
	Calendar as CalendarTodayIcon,
	X as ClearIcon,
	X as CloseIcon,
	GitCommit as CommitIcon,
	Filter as FilterAltIcon,
	ExternalLink as LaunchIcon,
	RotateCcw as RestartAltIcon,
	Search as SearchIcon,
	ArrowUpDown as SwapVertIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import timelineData from "@/content/timelineMilestones.json";
import { useThemeContext } from "@/contexts/ThemeContext";
import { socialIcons } from "@/utils/socialIcons";

const GitHubIcon = socialIcons.GitHub;

export const PROJECT_CONFIG = timelineData.projectConfig;
export const TIMELINE_MILESTONES = timelineData.milestones;

export default function ProjectTimeline() {
	const { mode } = useThemeContext();
	const isDark = mode === "dark";

	const [selectedProject, setSelectedProject] = useState("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortDesc, setSortDesc] = useState(true);
	const [activeMilestone, setActiveMilestone] = useState(null);

	const projectFilterOptions = useMemo(() => {
		const projects = Object.keys(PROJECT_CONFIG);
		const counts = { All: TIMELINE_MILESTONES.length };
		for (const p of projects) {
			counts[p] = TIMELINE_MILESTONES.filter((m) => m.project === p).length;
		}
		return [
			{ id: "All", label: "All Repositories", count: counts.All },
			...projects.map((p) => ({
				id: p,
				label: PROJECT_CONFIG[p].shortName || p,
				count: counts[p] || 0,
				color: PROJECT_CONFIG[p].color,
			})),
		];
	}, []);

	const filteredMilestones = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return TIMELINE_MILESTONES.filter((milestone) => {
			const matchesProject =
				selectedProject === "All" || milestone.project === selectedProject;
			if (!matchesProject) return false;

			if (!query) return true;

			const matchText = [
				milestone.title,
				milestone.summary,
				milestone.version,
				milestone.project,
				milestone.commit,
				milestone.badge,
				...(milestone.tags || []),
				...(milestone.details || []),
			]
				.join(" ")
				.toLowerCase();

			return matchText.includes(query);
		}).sort((a, b) => {
			const timeA = new Date(a.date).getTime();
			const timeB = new Date(b.date).getTime();
			return sortDesc ? timeB - timeA : timeA - timeB;
		});
	}, [selectedProject, searchQuery, sortDesc]);

	const handleResetFilters = () => {
		setSelectedProject("All");
		setSearchQuery("");
	};

	const handleOpenDrawer = (milestone) => {
		setActiveMilestone(milestone);
	};

	const handleCloseDrawer = () => {
		setActiveMilestone(null);
	};

	return (
		<div
			className="card"
			data-testid="project-timeline"
			style={{
				padding: "1.5rem",
				border: "1px solid var(--color-border, var(--hairline-rule))",
				background: isDark
					? "rgba(40, 42, 33, 0.65)"
					: "rgba(253, 255, 218, 0.5)",
				position: "relative",
			}}
		>
			<div style={{ marginBottom: "1.5rem" }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						flexWrap: "wrap",
						gap: "0.75rem",
						marginBottom: "1rem",
					}}
				>
					<div>
						<h3
							className="editorial-subheading"
							style={{ margin: 0, fontSize: "clamp(1.5rem, 3vw, 1.85rem)" }}
						>
							Interactive Project Timeline &amp; Release Milestones
						</h3>
						<p
							className="editorial-body"
							style={{
								fontStyle: "italic",
								margin: "0.25rem 0 0",
								color: "var(--color-text-secondary, #7d5d53)",
							}}
						>
							Chronological evolution and release changelog across the 5
							ecosystem applications.
						</p>
					</div>

					<div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
						<button
							type="button"
							onClick={() => setSortDesc(!sortDesc)}
							className="btn btn-outlined btn-sm"
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "4px",
							}}
							aria-label={sortDesc ? "Sort oldest first" : "Sort newest first"}
						>
							<SwapVertIcon size={14} />
							<span>{sortDesc ? "Newest first" : "Oldest first"}</span>
						</button>

						{(selectedProject !== "All" || searchQuery) && (
							<button
								type="button"
								onClick={handleResetFilters}
								className="btn btn-outlined btn-sm"
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: "4px",
								}}
								aria-label="Reset filters"
							>
								<RestartAltIcon size={14} />
								<span>Reset Filters</span>
							</button>
						)}
					</div>
				</div>

				<div style={{ position: "relative", marginBottom: "1rem" }}>
					<SearchIcon
						size={16}
						style={{
							position: "absolute",
							left: "12px",
							top: "50%",
							transform: "translateY(-50%)",
							color: "var(--color-text-secondary, #7d5d53)",
							pointerEvents: "none",
						}}
					/>
					<input
						type="text"
						placeholder="Search milestones, versions, features, or commits..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						data-testid="milestone-search"
						aria-label="Search milestones"
						className="input"
						style={{
							width: "100%",
							paddingLeft: "36px",
							paddingRight: searchQuery ? "36px" : "12px",
						}}
					/>
					{searchQuery && (
						<button
							type="button"
							onClick={() => setSearchQuery("")}
							aria-label="Clear search query"
							className="icon-btn"
							style={{
								position: "absolute",
								right: "8px",
								top: "50%",
								transform: "translateY(-50%)",
								padding: "4px",
							}}
						>
							<ClearIcon size={16} />
						</button>
					)}
				</div>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "0.5rem",
						flexWrap: "wrap",
					}}
				>
					<span
						className="editorial-meta"
						style={{
							display: "flex",
							alignItems: "center",
							gap: "4px",
							marginRight: "0.25rem",
						}}
					>
						<FilterAltIcon size={14} /> Repos:
					</span>

					{projectFilterOptions.map((opt) => {
						const isSelected = selectedProject === opt.id;
						const dotColor = opt.color || "var(--color-text-primary, #38392e)";
						return (
							<button
								type="button"
								key={opt.id}
								onClick={() => setSelectedProject(opt.id)}
								aria-label={`Filter by ${opt.label}`}
								data-testid={`filter-${opt.id}`}
								className={`chip chip-sm ${isSelected ? "chip-primary" : ""}`}
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: "6px",
								}}
							>
								{opt.id !== "All" && (
									<span
										style={{
											width: 8,
											height: 8,
											borderRadius: "50%",
											backgroundColor: dotColor,
											display: "inline-block",
										}}
									/>
								)}
								<span>
									{opt.label} ({opt.count})
								</span>
							</button>
						);
					})}
				</div>
			</div>

			<hr className="editorial-divider" style={{ marginBottom: "1.5rem" }} />

			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "1rem",
				}}
			>
				<span className="editorial-meta">
					Showing {filteredMilestones.length} of {TIMELINE_MILESTONES.length}{" "}
					milestones
					{selectedProject !== "All" && ` in ${selectedProject}`}
					{searchQuery && ` matching "${searchQuery}"`}
				</span>
				<span className="editorial-meta" style={{ fontStyle: "italic" }}>
					Click any card to open changelog details
				</span>
			</div>

			{filteredMilestones.length === 0 ? (
				<div
					style={{
						padding: "3rem 1rem",
						textAlign: "center",
						border: "1px dashed var(--color-border, var(--hairline-rule))",
					}}
				>
					<p
						className="editorial-body"
						style={{
							color: "var(--color-text-secondary, #7d5d53)",
							marginBottom: "1rem",
						}}
					>
						No milestones found matching your filters.
					</p>
					<button
						type="button"
						onClick={handleResetFilters}
						className="btn btn-outlined btn-sm"
						style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
					>
						<RestartAltIcon size={14} />
						<span>Clear Filters</span>
					</button>
				</div>
			) : (
				<div
					style={{
						position: "relative",
						paddingLeft: "1.75rem",
					}}
				>
					<div
						style={{
							position: "absolute",
							left: "8px",
							top: 16,
							bottom: 16,
							width: 2,
							background: "var(--color-border, var(--hairline-rule))",
						}}
					/>

					<div
						style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
					>
						{filteredMilestones.map((milestone) => {
							const proj = PROJECT_CONFIG[milestone.project] || {};
							const projectColor = proj.color || "#888";

							return (
								<div
									key={milestone.id}
									style={{ position: "relative" }}
									data-testid={`milestone-item-${milestone.id}`}
								>
									<span
										style={{
											position: "absolute",
											left: "-26px",
											top: 20,
											width: 14,
											height: 14,
											borderRadius: "50%",
											backgroundColor: projectColor,
											border:
												"2px solid var(--color-background-surface, #fdffda)",
											boxShadow: `0 0 0 2px ${projectColor}44`,
											zIndex: 1,
											display: "inline-block",
										}}
									/>

									<div
										className="card"
										style={{
											border:
												"1px solid var(--color-border, var(--hairline-rule))",
											background: isDark
												? "rgba(40, 42, 33, 0.45)"
												: "rgba(255, 255, 255, 0.65)",
											padding: 0,
											overflow: "hidden",
										}}
									>
										<button
											type="button"
											onClick={() => handleOpenDrawer(milestone)}
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
											<div
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													flexWrap: "wrap",
													gap: "0.5rem",
													marginBottom: "0.5rem",
												}}
											>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "0.5rem",
														flexWrap: "wrap",
													}}
												>
													<span
														className="chip chip-sm"
														style={{
															backgroundColor: `${projectColor}20`,
															color: projectColor,
															fontWeight: 600,
															border: `1px solid ${projectColor}40`,
														}}
													>
														{proj.shortName || milestone.project}
													</span>
													<span
														className="chip chip-sm"
														style={{
															fontFamily: "monospace",
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

												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "4px",
														color: "var(--color-text-secondary, #7d5d53)",
													}}
												>
													<CalendarTodayIcon size={13} />
													<span
														className="editorial-meta"
														style={{ fontStyle: "italic" }}
													>
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
													color: "var(--color-text-secondary, #7d5d53)",
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
													borderTop:
														"1px dashed var(--color-border, var(--hairline-rule))",
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
														color: "var(--color-text-secondary, #7d5d53)",
														fontFamily: "monospace",
														fontSize: "0.75rem",
													}}
												>
													<CommitIcon size={14} />
													<span>{milestone.commit}</span>
												</div>
											</div>
										</button>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Slide-over Changelog Drawer */}
			{activeMilestone && (
				<div
					role="presentation"
					onClick={(e) => {
						if (e.target === e.currentTarget) handleCloseDrawer();
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
							if (e.key === "Escape") handleCloseDrawer();
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
								borderBottom:
									"1px solid var(--color-border, var(--hairline-rule))",
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
										backgroundColor: `${
											PROJECT_CONFIG[activeMilestone.project]?.color || "#888"
										}20`,
										color:
											PROJECT_CONFIG[activeMilestone.project]?.color || "#888",
										fontWeight: 600,
									}}
								>
									{PROJECT_CONFIG[activeMilestone.project]?.shortName ||
										activeMilestone.project}
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
								onClick={handleCloseDrawer}
								aria-label="Close changelog drawer"
								data-testid="close-drawer"
								className="icon-btn"
							>
								<CloseIcon size={16} />
							</button>
						</div>

						<div style={{ flex: 1, padding: "1.5rem 0" }}>
							<p className="editorial-meta">
								Release Changelog &amp; Architecture
							</p>

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
									<CalendarTodayIcon size={14} />
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
										{PROJECT_CONFIG[activeMilestone.project]?.repo ||
											activeMilestone.project}
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
									<CommitIcon
										size={18}
										style={{ color: "var(--color-text-secondary, #7d5d53)" }}
									/>
									<div>
										<span
											className="editorial-meta"
											style={{ display: "block" }}
										>
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
									<LaunchIcon size={13} />
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
													PROJECT_CONFIG[activeMilestone.project]?.color ||
													"var(--color-accent, #7d5d53)",
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
								borderTop:
									"1px solid var(--color-border, var(--hairline-rule))",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<button
								type="button"
								onClick={handleCloseDrawer}
								className="btn btn-outlined btn-sm"
							>
								Close
							</button>
							<a
								href={
									PROJECT_CONFIG[activeMilestone.project]?.repoUrl ||
									"https://github.com/moodynooby"
								}
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
			)}
		</div>
	);
}
