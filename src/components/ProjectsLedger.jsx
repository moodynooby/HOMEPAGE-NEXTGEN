import { motion } from "motion/react";
import PropTypes from "prop-types";
import ProjectCard from "@/components/ProjectCard";
import { FILTER_BOOKMARKED } from "@/config/ledger";

export default function ProjectsLedger({
	filteredProjects,
	sortedFilteredProjects,
	groupedProjects,
	years,
	isGroupedByYear,
	isMobile,
	shouldReduceMotion,
	entryNumbers,
	activeCategory,
}) {
	return (
		<>
			{filteredProjects.length === 0 ? (
				<p
					className="editorial-body"
					style={{
						textAlign: "center",
						padding: "5rem 0",
						color: "var(--color-text-secondary)",
					}}
				>
					{activeCategory === FILTER_BOOKMARKED
						? "No bookmarked projects yet. Click the bookmark icon on any project to save it here."
						: "Nothing filed under this heading yet."}
				</p>
			) : (
				<div key={activeCategory} className="relative">
					{!isMobile && isGroupedByYear && (
						<div
							style={{
								position: "absolute",
								left: "50%",
								top: 0,
								bottom: 0,
								width: "1px",
								background: "var(--color-border)",
								transform: "translateX(-50%)",
							}}
						/>
					)}

					{isGroupedByYear ? (
						years.map((year) => (
							<div
								key={year}
								style={{
									marginBottom: "4rem",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									position: "relative",
								}}
							>
								<motion.div
									initial={
										shouldReduceMotion ? false : { scale: 0.9, opacity: 0 }
									}
									whileInView={
										shouldReduceMotion ? undefined : { scale: 1, opacity: 1 }
									}
									viewport={{ once: true }}
									style={{
										background: "var(--color-background-body)",
										border: "1px solid var(--color-border)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										width: 128,
										height: 128,
										borderRadius: "50%",
										marginBottom: "3.5rem",
										zIndex: 2,
									}}
								>
									<p
										style={{
											fontFamily: "var(--font-family-heading)",
											fontSize: "1.75rem",
											fontStyle: "italic",
											fontWeight: 400,
											margin: 0,
										}}
									>
										{year}
									</p>
								</motion.div>
								<div className="w-full">
									{groupedProjects[year].map((project) => (
										<ProjectCard
											key={project.githubName}
											project={project}
											entryNumber={entryNumbers.get(project.githubName)}
											isMobile={isMobile}
											shouldReduceMotion={shouldReduceMotion}
											year={year}
										/>
									))}
								</div>
							</div>
						))
					) : (
						<div className="w-full">
							{sortedFilteredProjects.map((project) => (
								<ProjectCard
									key={project.githubName}
									project={project}
									entryNumber={entryNumbers.get(project.githubName)}
									isMobile={isMobile}
									shouldReduceMotion={shouldReduceMotion}
									year={project.year || "Unknown"}
								/>
							))}
						</div>
					)}
				</div>
			)}
		</>
	);
}

ProjectsLedger.propTypes = {
	filteredProjects: PropTypes.array.isRequired,
	sortedFilteredProjects: PropTypes.array.isRequired,
	groupedProjects: PropTypes.object.isRequired,
	years: PropTypes.arrayOf(PropTypes.string).isRequired,
	isGroupedByYear: PropTypes.bool.isRequired,
	isMobile: PropTypes.bool,
	shouldReduceMotion: PropTypes.bool,
	entryNumbers: PropTypes.instanceOf(Map).isRequired,
	activeCategory: PropTypes.string.isRequired,
};
