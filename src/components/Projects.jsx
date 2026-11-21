import { motion, useReducedMotion } from "motion/react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import ProjectsLedger from "@/components/ProjectsLedger";
import ProjectsSkeleton from "@/components/ProjectsSkeleton";
import ProjectsToolbar from "@/components/ProjectsToolbar";
import { useBookmarksContext } from "@/contexts/BookmarksContext";
import useIsMobile from "@/hooks/useIsMobile";
import useProjectFilters from "@/hooks/useProjectFilters";
import useProjectsData from "@/hooks/useProjectsData";

export default function Projects({ showAppBar = true }) {
	const isMobile = useIsMobile();
	const { projects, loading, loadError } = useProjectsData();
	const location = useLocation();
	const shouldReduceMotion = useReducedMotion();
	const { bookmarks, isBookmarked } = useBookmarksContext();
	const filters = useProjectFilters(projects, isBookmarked, location);

	if (loading) return <ProjectsSkeleton />;

	if (loadError) {
		return (
			<div
				className="editorial-container"
				style={{ minHeight: "60vh", padding: "4rem 0" }}
			>
				<div className="alert alert-error">{loadError}</div>
			</div>
		);
	}

	return (
		<>
			{showAppBar && <Header />}
			<main
				id="main-content"
				style={{
					paddingTop: showAppBar ? "3rem" : 0,
					paddingBottom: "5rem",
					position: "relative",
					minHeight: "100vh",
				}}
			>
				<div className="editorial-container">
					<motion.div
						initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={
							shouldReduceMotion ? { duration: 0 } : { duration: 0.7 }
						}
					>
						<ProjectsToolbar
							activeCategory={filters.activeCategory}
							setActiveCategory={filters.setActiveCategory}
							searchQuery={filters.searchQuery}
							setSearchQuery={filters.setSearchQuery}
							sortBy={filters.sortBy}
							setSortBy={filters.setSortBy}
							selectedLanguages={filters.selectedLanguages}
							toggleLanguage={filters.toggleLanguage}
							categories={filters.categories}
							categoryCounts={filters.categoryCounts}
							bookmarks={bookmarks}
							totalProjects={projects.length}
							allLanguages={filters.allLanguages}
							activeFiltersCount={filters.activeFiltersCount}
							handleResetFilters={filters.handleResetFilters}
						/>
					</motion.div>

					<ProjectsLedger
						filteredProjects={filters.filteredProjects}
						sortedFilteredProjects={filters.sortedFilteredProjects}
						groupedProjects={filters.groupedProjects}
						years={filters.years}
						isGroupedByYear={filters.isGroupedByYear}
						isMobile={isMobile}
						shouldReduceMotion={shouldReduceMotion}
						entryNumbers={filters.entryNumbers}
						activeCategory={filters.activeCategory}
					/>
				</div>
			</main>
		</>
	);
}

Projects.propTypes = {
	showAppBar: PropTypes.bool,
};
