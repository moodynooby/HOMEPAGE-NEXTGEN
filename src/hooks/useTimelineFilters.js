import { useMemo, useState } from "react";
import { FILTER_ALL } from "@/config/ledger";
import {
	PROJECT_CONFIG,
	TIMELINE_MILESTONES,
} from "@/content/timelineMilestones";

export default function useTimelineFilters(limit = null) {
	const [selectedProject, setSelectedProject] = useState(FILTER_ALL);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortDesc, setSortDesc] = useState(true);
	const [activeMilestone, setActiveMilestone] = useState(null);
	const [visibleCount, setVisibleCount] = useState(limit || Infinity);

	const projectFilterOptions = useMemo(() => {
		const projects = Object.keys(PROJECT_CONFIG);
		const counts = { [FILTER_ALL]: TIMELINE_MILESTONES.length };
		for (const project of projects) {
			counts[project] = TIMELINE_MILESTONES.filter(
				(milestone) => milestone.project === project,
			).length;
		}
		return [
			{
				id: FILTER_ALL,
				label: "All Repositories",
				count: counts[FILTER_ALL],
			},
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
				selectedProject === FILTER_ALL || milestone.project === selectedProject;
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
		setActiveMilestone,
		visibleCount,
		setVisibleCount,
		projectFilterOptions,
		filteredMilestones,
		resetFilters: () => {
			setSelectedProject(FILTER_ALL);
			setSearchQuery("");
		},
	};
}
