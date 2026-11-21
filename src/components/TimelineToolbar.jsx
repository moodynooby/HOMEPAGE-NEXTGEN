import { ArrowUpDown, Filter, RotateCcw, Search, X } from "lucide-react";
import PropTypes from "prop-types";

export default function TimelineToolbar({
	sortDesc,
	setSortDesc,
	handleResetFilters,
	selectedProject,
	setSelectedProject,
	searchQuery,
	setSearchQuery,
	projectFilterOptions,
}) {
	return (
		<div className="mb-6">
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
							color: "var(--color-text-secondary)",
						}}
					>
						Chronological evolution and release changelog across the 5 ecosystem
						applications.
					</p>
				</div>

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => setSortDesc(!sortDesc)}
						className="btn btn-outlined btn-sm inline-flex items-center gap-1"
						aria-label={sortDesc ? "Sort oldest first" : "Sort newest first"}
					>
						<ArrowUpDown size={14} />
						<span>{sortDesc ? "Newest first" : "Oldest first"}</span>
					</button>

					{(selectedProject !== "All" || searchQuery) && (
						<button
							type="button"
							onClick={handleResetFilters}
							className="btn btn-outlined btn-sm inline-flex items-center gap-1"
							aria-label="Reset filters"
						>
							<RotateCcw size={14} />
							<span>Reset Filters</span>
						</button>
					)}
				</div>
			</div>

			<div className="relative mb-4">
				<Search
					size={16}
					style={{
						position: "absolute",
						left: "12px",
						top: "50%",
						transform: "translateY(-50%)",
						color: "var(--color-text-secondary)",
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

			<div className="flex items-center gap-2 flex-wrap">
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
					const dotColor = opt.color || "var(--color-text-primary)";
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
	);
}

TimelineToolbar.propTypes = {
	sortDesc: PropTypes.bool.isRequired,
	setSortDesc: PropTypes.func.isRequired,
	handleResetFilters: PropTypes.func.isRequired,
	selectedProject: PropTypes.string.isRequired,
	setSelectedProject: PropTypes.func.isRequired,
	searchQuery: PropTypes.string.isRequired,
	setSearchQuery: PropTypes.func.isRequired,
	projectFilterOptions: PropTypes.array.isRequired,
};
