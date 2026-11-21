import { RotateCcw } from "lucide-react";
import PropTypes from "prop-types";
import MilestoneCard from "@/components/MilestoneCard";
import MilestoneChangelogDrawer from "@/components/MilestoneChangelogDrawer";
import TimelineToolbar from "@/components/TimelineToolbar";
import { FILTER_ALL } from "@/config/ledger";
import {
	PROJECT_CONFIG,
	TIMELINE_MILESTONES,
} from "@/content/timelineMilestones";
import useTimelineFilters from "@/hooks/useTimelineFilters";

export default function ProjectTimeline({ limit = null }) {
	const {
		selectedProject,
		setSelectedProject,
		searchQuery,
		setSearchQuery,
		sortDesc,
		setSortDesc,
		activeMilestone,
		visibleCount,
		setVisibleCount,
		projectFilterOptions,
		filteredMilestones,
		resetFilters,
		setActiveMilestone,
	} = useTimelineFilters(limit);

	return (
		<div
			className="card"
			data-testid="project-timeline"
			style={{
				padding: "1.5rem",
				border: "1px solid var(--color-border)",
				background:
					"color-mix(in srgb, var(--color-background-surface) 60%, transparent)",
				position: "relative",
			}}
		>
			<TimelineToolbar
				sortDesc={sortDesc}
				setSortDesc={setSortDesc}
				handleResetFilters={resetFilters}
				selectedProject={selectedProject}
				setSelectedProject={setSelectedProject}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				projectFilterOptions={projectFilterOptions}
				totalProjects={Object.keys(PROJECT_CONFIG).length}
			/>

			<hr className="editorial-divider mb-6" />

			<div className="flex justify-between items-center mb-4">
				<span className="editorial-meta">
					Showing {filteredMilestones.length} of {TIMELINE_MILESTONES.length}{" "}
					milestones
					{selectedProject !== FILTER_ALL && ` in ${selectedProject}`}
					{searchQuery && ` matching "${searchQuery}"`}
				</span>
				<span className="editorial-meta italic">
					Click any card to open changelog details
				</span>
			</div>

			{filteredMilestones.length === 0 ? (
				<div
					style={{
						padding: "3rem 1rem",
						textAlign: "center",
						border: "1px dashed var(--color-border)",
					}}
				>
					<p className="editorial-body text-secondary mb-4">
						No milestones found matching your filters.
					</p>
					<button
						type="button"
						onClick={resetFilters}
						className="btn btn-outlined btn-sm inline-flex items-center gap-1"
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
							background: "var(--color-border)",
						}}
					/>

					<div className="flex flex-col gap-4">
						{filteredMilestones.slice(0, visibleCount).map((milestone) => (
							<MilestoneCard
								key={milestone.id}
								milestone={milestone}
								proj={PROJECT_CONFIG[milestone.project] || {}}
								onOpen={setActiveMilestone}
							/>
						))}
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
								onClick={() => setVisibleCount((prev) => prev + limit)}
								className="btn btn-outlined btn-sm"
								style={{
									fontFamily: "var(--font-family-code)",
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

			<MilestoneChangelogDrawer
				activeMilestone={activeMilestone}
				onClose={() => setActiveMilestone(null)}
				projectConfig={PROJECT_CONFIG}
			/>
		</div>
	);
}

ProjectTimeline.propTypes = {
	limit: PropTypes.number,
};
