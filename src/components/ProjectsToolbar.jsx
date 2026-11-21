import { RotateCcw as RestartAlt, Search } from "lucide-react";
import PropTypes from "prop-types";
import { SORT_OPTIONS } from "@/hooks/useProjectFilters";

export default function ProjectsToolbar({
	activeCategory,
	setActiveCategory,
	searchQuery,
	setSearchQuery,
	sortBy,
	setSortBy,
	selectedLanguages,
	toggleLanguage,
	categories,
	categoryCounts,
	bookmarks,
	totalProjects,
	allLanguages,
	activeFiltersCount,
	handleResetFilters,
}) {
	return (
		<>
			<div
				style={{
					display: "flex",
					alignItems: "baseline",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "0.5rem",
					borderBottom: "1px solid var(--color-border)",
					paddingBottom: "1.5rem",
					marginBottom: "2rem",
				}}
			>
				<div className="flex items-center gap-4">
					<h1 className="editorial-headline" style={{ margin: 0 }}>
						The Project Ledger
					</h1>
					{activeFiltersCount > 0 && (
						<span
							className="badge"
							style={{
								background: "var(--color-primary)",
								color: "var(--color-background-body)",
								padding: "2px 8px",
								fontSize: "0.72rem",
								fontWeight: 600,
								fontFamily: "var(--font-family-code)",
							}}
						>
							{activeFiltersCount}
						</span>
					)}
				</div>
				<div className="flex items-center gap-4">
					{activeFiltersCount > 0 && (
						<button
							type="button"
							onClick={handleResetFilters}
							className="btn btn-outlined btn-sm inline-flex items-center gap-1"
						>
							<RestartAlt size={14} />
							<span>Reset All Filters</span>
						</button>
					)}
					<p className="editorial-meta" style={{ margin: 0 }}>
						A running index of shipped work
					</p>
				</div>
			</div>

			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					gap: "1rem",
					marginBottom: "2rem",
					alignItems: "flex-end",
				}}
			>
				<div
					style={{
						position: "relative",
						maxWidth: "560px",
						flex: "1 1 300px",
					}}
				>
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
						type="search"
						value={searchQuery}
						onChange={(event) => setSearchQuery(event.target.value)}
						placeholder="Filter by name, tagline, or technology"
						aria-label="Search projects"
						className="input"
						style={{ paddingLeft: "36px", width: "100%" }}
					/>
				</div>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "4px",
						minWidth: "200px",
					}}
				>
					<label
						id="sort-select-label"
						htmlFor="sort-select"
						style={{
							fontFamily: "var(--font-family-code)",
							fontSize: "0.72rem",
							letterSpacing: "0.1em",
							textTransform: "uppercase",
							color: "var(--color-text-secondary)",
						}}
					>
						Sort By
					</label>
					<select
						id="sort-select"
						aria-labelledby="sort-select-label"
						aria-label="Sort By"
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
						className="select w-full"
					>
						{SORT_OPTIONS.map((opt) => (
							<option key={opt} value={opt}>
								{opt}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="mb-4">
				<p
					className="editorial-meta"
					style={{ display: "block", marginBottom: "0.5rem" }}
				>
					Categories
				</p>
				<div className="flex flex-wrap gap-2">
					{categories.map((category) => {
						let count = 0;
						if (category === "All") {
							count = totalProjects;
						} else if (category === "Bookmarked") {
							count = bookmarks.length;
						} else {
							count = categoryCounts[category] || 0;
						}
						const label =
							category === "Bookmarked"
								? `Saved (${count})`
								: `${category} · ${count}`;
						const isActive = activeCategory === category;
						return (
							<button
								type="button"
								key={category}
								onClick={() => setActiveCategory(category)}
								className={`chip ${isActive ? "chip-primary" : ""}`}
							>
								{label}
							</button>
						);
					})}
				</div>
			</div>

			{allLanguages.length > 0 && (
				<div style={{ marginBottom: "3rem" }}>
					<p
						className="editorial-meta"
						style={{ display: "block", marginBottom: "0.5rem" }}
					>
						Technologies / Languages
					</p>
					<div className="flex flex-wrap gap-2">
						{allLanguages.map((lang) => {
							const isSelected = selectedLanguages.includes(lang);
							return (
								<button
									type="button"
									key={lang}
									onClick={() => toggleLanguage(lang)}
									className={`chip chip-sm ${isSelected ? "chip-primary" : ""}`}
								>
									{lang}
								</button>
							);
						})}
					</div>
				</div>
			)}
		</>
	);
}

ProjectsToolbar.propTypes = {
	activeCategory: PropTypes.string.isRequired,
	setActiveCategory: PropTypes.func.isRequired,
	searchQuery: PropTypes.string.isRequired,
	setSearchQuery: PropTypes.func.isRequired,
	sortBy: PropTypes.string.isRequired,
	setSortBy: PropTypes.func.isRequired,
	selectedLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
	toggleLanguage: PropTypes.func.isRequired,
	categories: PropTypes.arrayOf(PropTypes.string).isRequired,
	categoryCounts: PropTypes.object.isRequired,
	bookmarks: PropTypes.array.isRequired,
	totalProjects: PropTypes.number.isRequired,
	allLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
	activeFiltersCount: PropTypes.number.isRequired,
	handleResetFilters: PropTypes.func.isRequired,
};
