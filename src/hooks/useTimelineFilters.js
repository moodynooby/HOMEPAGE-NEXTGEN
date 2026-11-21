import { useMemo, useState } from "react";
import timelineData from "@/content/timelineMilestones.json";

export const PROJECT_CONFIG = timelineData.projectConfig;
export const TIMELINE_MILESTONES = timelineData.milestones;

/** Owns the timeline's filter, sort, pagination and drawer state. */
export default function useTimelineFilters(limit = null) {
	const [selectedProject, setSelectedProject] = useState("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortDesc, setSortDesc] = useState(true);
	const [activeMilestone, setActiveMilestone] = useState(null);
	const [visibleCount, setVisibleCount] = useState(limit || Infinity);

	const projectFilterOptions = useMemo(() => {
		const projects = Object.keys(PROJECT_CONFIG);
		const counts = { All: TIMELINE_MILESTONES.length };
		for (const project of projects) {
			counts[project] = TIMELINE_MILESTONES.filter(
				(milestone) => milestone.project === project,
			).length;
		}
		return [
			{ id: "All", label: "All Repositories", count: counts.All },
			...projects.map((project) => ({
				id: project,
				label: PROJECT_CONFIG[project].shortName || project,
				count: counts[project] || 0,
				color: PROJECT_CONFIG[project].color,
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

			return [
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
				.toLowerCase()
				.includes(query);
		}).sort((a, b) => {
			const timeA = new Date(a.date).getTime();
			const timeB = new Date(b.date).getTime();
			return sortDesc ? timeB - timeA : timeA - timeB;
		});
	}, [selectedProject, searchQuery, sortDesc]);

	return {
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
		resetFilters: () => {
			setSelectedProject("All");
			setSearchQuery("");
		},
		openDrawer: setActiveMilestone,
		closeDrawer: () => setActiveMilestone(null),
	};
}
