import {
	ArrowUpDown,
	Calendar,
	Filter,
	GitCommit,
	RotateCcw,
	Search,
	X,
} from "lucide-react";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import MilestoneChangelogDrawer from "@/components/MilestoneChangelogDrawer";
import timelineData from "@/content/timelineMilestones.json";
import { useThemeContext } from "@/contexts/ThemeContext";

export const PROJECT_CONFIG = timelineData.projectConfig;
export const TIMELINE_MILESTONES = timelineData.milestones;

export default function ProjectTimeline({ limit = null }) {
	const { mode } = useThemeContext();
	const isDark = mode === "dark";

	const [selectedProject, setSelectedProject] = useState("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortDesc, setSortDesc] = useState(true);
	const [activeMilestone, setActiveMilestone] = useState(null);
	const [visibleCount, setVisibleCount] = useState(limit || Infinity);

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
							<ArrowUpDown size={14} />
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
								<RotateCcw size={14} />
								<span>Reset Filters</span>
							</button>
						)}
					</div>
				</div>

				<div style={{ position: "relative", marginBottom: "1rem" }}>
					<Search
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
							<X size={16} />
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
						<Filter size={14} /> Repos:
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
						<RotateCcw size={14} />
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
						{filteredMilestones.slice(0, visibleCount).map((milestone) => {
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
													<Calendar size={13} />
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
													<GitCommit size={14} />
													<span>{milestone.commit}</span>
												</div>
											</div>
										</button>
									</div>
								</div>
							);
						})}
					</div>

					{limit && filteredMilestones.length > visibleCount && (
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								marginTop: "2rem",
							}}
						>
							<button
								type="button"
								onClick={() => setVisibleCount((prev) => prev + (limit || 6))}
								className="btn btn-outlined btn-sm"
								style={{
									fontFamily: "var(--font-family-code, monospace)",
									letterSpacing: "0.08em",
									textTransform: "uppercase",
								}}
							>
								Load More Milestones ({filteredMilestones.length - visibleCount}{" "}
								remaining)
							</button>
						</div>
					)}
				</div>
			)}

			{/* Slide-over Changelog Drawer */}
			<MilestoneChangelogDrawer
				activeMilestone={activeMilestone}
				onClose={handleCloseDrawer}
				isDark={isDark}
				projectConfig={PROJECT_CONFIG}
			/>
		</div>
	);
}

ProjectTimeline.propTypes = {
	limit: PropTypes.number,
};
